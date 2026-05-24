import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import jwt from "jsonwebtoken";
import passport from "./config/passport.config.js";

import authRoute from "./modules/auth/auth.routes.js";
import otpRoute from "./modules/otp/otp.route.js";
import categoryRoute from "./modules/category/category.routes.js";
import campaignRoute from "./modules/campaigns/campaign.routes.js";
import teamRoute from "./modules/teams/team.routes.js";
import paymentRoute from "./modules/payment/payment.routes.js";
import hallOfFameRoute from "./modules/hall-of-fame/hallOfFame.routes.js";
import userRoute from "./modules/users/user.routes.js";
import profileRoute from "./modules/users/profile.routes.js";
import settingsRoute from "./modules/settings/settings.routes.js";
import commentRoute from "./modules/comments/comment.routes.js";
import reactionRoute from "./modules/reactions/reaction.routes.js";
import dashboardRoute from "./modules/dashboard/dashboard.routes.js";
import goodsRoute from "./modules/goods/goods.routes.js";
import supportRoute from "./modules/support/support.routes.js";
import connectDb from "./config/db.js";
import { expireOverdueCampaignsService } from "./modules/campaigns/campaign.service.js";

import Message from "./modules/teams/message.model.js";
import Team from "./modules/teams/team.model.js";

dotenv.config({ quiet: true });

const app = express();

app.use(
	cors({
		origin: process.env.FRONTEND_URL || "http://localhost:3000",
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
		allowedHeaders: ["Content-Type", "Authorization"],
	}),
);

app.use(express.json()); // for parsing application/json

app.use(
	session({
		secret: process.env.JWT_SECRET || "setu_session_secret",
		resave: false,
		saveUninitialized: false,
		cookie: { secure: false },
	}),
);

app.use(passport.initialize());

connectDb().then(() => {
  // Run once on startup, then every hour to mark expired campaigns as completed
  expireOverdueCampaignsService().catch(console.error);
  setInterval(() => {
    expireOverdueCampaignsService().catch(console.error);
  }, 60 * 60 * 1000);
});

const PORT = process.env.PORT || 5000;

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoute);
app.use("/api/otp", otpRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/campaigns", campaignRoute);
app.use("/api/teams", teamRoute);
app.use("/api/payments", paymentRoute);
app.use("/api/hall-of-fame", hallOfFameRoute);
app.use("/api/dashboard", dashboardRoute);
app.use("/api/goods", goodsRoute);
app.use("/api/support", supportRoute);
app.use("/api/users", userRoute);
app.use("/api/profile", profileRoute);
app.use("/api/settings", settingsRoute);
app.use("/api/campaigns/:campaignId/comments", commentRoute);
app.use("/api/campaigns/:campaignId/reactions", reactionRoute);

// Global Error Handler
app.use((err, req, res, next) => {
	console.error("=== GLOBAL ERROR HANDLER ===");
	console.error("Error Object:", err);
	if (typeof err === "object") {
		console.error("Error JSON:", JSON.stringify(err, null, 2));
	}
	console.error("Error Stack/Message:", err?.stack || err?.message);

	const statusCode = err?.status || err?.http_code || err?.statusCode || 500;
	res.status(statusCode).json({
		success: false,
		message: err?.message || "Internal Server Error",
		error: err,
	});
});

// ── HTTP server (wraps Express so Socket.io can share the same port) ──────────
const httpServer = createServer(app);

// ── Socket.io ─────────────────────────────────────────────────────────────────
const io = new Server(httpServer, {
	cors: {
		origin: process.env.FRONTEND_URL || "http://localhost:3000",
		credentials: true,
	},
});

// ── Socket auth middleware — verifies JWT from handshake ──────────────────────
io.use((socket, next) => {
	const token = socket.handshake.auth?.token;
	if (!token) return next(new Error("Unauthorized: no token"));
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		socket.user = { _id: decoded.id, role: decoded.role };
		next();
	} catch {
		next(new Error("Unauthorized: invalid token"));
	}
});

// ── Socket event handlers ─────────────────────────────────────────────────────
io.on("connection", (socket) => {
	// client must emit join_team after connecting
	socket.on("join_team", async (teamId) => {
		try {
			const team = await Team.findById(teamId).lean();
			if (!team) return socket.emit("chat_error", "Team not found.");

			const uid = socket.user._id.toString();
			const isMember =
				team.createdBy.toString() === uid ||
				team.members.some((m) => m.user.toString() === uid);

			if (!isMember) return socket.emit("chat_error", "Not a team member.");

			const room = `team:${teamId}`;
			socket.currentRoom = room; // track for disconnect cleanup
			socket.join(room);

			// broadcast updated online count to the whole room
			const sockets = await io.in(room).allSockets();
			io.to(room).emit("online_count", sockets.size);
		} catch (err) {
			socket.emit("chat_error", err.message);
		}
	});

	// client sends { teamId, text }
	socket.on("send_message", async ({ teamId, text }) => {
		try {
			if (!text?.trim()) return;

			const team = await Team.findById(teamId).lean();
			if (!team) return socket.emit("chat_error", "Team not found.");

			const uid = socket.user._id.toString();
			const isMember =
				team.createdBy.toString() === uid ||
				team.members.some((m) => m.user.toString() === uid);

			if (!isMember) return socket.emit("chat_error", "Not a team member.");

			const message = await Message.create({
				team: teamId,
				sender: socket.user._id,
				text: text.trim(),
			});
			await message.populate("sender", "name email");

			// broadcast to all sockets in this team room (including sender)
			io.to(`team:${teamId}`).emit("new_message", {
				_id: message._id,
				team: teamId,
				sender: message.sender,
				text: message.text,
				createdAt: message.createdAt,
			});
		} catch (err) {
			socket.emit("chat_error", err.message);
		}
	});

	socket.on("leave_team", async (teamId) => {
		const room = `team:${teamId}`;
		socket.leave(room);
		const sockets = await io.in(room).allSockets();
		io.to(room).emit("online_count", sockets.size);
	});

	socket.on("disconnect", async () => {
		if (socket.currentRoom) {
			// Small delay so socket is fully removed from room before counting
			setTimeout(async () => {
				const sockets = await io.in(socket.currentRoom).allSockets();
				io.to(socket.currentRoom).emit("online_count", sockets.size);
			}, 100);
		}
	});
});

// ── Start ─────────────────────────────────────────────────────────────────────
httpServer.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
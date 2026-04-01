import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoute from "./modules/auth/auth.routes.js";
import connectDb from "./config/db.js";
import otpRoute from "./modules/otp/otp.route.js";
import categoryRoute from "./modules/category/category.routes.js";
import campaignRoute from "./modules/campaigns/campaign.routes.js";
import teamRoute from "./modules/teams/team.routes.js";

dotenv.config({ quiet: true });

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

connectDb();

const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoute);
app.use("/api/otp", otpRoute);
app.use("/api/categories", categoryRoute);
app.use("/api/campaigns", campaignRoute);
app.use("/api/teams", teamRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

export default app;

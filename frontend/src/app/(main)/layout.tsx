import type { Metadata } from "next";
import "@/src/app/globals.css";

import ReactQueryProvider from "@/src/app/(main)/(user)/providers/ReactQueryProvider";

export const metadata: Metadata = {
	title: "Setu – Fund Hope. Change Nepal.",
	description: "Setu connects donors, charities, and communities across Nepal.",
	keywords: ["donation", "charity", "Nepal", "crowdfunding", "disaster relief"],
	icons: {
		icon: "/image.png",
	},
};
export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<head></head>
			<body className="antialiased">
				<ReactQueryProvider>
					<main>{children}</main>
				</ReactQueryProvider>
			</body>
		</html>
	);
}

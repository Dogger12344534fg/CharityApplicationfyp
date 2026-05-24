import type { Metadata } from "next";
import { appMetaData } from "@/src/utils/metaData";
import "@/src/app/globals.css";
import { ToastContainer } from "react-toastify";
import ReactQueryProvider from "@/src/app/(main)/(user)/providers/ReactQueryProvider";

export const metadata: Metadata = appMetaData;

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className="antialiased">
				<ReactQueryProvider>
					<ToastContainer />
					{children}
				</ReactQueryProvider>
			</body>
		</html>
	);
}

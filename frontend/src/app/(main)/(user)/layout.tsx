import React from "react";
import { Navbar } from "@/src/components/navbar";
import { Footer } from "@/src/components/footer";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<Navbar />
			{children} <Footer />
		</>
	);
}

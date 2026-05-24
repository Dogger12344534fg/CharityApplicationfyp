import type { Metadata } from "next";
import { appMetaData } from "@/src/utils/metaData";
import "@/src/app/globals.css";

export const metadata: Metadata = appMetaData;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

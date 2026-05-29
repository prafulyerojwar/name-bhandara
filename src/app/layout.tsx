import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/components/auth/AuthProvider";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Nam Bhandara - भंडारा | Food for All 🙏",
  description:
    "Connect Bhandara (food distribution) organizers with NGOs and people in need across Maharashtra. Festival food, temple prasadam, wedding food — share with love.",
  keywords: "bhandara, food distribution, NGO, Maharashtra, Ganesh Chaturthi, prasadam, food sharing",
  openGraph: {
    title: "Nam Bhandara - भंडारा | Food for All",
    description: "Connecting food donors with those in need across Maharashtra",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} h-full`}>
      <body className="min-h-full flex flex-col font-poppins bg-orange-50">
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#1a1a1a",
                color: "#fff",
                borderRadius: "12px",
                padding: "12px 16px",
              },
              success: { iconTheme: { primary: "#f97316", secondary: "#fff" } },
              error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}

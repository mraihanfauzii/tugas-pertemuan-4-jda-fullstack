import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "../provider";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My E-commerce App",
  description: "A professional e-commerce application built with Next.js",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <header className="bg-blue-600 text-white p-4 shadow-md">
            <nav className="container mx-auto flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold hover:text-blue-200">
                My E-commerce
              </Link>
              <ul className="flex space-x-6">
                <li>
                  <Link href="/" className="hover:text-blue-200">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/profile" className="hover:text-blue-200">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link href="/cart" className="hover:text-blue-200">
                    Cart
                  </Link>
                </li>
                {session ? (
                  <>
                    <li>
                      <Link href="/dashboard" className="hover:text-blue-200">
                        Dashboard
                      </Link>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link href="/auth/signin" className="hover:text-blue-200">
                      Sign In
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          </header>
          <main className="flex-grow">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
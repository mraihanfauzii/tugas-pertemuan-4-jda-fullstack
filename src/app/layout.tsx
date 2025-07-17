import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "../provider";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import SignOutButton from "@/components/SignOutButton";

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
  const isAdmin = session?.user?.role === 'admin';

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <header className="bg-blue-600 text-white p-4 shadow-md">
            <nav className="container mx-auto flex justify-between items-center">
              <Link href={session ? "/dashboard" : "/"} className="text-2xl font-bold hover:text-blue-200">
                My E-commerce
              </Link>
              <ul className="flex space-x-6 items-center">
                {session ? (
                  <>
                    <li>
                      <Link href="/dashboard" className="hover:text-blue-200">
                        Dashboard
                      </Link>
                    </li>
                    {isAdmin && ( // <<< Hanya untuk Admin
                      <li>
                          <Link href="/products" className="hover:text-blue-200">
                              Manage Products
                          </Link>
                      </li>
                    )}
                    <li>
                      <Link href="/profile" className="hover:text-blue-200">
                        Profile
                      </Link>
                    </li>
                    {!isAdmin && ( // <<< Hanya untuk User
                      <li>
                        <Link href="/cart" className="hover:text-blue-200">
                          Cart
                        </Link>
                      </li>
                    )}
                    <li>
                      <SignOutButton />
                    </li>
                  </>
                ) : (
                  // Untuk pengguna yang belum login
                  <>
                    <li>
                      <Link href="/cart" className="hover:text-blue-200">
                        Cart
                      </Link>
                    </li>
                    <li>
                      <Link href="/auth/signin" className="hover:text-blue-200">
                        Sign In
                      </Link>
                    </li>
                    <li>
                      <Link href="/auth/register" className="hover:text-blue-200">
                        Register
                      </Link>
                    </li>
                  </>
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
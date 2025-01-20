"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Headphones } from "lucide-react";
import React from "react";

const Appbar = () => {
  const session = useSession();
  // console.log(session.data?.user);

  return (
    <div className="flex justify-between items-center w-full">
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link
          href="/"
          className="flex items-center space-x-2 hover:text-purple-400"
        >
          <Headphones className="h-8 w-8" />
          <span className="text-2xl font-bold">Beat-Jam</span>
        </Link>
        <nav className="hidden md:flex space-x-10">
          <Link
            href="#features"
            className="hover:text-purple-400 transition-colors text-lg font-medium"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="hover:text-purple-400 transition-colors text-lg font-medium"
          >
            How It Works
          </Link>
        </nav>
        {/* <Button variant="outline" className="hidden md:inline-flex">
          Log In
        </Button> */}
        {!session.data?.user ? (
          // <button
          //   className="border bg-blue-500 text-white font-medium px-3 py-1 rounded-md"
          //   onClick={() => signIn()}
          // >
          //   Sign In
          // </button>
          <Button
            variant="secondary"
            className="hidden md:inline-flex"
            onClick={() => signIn()}
          >
            Sign In
          </Button>
        ) : (
          // <button
          //   className="border bg-lime-500 text-white font-medium px-3 py-1 rounded-md"
          //   onClick={() => signOut()}
          // >
          //   Sign Out
          // </button>
          <Button
            variant="secondary"
            className="hidden md:inline-flex"
            onClick={() => signOut()}
          >
            Sign Out
          </Button>
        )}
      </header>
    </div>
  );
};

export default Appbar;

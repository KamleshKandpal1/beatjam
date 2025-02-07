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
        {!session.data?.user ? (
          <Button
            variant="secondary"
            className="hidden md:inline-flex"
            onClick={() => signIn()}
          >
            Sign In
          </Button>
        ) : (
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

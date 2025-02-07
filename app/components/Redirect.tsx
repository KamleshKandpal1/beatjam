"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Redirect = () => {
  const session = useSession();
  const route = useRouter();
  useEffect(() => {
    if (session?.data?.user) {
      route.push("/dashboard");
    }
  }, []);

  return null;
};

export default Redirect;

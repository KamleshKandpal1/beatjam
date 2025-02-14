"use client";
import { log } from "console";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Redirect = () => {
  const session = useSession();
  const route = useRouter();
  console.log(session);

  useEffect(() => {
    if (session?.status) {
      route.push("/dashboard");
    }
  }, []);

  return null;
};

export default Redirect;

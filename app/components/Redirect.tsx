"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Redirect = () => {
  const { status } = useSession();
  const route = useRouter();
  console.log(status);

  useEffect(() => {
    if (status === "authenticated") {
      route.push("/dashboard");
    } else if (status === "unauthenticated") {
      route.push("/"); // Redirect to base directory
    }
  }, [status, route]);

  return null;
};

export default Redirect;

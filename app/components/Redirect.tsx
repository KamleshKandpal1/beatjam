"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Redirect = () => {
  const session = useSession();
  const route = useRouter();
  // console.log(session);

  useEffect(() => {
    if (session?.status) {
      route.push("/dashboard");
    }
  }, [route, session?.status]);

  return null;
};

export default Redirect;

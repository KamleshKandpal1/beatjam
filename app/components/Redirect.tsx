"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const Redirect = () => {
  const { status, data: session } = useSession();
  const route = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return; // Ensure we're on the client side

    const hasShownToast = localStorage.getItem("hasShownToast");

    if (status === "authenticated" && hasShownToast !== "authenticated") {
      route.push("/dashboard");

      setTimeout(() => {
        toast.info(`Welcome, ${session?.user?.name}`);
        localStorage.setItem("hasShownToast", "authenticated"); // Store toast state
      }, 100);
    } else if (
      status === "unauthenticated" &&
      hasShownToast !== "unauthenticated"
    ) {
      route.push("/");

      setTimeout(() => {
        toast.info("Logged-Out");
        localStorage.setItem("hasShownToast", "unauthenticated");
      }, 100);
    }
  }, [status, route, session]);

  return null;
};

export default Redirect;

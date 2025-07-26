import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useSession = () => {
  return useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      return authClient.getSession();
    },
  });
};

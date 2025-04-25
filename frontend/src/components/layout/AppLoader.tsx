import { UserService } from "@/services/userService";
import { useUserStore } from "@/store";
import { useEffect, useState } from "react";

const AppLoader = ({ children }) => {
  const getUser = useUserStore((state) => state.getUser);
  const isLoading = useUserStore((state) => state.isLoading);

  useEffect(() => {
    getUser();
  }, []);

  if (!isLoading) {
    return <>{children}</>;
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-[#0a0f1c] to-[#161e33]">
      <div className="text-xl font-bold text-primary flex items-center animate-pulse">
        <span className="bg-primary text-white rounded-md w-8 h-8 flex items-center justify-center mr-2">
          S
        </span>
        <span className="hidden sm:inline-block">Sphere</span>
      </div>
    </div>
  );
};

export default AppLoader;

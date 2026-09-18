"use client";

import { FaCircle } from "react-icons/fa6";
import { useShoppingListsStore } from "../store";

export const ConnectionStatus = () => {
  const isConnected = useShoppingListsStore((state) => state.isConnected);

  return (
    <div
      className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${
        isConnected
          ? "border-green-200 bg-green-50 text-green-700"
          : "border-gray-200 bg-gray-100 text-gray-500"
      }`}
    >
      <FaCircle className={`w-2 h-2 ${isConnected ? "text-green-500 animate-pulse" : "text-gray-400"}`} />
      {isConnected ? "Live" : "Offline"}
    </div>
  );
};

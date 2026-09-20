"use client";

import * as signalR from "@microsoft/signalr";
import { useEffect, useMemo } from "react";
import { ListItem } from "@/types";
import { useShoppingListsStore } from "./store";

const HUB_URL = process.env.NEXT_PUBLIC_SIGNALR_URL ?? "http://localhost:8080/hubs/shoppingList"

export const SocketConnection = () => {
  const shoppingLists = useShoppingListsStore((state) => state.shoppingLists)
  const setIsConnected = useShoppingListsStore((state) => state.setIsConnected)
  const addListItem = useShoppingListsStore((state) => state.addListItem)
  const updateListItem = useShoppingListsStore((state) => state.updateListItem)
  const removeListItem = useShoppingListsStore((state) => state.removeListItem)

  const listIdsKey = useMemo(() => {
    return shoppingLists.map((list) => list.id).join(",")
  }, [shoppingLists])

  useEffect(() => {
    let cancelled = false;
    const ids = listIdsKey ? listIdsKey.split(",").map(Number) : [];

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: async () => {
          const res = await fetch("/api/signalr-token");
          const data = await res.json();
          return data.accessToken;
        },
      })
      .withAutomaticReconnect()
      .build();

    // The broadcast can arrive before or after the sender's own REST response; addListItem ignores duplicates.
    connection.on("ItemAdded", (item: ListItem) => {
      addListItem(item.listId, item);
    });

    connection.on("ItemUpdated", (item: ListItem) => {
      updateListItem(item.listId, item);
    });

    connection.on("ItemDeleted", (payload: { listId: number; itemId: number }) => {
      removeListItem(payload.listId, payload.itemId);
    });

    connection.start().then(async () => {
      if (cancelled) return;
      console.log("SignalR connected:", connection.connectionId);
      setIsConnected(true);

      for (const id of ids) {
        await connection.invoke("JoinList", id).catch((err) =>
          console.error(`JoinList ${id} failed:`, err)
        );
      }
    }).catch((err) => {
      if (!cancelled) console.error("SignalR connection failed:", err);
    });

    return () => {
      cancelled = true;
      setIsConnected(false);
      connection.stop();
    };
  }, [listIdsKey, setIsConnected, addListItem, updateListItem, removeListItem]);

  return null;
}
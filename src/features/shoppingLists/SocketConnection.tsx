"use client";

import * as signalR from "@microsoft/signalr";
import { useEffect, useMemo } from "react";
import { ListItem } from "@/types";
import { useShoppingListsStore } from "./store";

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
      .withUrl("http://localhost:8080/hubs/shoppingList", {
        accessTokenFactory: async () => {
          const res = await fetch("/api/signalr-token");
          const data = await res.json();
          return data.accessToken;
        },
      })
      .withAutomaticReconnect()
      .build();

    //the sending client has already updated the store, there for compare if id already exist
    connection.on("ItemAdded", (item: ListItem) => {
      const list = useShoppingListsStore.getState().shoppingLists.find((l) => l.id === item.listId);
      const alreadyExists = list?.items.some((i) => i.id === item.id) ?? false;
      if (!alreadyExists) addListItem(item.listId, item);
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
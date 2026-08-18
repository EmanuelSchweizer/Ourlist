import { LoadingSpinner } from "@/components/ui/LoadingScreen";
import { User } from "@/types"
import { Table } from "@heroui/react"
import { useCallback, useRef, useState } from "react";
import { UserActions } from "./UserActions";

const ITEMS_PER_PAGE = 6;

const columns = [
  { id: "name", name: "Name" },
  { id: "email", name: "Email" },
  { id: "role", name: "Role" },
  { id: "actions", name: "Actions" },
];

interface Props {
  users: User[]
}

export const UserTable = ({ users }: Props) => {
  const [items, setItems] = useState<User[]>(() => users.slice(0, ITEMS_PER_PAGE));

  const [isLoading, setIsLoading] = useState(false);
  const isLoadingRef = useRef(false);
  const hasMore = items.length < users.length;

  const loadMore = useCallback(() => {
    if (!hasMore || isLoadingRef.current) return;
    isLoadingRef.current = true;
    setIsLoading(true);
    setTimeout(() => {
      setItems((prev) => users.slice(0, prev.length + ITEMS_PER_PAGE));
      setIsLoading(false);
      requestAnimationFrame(() => {
        isLoadingRef.current = false;
      });
    }, 1500);
  }, [hasMore]);

  return (
    <Table>
      <Table.ScrollContainer className="max-h-[calc(100vh-12rem)] overflow-y-auto">
        <Table.Content aria-label="Async loading table" className="min-w-[600px]">
          <Table.Header className="sticky top-0 z-10 bg-surface-secondary">
            {columns.map((col) => (
              <Table.Column key={col.id} id={col.id} isRowHeader={col.id === "name"}>
                {col.name}
              </Table.Column>
            ))}
          </Table.Header>
          <Table.Body>
            <Table.Collection items={items}>
              {(user) => (
                <Table.Row>
                  <Table.Cell>{user.name}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>{user.roleName}</Table.Cell>
                  <Table.Cell><UserActions user={user}/></Table.Cell>
                </Table.Row>
              )}
            </Table.Collection>
            {!!hasMore && (
              <Table.LoadMore isLoading={isLoading} scrollOffset={0} onLoadMore={loadMore}>
                <Table.LoadMoreContent>
                  <LoadingSpinner/>
                </Table.LoadMoreContent>
              </Table.LoadMore>
            )}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  )
}
import { LoadingSpinner } from "@/components/ui/LoadingScreen";
import { User } from "@/types"
import { Table } from "@heroui/react"
import { useCallback, useMemo, useRef, useState } from "react";
import { UserActions } from "./UserActions";
import { Input } from "@/components/ui/Input";
import { LuSearch } from "react-icons/lu";

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
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const [isLoading, setIsLoading] = useState(false);
  const isLoadingRef = useRef(false);

  const filtered = useMemo(() => {
    const searchText = search.trim().toLowerCase();
    if (!searchText) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(searchText) ||
        u.email.toLowerCase().includes(searchText)
    );
  }, [users, search]);

  const items = useMemo(() => filtered.slice(0, visibleCount), [filtered, visibleCount]);
  const hasMore = visibleCount < filtered.length;

  const loadMore = useCallback(() => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
      setIsLoading(false);
      requestAnimationFrame(() => { isLoadingRef.current = false; });
    }, 1500);
  }, []);

  const handleSearch = (value: string) => {
    setSearch(value);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  return (
    <div className="flex flex-col gap-3">
      <Input
        aria-label="Search users"
        value={search}
        onChange={(event) => handleSearch(event.currentTarget.value)}
        className="max-w-sm"
        placeholder="Search for name or email..."
      />

      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-slate-500">
          Keine Treffer für „{search}"
        </p>
      ) : (
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
                      <Table.Cell><UserActions user={user} /></Table.Cell>
                    </Table.Row>
                  )}
                </Table.Collection>
                {!!hasMore && (
                  <Table.LoadMore isLoading={isLoading} scrollOffset={0} onLoadMore={loadMore}>
                    <Table.LoadMoreContent>
                      <LoadingSpinner />
                    </Table.LoadMoreContent>
                  </Table.LoadMore>
                )}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      )}
    </div>
  )
}
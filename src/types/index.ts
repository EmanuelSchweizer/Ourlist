export type User = {
  id: number;
  name: string;
  email: string;
  roleId: number;
  roleName: string;
};

export type Role = {
  id: number;
  name: string;
}

export type ShoppingList = {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  ownerId: number;
  ownerName: string;
  ownerEmail: string;
  items: ListItem[];
}

export type ListItem = {
  id: number;
  name: string;
  bought: boolean;
  createdAt: Date;
  updatedAt: Date;
  ownerId: number;
  listId: number;
}


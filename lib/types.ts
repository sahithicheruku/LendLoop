import type { ItemStatus, BorrowRequestStatus, UserRole } from "@prisma/client";

export type Item = {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  imageUrl?: string | null;
  createdAt: Date | string;
  status: ItemStatus;
  ownerId: string;
  ownerName?: string | null;
};

export type BorrowRequest = {
  id: string;
  itemId: string;
  requesterId: string;
  status: BorrowRequestStatus;
  item: Item;
};

export type SessionUser = {
  id: string;
  role: UserRole;
  name?: string | null;
  email?: string | null;
};

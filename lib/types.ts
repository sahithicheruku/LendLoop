import type { ItemCondition, ItemStatus, BorrowRequestStatus, UserRole } from "@prisma/client";

export type Item = {
  id: string;
  title: string;
  description?: string | null;
  category: string;
  imageUrl?: string | null;
  city?: string | null;
  region?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  availableFrom?: Date | string | null;
  availableUntil?: Date | string | null;
  condition?: ItemCondition | null;
  createdAt: Date | string;
  status: ItemStatus;
  ownerId: string;
  ownerName?: string | null;
  images?: { id: string; url: string; storagePath: string; position: number }[];
  isFavorited?: boolean;
  reviewCount?: number;
  averageRating?: number | null;
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

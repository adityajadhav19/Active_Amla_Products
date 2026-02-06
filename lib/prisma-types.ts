import { Prisma } from "@prisma/client";

/** Basic model types */
export type User = Prisma.UserGetPayload<{}>;
export type Product = Prisma.ProductGetPayload<{}>;
export type Order = Prisma.OrderGetPayload<{}>;

/** Examples with relations */
export type UserWithOrders = Prisma.UserGetPayload<{
  include: { userOrders: true }
}>;


export type OrderWithUser = Prisma.OrderGetPayload<{
  include: { user: true };
}>;

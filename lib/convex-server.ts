import { ConvexClient } from "convex/browser";

export const convexServer = new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
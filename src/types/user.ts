export type User = {
  id: string; // Added ID for uniqueness
  name: string;
  email: string;
  role: "comprador" | "vendedor";
  avatarUrl?: string;
};

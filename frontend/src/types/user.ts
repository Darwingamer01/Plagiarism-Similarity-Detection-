// User type for authenticated user
export type User = {
  id: string;
  email: string;
  fullName: string;
  role: string;
  hasPassword?: boolean;
};

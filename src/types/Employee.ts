// types/employee.ts
export type Employee = {
  uid: string;
  name: string;
  alias: string;
  role: "admin" | "staff" | "cast";
  enable: boolean;
};
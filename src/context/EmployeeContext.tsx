import { createContext, useContext } from "react";
import type { Employee } from "../types/Employee";

export const EmployeeContext = createContext<{ employee: Employee | null }>({
  employee: null,
});

export const useEmployee = () => useContext(EmployeeContext);

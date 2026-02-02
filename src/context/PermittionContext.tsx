/*
    Context
        システム利用者のシステム利用可否に関する情報
*/
import { createContext, useContext, type ReactNode } from "react";

import { usePermittion } from "../hooks/usePermittion";

import type { Role } from "../constants/roles";
import type { AccessUserStatus } from "../services/accessUserStatus";

export interface Permittion {
  uid: string;
  name: string;
  role: Role;
  enable: boolean;
  accessUserStatus: AccessUserStatus;
};

interface PermittionContextType {
  permittion: Permittion | null;
}

const PermittionContext = createContext<PermittionContextType | undefined>(undefined);

export const PermittionProvider = ({ children }: { children: ReactNode }) => {
  const { attribute } = usePermittion();

  return (
    <PermittionContext.Provider value={{ permittion: attribute }}>
      {children}                  
    </PermittionContext.Provider>
  );
};

export const usePermittionContext = () => {
  const context = useContext(PermittionContext);
  if (context === undefined) {
    throw new Error("usePerMittion は PermittionProvider の中で使ってください");
  }
  return context;
};
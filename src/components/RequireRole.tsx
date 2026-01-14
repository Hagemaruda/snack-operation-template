import { useContext, useEffect } from "react";
import { EmployeeContext } from "../context/EmployeeContext";
import { useNavigate } from "react-router-dom";
import type { Employee } from "../types/Employee";

export default function RequireRole({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: Employee["role"][];
}) {
  const { employee } = useContext(EmployeeContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!employee) return;

    if (!employee.enable) {
      console.error("システム使用権限がありません:", employee.uid);
      alert("システム使用権限がありません");
      navigate("/home", { replace: true });
      return;
    }

    if (!allowedRoles.includes(employee.role)) {
      console.error("権限のない画面アクセスを検知:", employee.uid, employee.role);
      alert("この画面を開く権限がありません");
      navigate("/home", { replace: true });
    }
  }, [employee, allowedRoles, navigate]);

  if (!employee || !employee.enable || !allowedRoles.includes(employee.role)) {
    return null; // まだ判断中 or アクセス不可
  }

  return <>{children}</>;
}

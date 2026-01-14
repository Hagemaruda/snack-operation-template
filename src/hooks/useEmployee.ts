// hooks/useEmployee.ts
import { doc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";

export function useEmployee() {
  const [employee, setEmployee] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setEmployee(null);
        setLoading(false);
        return;
      }

      const ref = doc(db, "employees", user.uid);
      const unsubEmp = onSnapshot(ref, (snap) => {
        setEmployee(snap.exists() ? snap.data() : null);
        setLoading(false);
      });

      return () => unsubEmp();
    });

    return () => unsubAuth();
  }, []);

  return { employee, loading };
}

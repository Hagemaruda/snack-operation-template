import { useState } from "react";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import type { Role } from "../constants/roles";
import { COLLECTIONS } from "../constants/firestore";
import type { EmployeeDoc } from "../types/employee";

export const useEmployeesRegist = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const registerEmployee = async (uid: string, name: string, role: Role) => {
    const targetUid = uid.trim();
    const targetName = name.trim();

    if (!targetUid || !targetName) {
      throw new Error("IDと名前は必須です");
    }

    setIsSubmitting(true);

    try {
      const docRef = doc(db, COLLECTIONS.EMPLOYEES, targetUid);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        throw new Error("このIDは既に登録されています。");
      }

      const newEmployeeData: EmployeeDoc = {
        uid: targetUid,
        name: targetName,
        role: role,
        enable: true,
        wages: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(docRef, newEmployeeData);
      return { uid: targetUid, name: targetName };
    } finally {
      setIsSubmitting(false);
    }
  };

  return { registerEmployee, isSubmitting };
};
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";

export const useLastScheduleDate = (defaultDate: string) => {
  const [minDate, setMinDate] = useState<string>(defaultDate);
  
  useEffect(() => {
    const fetchLatestDate = async () => {
      // shifts コレクションのドキュメントID（日付）を降順で1件取得
      const q = query(collection(db, "shifts"), orderBy("__name__", "desc"), limit(1));
      const snap = await getDocs(q);
      if (!snap.empty) {
        setMinDate(snap.docs[0].id); // 最新の日付IDをセット
      }
    };
    fetchLatestDate();
  }, []);

  return minDate;
};
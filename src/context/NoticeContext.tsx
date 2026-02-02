import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { usePermittion } from '../hooks/usePermittion';

interface Notice {
  id: string;
  title: string;
  isRead: boolean;
  type: string;
  link: string;
}

interface NoticeContextType {
  notices: Notice[];
  unreadCount: number;
}

const NoticeContext = createContext<NoticeContextType>({ notices: [], unreadCount: 0 });

export const NoticeProvider = ({ children }: { children: React.ReactNode }) => {
  const { attribute } = usePermittion();
  const [notices, setNotices] = useState<Notice[]>([]);
  
  useEffect(() => {
    if (!attribute?.uid) return; // ログインしてなければ何もしない

    const q = query(
      collection(db, "userNotices"),
      where("uid", "==", attribute.uid), // 👈 employeeのUIDで監視
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notice));
      setNotices(items);
    });

    return () => unsubscribe();
  }, [attribute?.uid]);
  
  const unreadCount = notices.filter(n => !n.isRead).length;

  return (
    <NoticeContext.Provider value={{ notices, unreadCount }}>
      {children}
    </NoticeContext.Provider>
  );
};

export const useNotices = () => useContext(NoticeContext);
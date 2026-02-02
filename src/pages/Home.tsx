// Home.tsx (確定版)

/*
import { useState, useEffect, useContext, useCallback } from 'react';
import { db } from "../firebase";
import { 
  collectionGroup, 
  query, 
  where, 
  getDocs, 
  doc, 
  onSnapshot 
} from "firebase/firestore";

import { ScheduleManager } from '../components/ScheduleManager';
import AttendanceRequestButton from '../components/AttendanceRequestButton';
import DailyShiftStatusList from '../components/DayliShiftStatusList';

import { isAdmin, isShopStaff } from '../utils/roleUtils';
import { getBusinessDateStr, getBusinessDateDashStr } from '../utils/timeUtils';
import type { Salary } from '../types/salary';

import { useAttendance } from '../hooks/useAttendance';
import { useShiftRequestForm } from '../hooks/useShiftRequestForm';
import { useLastScheduleDate } from '../hooks/useLastScheduleDate';
import { createDefaultUIShift, mapDocToUI, type ShiftRequestDoc, type ShiftRequestUI } from '../types/shiftRequest';
*/


export default function Home() {
  return (<>Home</>);
}


/*.  ##################

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const [salaries, setSalaries] = useState<Record<string, Salary>>({});
  const [schedules, setSchedules] = useState<Record<string, any>>({});
  const [requests, setRequests] = useState<Record<string, ShiftRequestUI>>({});

  const [attendanceState, setAttendanceState] = useState<string | null>(null);
  const [hasShiftToday, setHasShiftToday] = useState(false);

  const now = new Date();
  const businessDateStr = getBusinessDateStr(now);      
  const businessDateDashStr = getBusinessDateDashStr(now); 

  const minDate = useLastScheduleDate(businessDateDashStr);

  const { bulkSave, submitWeek } = useShiftRequestForm(employee?.uid || "");
  const { requestCheckIn } = useAttendance();

  const dirtyRequests = Object.values(requests).filter(req => req.changed);


/*

  const handleUpdateMemory = useCallback((date: string, newData: any) => {
    setRequests(prev => ({
      ...prev,
      [date]: { ...prev[date], ...newData, date: date, changed: true }
    }));
  }, []);

*/

/*. ################


// Home.tsx 47行目付近
const handleUpdateMemory = useCallback((date: string, newData: any) => {
  setRequests(prev => {
    const existing = prev[date];
    // 💡 既存データがなければ、その瞬間の employee 情報で初期値を作る
    const baseData = existing || (employee ? createDefaultUIShift(employee.uid, employee.name, date) : {});

    return {
      ...prev,
      [date]: { 
        ...baseData, 
        ...newData, 
        date: date, 
        changed: true 
      }
    };
  });
}, [employee]); // employee が Context から来ているので依存配列に追加


  const handleSaveToFirestore = async () => {
    const targetRequests = Object.values(requests).filter(req => req.changed);
    const dirtyDatesArray = targetRequests.map(req => req.date);

    if (dirtyDatesArray.length === 0) {
      alert("保存する変更がありません");
      return;
    }

    if (targetRequests.some(req => req.status !== 'draft')) {
      if (!window.confirm("提出済みのシフトが編集されています。保存すると『下書き（未提出）』に戻りますが、よろしいですか？")) return;
    }

    try {
      await bulkSave(requests, dirtyDatesArray); 
      setRequests(prev => {
        const next = { ...prev };
        dirtyDatesArray.forEach(date => {
          if (next[date]) next[date] = { ...next[date], changed: false };
        });
        return next;
      });
      alert("変更を保存しました");
    } catch (e) {
      alert("保存に失敗しました");
    }
  };

  const handleExecuteSubmit = async (selectedDates: string[]) => {
    try {
      const isClosing = selectedDates.some(date => date <= minDate);
      await submitWeek(requests, selectedDates, isClosing);
      
      setRequests(prev => {
        const next = { ...prev };
        selectedDates.forEach(d => {
          if (next[d]) next[d] = { ...next[d], changed: false };
        });
        return next;
      });
      alert("提出完了しました");
      return true;
    } catch (e) {
      alert("提出に失敗しました");
      return false;
    }
  };

  const handleCheckIn = async (time: string) => {
    if (!employee?.uid) return;
    try {
      await requestCheckIn(employee.uid, employee.name || "スタッフ", time);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    if (!employee?.uid) return;

    const qRequests = query(collectionGroup(db, "request"), where("uid", "==", employee.uid));
    const unsubRequests = onSnapshot(qRequests, (snap) => {
      const res: Record<string, ShiftRequestUI> = {}; 
      snap.forEach(d => {
        const dateId = d.ref.parent.parent?.id;
        if (dateId) {
          res[dateId] = mapDocToUI(d.data() as ShiftRequestDoc);
        }
      });
      setRequests(res); 
    });

    const fetchOthers = async () => {
      try {
        const fetchByGroup = async (groupName: string) => {
          const q = query(collectionGroup(db, groupName), where("uid", "==", employee.uid));
          const snap = await getDocs(q);
          const res: Record<string, any> = {};
          snap.forEach(d => {
            const dateId = d.ref.parent.parent?.id;
            if (dateId) res[dateId] = d.data();
          });
          return res;
        };
        const [salData, schData] = await Promise.all([fetchByGroup("salary"), fetchByGroup("schedule")]);
        setSalaries(salData);
        setSchedules(schData);
      } catch (e) { console.error(e); }
    };
    fetchOthers();

    const attRef = doc(db, "attendance", businessDateStr, "members", employee.uid);
    const unsubAtt = onSnapshot(attRef, (snap) => {
      setAttendanceState(snap.exists() ? snap.data().state : null);
    });
    
    return () => {
      unsubRequests();
      unsubAtt();
    };
  }, [employee?.uid, businessDateStr]);

  return (
    <div style={containerStyle}>
      { (isShopStaff(employee?.role) || hasShiftToday || attendanceState) && (
        <div style={statusListWrapper}>
          <DailyShiftStatusList userRole={employee?.role} currentUid={employee?.uid} />
        </div>
      )}

      <ScheduleManager
        isMobile={isMobile}
        salaries={salaries}
        schedules={schedules}
        requests={requests}
        dirtyRequests={dirtyRequests}
        minDate={minDate}
        todayDashStr={businessDateDashStr}
        onUpdateMemory={handleUpdateMemory}
        onSave={handleSaveToFirestore}
        onExecuteSubmit={handleExecuteSubmit} employees={undefined}      />


      {!isAdmin(employee?.role) && (
        <div style={{ marginBottom: '16px' }}>
          <AttendanceRequestButton
            attendanceState={attendanceState}
            hasShiftToday={hasShiftToday}
            onCheckIn={handleCheckIn}
          />
        </div>
      )}
    </div>
  );
}

const containerStyle: React.CSSProperties = { padding: '8px', maxWidth: '1500px', margin: '0 auto', backgroundColor: '#f5f5f5', minHeight: '100vh' };
const statusListWrapper: React.CSSProperties = { backgroundColor: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', marginBottom: '24px' };

*/
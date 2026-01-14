import { useEffect, useState } from "react";
import { collection, doc, getDocs, setDoc, serverTimestamp } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useSafeFirestoreOperation } from "../hooks/useSafeFirestoreOperation";

type Candidate = {
  uid: string;
};

export default function EmployeesRegist() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedUid, setSelectedUid] = useState<string | null>(null);
  const [role, setRole] = useState<"admin" | "staff" | "cast">("staff");
  const [loading, setLoading] = useState(true);

  const safeRun = useSafeFirestoreOperation();

  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setCandidates([]);
        setLoading(false);
        return;
      }

      let exists = new Set<string>();

      await safeRun(async () => {
        const snap = await getDocs(collection(db, "employees"));
        snap.forEach(d => exists.add(d.id));
      });

      // 処理が安全に完了していたら候補リスト作成
      const list = exists.has(user.uid) ? [] : [{ uid: user.uid }];
      setCandidates(list);
      setLoading(false);
    });

    return () => unsub();
  }, [safeRun]);

  const handleRegister = async () => {
    if (!selectedUid) return;

    if (role === "admin") {
        // TODO: 本番では window.confirm は使わず、
        //       独自モーダルに置き換えて URL 表示をなくす
      const ok = window.confirm(
        "管理者として登録しようとしています。\n全ての操作が可能となりますがよろしいですか？"
      );
      if (!ok) return;
    }

    await setDoc(doc(db, "employees", selectedUid), {
      enable: true,
      role,
      createdAt: serverTimestamp(),
    });

    const next = window.confirm("登録しました。\n続けて社員の情報を登録しますか？");
    if (next) {
      navigate(`/EmployeesEdit?uid=${selectedUid}`);
    } else {
      navigate("/Home");
    }
  };

  if (loading) return <div style={{ padding: 24 }}>loading...</div>;

  return (
    <div style={{ padding: 24, maxWidth: 600 }}>
      <h1>社員登録</h1>

      {candidates.length === 0 ? (
        <p>登録可能なIDがありません</p>
      ) : (
        <>
          <h3>未登録ID</h3>
          {candidates.map(c => (
            <label key={c.uid} style={{ display: "block", marginBottom: 8 }}>
              <input
                type="radio"
                name="uid"
                value={c.uid}
                checked={selectedUid === c.uid}
                onChange={() => setSelectedUid(c.uid)}
              />
              <span style={{ marginLeft: 8, fontFamily: "monospace" }}>{c.uid}</span>
            </label>
          ))}

          <hr style={{ margin: "16px 0" }} />

          <h3>権限</h3>
          {(["admin", "staff", "cast"] as const).map(r => (
            <label key={r} style={{ marginRight: 16 }}>
              <input
                type="radio"
                name="role"
                value={r}
                checked={role === r}
                onChange={() => setRole(r)}
              />
              <span style={{ marginLeft: 4 }}>{r}</span>
            </label>
          ))}

          <div style={{ marginTop: 24 }}>
            <button
              disabled={!selectedUid}
              onClick={handleRegister}
              style={{
                padding: "8px 16px",
                borderRadius: 6,
                border: "1px solid #ccc",
                cursor: selectedUid ? "pointer" : "not-allowed",
              }}
            >
              登録
            </button>
          </div>
        </>
      )}
    </div>
  );
}

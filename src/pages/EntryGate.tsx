import { useEffect } from "react";
import { replace, useNavigate } from "react-router-dom";

export default function EntryGate() {
    const navigage = useNavigate();

    useEffect(() => {
        //  今は仮でissuueに飛ばす
        navigage("Issue", { replace: true });
    }, []);

    return null;
}
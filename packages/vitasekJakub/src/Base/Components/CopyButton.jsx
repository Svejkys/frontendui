import { useState } from "react";

export const CopyButton = ({ text, className = "btn btn-sm btn-outline-secondary" }) => {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1200);
        } catch (e) {
            // fallback pro starší prohlížeče / blokované clipboard API
            const ta = document.createElement("textarea");
            ta.value = text;
            ta.style.position = "fixed";
            ta.style.left = "-9999px";
            document.body.appendChild(ta);
            ta.focus();
            ta.select();
            document.execCommand("copy");
            document.body.removeChild(ta);

            setCopied(true);
            window.setTimeout(() => setCopied(false), 1200);
        }
    };

    return (
        <button type="button" className={className} onClick={copy} title="Kopírovat">
            {copied ? "Zkopírováno" : "Kopírovat"}
        </button>
    );
}
import { useEffect, useRef, useState, useCallback } from "react";
import { Label } from './Label';

export const TextArea = ({
    id,
    value,
    label,
    placeHolder,
    ariaHidden = false,
    autoHeight = true,

    // IMPORTANT: očekává string, ne event
    onChange = (_value) => null,
    onBlur = (_value) => null,

    ...props
}) => {
    const textareaRef = useRef(null);

    const [value_, setValue_] = useState(value ?? "");
    const [dirty, setDirty] = useState(false);

    const adjustHeight = useCallback(() => {
        if (!autoHeight) return;
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight + 10}px`;
    }, [autoHeight]);

    // autoheight reaguje na obsah
    useEffect(() => {
        adjustHeight();
    }, [value_, adjustHeight]);

    useEffect(() => {
        const external = value ?? "";

        // 1) sync zvenku jen když uživatel nepíše
        if (!dirty) {
            setValue_(external);
            return;
        }

        // 2) když uživatel píše, ale backend dohnal stejnou hodnotu, shodit dirty
        if (external === value_) {
            setDirty(false);
        }
    }, [value, value_, dirty]);

    const handleChange = (e) => {
        const next = e?.target?.value ?? "";
        setDirty(true);
        setValue_(next);
        onChange({ target: { id, value: next }}); // bez debounce uvnitř, debounce je externí
    };

    const handleBlur = () => {
        // na blur obvykle chceš "flush" (externí debounce by měl mít flush),
        // tady aspoň pošli aktuální hodnotu:
        onBlur({ target: { id, value: value_ }});
    };

    const textarea = (
        <textarea
            {...props}
            ref={textareaRef}
            value={value_}
            aria-hidden={ariaHidden ? true : undefined}
            onChange={handleChange}
            onBlur={handleBlur}
        />
    );

    if (ariaHidden) return textarea;

    const content = (
        <>
            {placeHolder && <p>{placeHolder}</p>}
            {textarea}
        </>
    );

    if (label) return <Label title={label}>{content}</Label>;
    return content;
};

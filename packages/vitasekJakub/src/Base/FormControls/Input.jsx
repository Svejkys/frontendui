import { useMemo } from "react";
import { useEffect } from "react";
import { Label } from "./Label";
import { useRef } from "react";
import { useState } from "react";

/**
 * Univerzální `<input>` wrapper s podporou controlled i uncontrolled režimu,
 * s volitelným label obalem přes {@link Label}. Normalizuje `onChange`/`onBlur`
 * tak, že callbacky vždy dostanou objekt ve tvaru `{ target: { id, value } }`.
 *
 * Chování:
 * - **Controlled**: pokud je předán `value`, komponenta řídí hodnotu přes `value`.
 * - **Uncontrolled**: pokud `value` není předán, použije se `defaultValue`.
 * - `onBlur` se vyvolá pouze pokud uživatel opravdu změnil hodnotu (touched).
 * - Pro `type="number"` komponenta převádí hodnotu na `number` (nebo `""` při prázdnu/NaN).
 * - Pokud se interní `value_` liší od `value`, přidá se třída `bg-warning`.
 *
 * @component
 * @param {Object} props
 * @param {string} [props.label]
 *  Text titulku; pokud je uveden, input se zabalí do {@link Label} a použije se jako `title`.
 *  Pokud není, vrací se přímo element `<input>`.
 * @param {boolean} [props.ariaHidden=false]
 *  Pokud `true`, komponenta nerenderuje nic (`null`). Vhodné pro podmíněné skrývání.
 * @param {React.ReactNode} [props.children]
 *  Dodatečný obsah renderovaný pod inputem (pouze pokud je `label` uveden).
 *
 * @param {string} [props.id]
 *  ID inputu. Použije se i v emitovaných událostech (`target.id`).
 * @param {string|number} [props.value]
 *  Controlled hodnota. Pokud je definovaná, komponenta přepne do controlled režimu.
 * @param {string|number} [props.defaultValue]
 *  Výchozí hodnota pro uncontrolled režim.
 * @param {("text"|"number"|string)} [props.type="text"]
 *  Typ inputu. Pro `"number"` probíhá coercion na `number`/`""`.
 * @param {(e: {target: {id: string, value: any}}) => void} [props.onChange]
 *  Callback při změně; dostane normalizovaný event `{ target: { id, value } }`.
 * @param {(e: {target: {id: string, value: any}}) => void} [props.onBlur]
 *  Callback při blur; vyvolá se pouze pokud uživatel předtím změnil hodnotu (touched).
 *
 * @param {Object<string, any>} [props.rest]
 *  Ostatní props předané přímo do `<input />` (např. `className`, `placeholder`, `disabled`,
 *  `min`, `max`, `step`, `name`, `autoComplete`, `data-*`, atd.).
 *
 * @returns {JSX.Element|null}
 *
 * @example
 * // Controlled
 * <Input
 *   id="age"
 *   label="Age"
 *   type="number"
 *   value={age}
 *   onChange={({ target }) => setAge(target.value)}
 *   onBlur={({ target }) => saveAge(target.value)}
 * />
 *
 * @example
 * // Uncontrolled
 * <Input id="name" defaultValue="John" onBlur={({ target }) => console.log(target.value)} />
 */
export const Input = ({ label, ariaHidden = false, children, ...props }) => {
    const {
        id,
        value,
        defaultValue,
        onChange = () => null,
        onBlur = () => null,
        type="text",
        reset=0,
        ...rest
    } = props;

    const isControlled = value !== undefined; // klíčové
    const touchedRef = useRef(false);

    const coerceValue = (val) => {
        if (type === "number") {
            if (val === "" || val == null) return "";
            const num = Number(val);
            return Number.isNaN(num) ? "" : num;
        }
        return val ?? "";
    };

    const [value_, setValue_] = useState(() => coerceValue(value));
    
    useEffect(() => {
        // console.log("Input.useEffect.value")
        if (!isControlled) return;
        // console.log("Input.useEffect.value changed to", value)
        touchedRef.current = false;
        setValue_(value)
    }, [isControlled, value, reset])


    // reset "touched", když se změní hodnota zvenku (typicky reload / cancel / confirm)
    const externalValueKey = useMemo(
        () => (isControlled ? coerceValue(value) : undefined),
        [isControlled, value, type]
    );

    useEffect(() => {
        if (isControlled) touchedRef.current = false;
    }, [externalValueKey, isControlled]);

    const emit = (cb) => (e) => {
        const coercedValue = coerceValue(e.target.value);
        cb({ target: { id, value: coercedValue } });
    };

    const handleChange = (e) => {
        touchedRef.current = true;
        const value = e?.target?.value
        setValue_(value)
        // console.log("Input.handleChange.value changed to", value, reset)
        emit(onChange)(e);
    };

    const handleBlur = (e) => {
        if (!touchedRef.current) return;
        emit(onBlur)(e);
    };

    if (ariaHidden) return null;

    const inputProps = {
        id,
        type,
        onChange: handleChange,
        onBlur: handleBlur,
        ...rest,
    };

    // Controlled vs uncontrolled:
    if (isControlled) {
        // console.log("Input.isControlled using value", value_, value)
        inputProps.value = coerceValue(value_);
    } else {
        inputProps.defaultValue = coerceValue(defaultValue);
    }

    if (value !== value_) {
        inputProps.className = (inputProps.className ? inputProps.className + " " : "") + "bg-warning";
    }
    // console.log("Input default", isControlled, defaultValue, inputProps)
    const inputElement = <input {...inputProps} />;

    // console.log(inputProps)
    if (!label) return inputElement;

    return (
        <Label title={label}>
            {/* {JSON.stringify(inputProps)} */}
            {inputElement}
            {/* value_: {value_} <br />
            value: {value}  */}

            {children}
        </Label>
    );
};
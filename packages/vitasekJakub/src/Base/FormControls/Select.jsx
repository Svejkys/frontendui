import React, { useState } from 'react'
import { useEffect, useRef } from 'react'
import { Label } from './Label'

/**
 * A React component that renders a styled `<select>` dropdown with dynamic options and enhanced change detection.
 *
 * This component integrates with the `Options` component to fetch and display dynamic `<option>` elements.
 * It uses a `MutationObserver` to detect changes in the `<select>` element's children and triggers the `onChange`
 * event accordingly. The dropdown is wrapped in a `SimpleCardCapsule` for a consistent UI layout.
 *
 * @function Select
 * @param {Object} props - The properties for the Select component.
 * @param {string} [props.label] - The label displayed as the title of the `SimpleCardCapsule`.
 * @param {React.ReactNode} props.children - The `<option>` elements or an `Options` component to render dynamic options.
 * @param {string} [props.id] - The unique identifier for the `<select>` element.
 * @param {string|number} [props.value] - The current value of the `<select>` element, used for controlled components.
 * @param {string|number} [props.defaultValue] - The default value of the `<select>` element, used for uncontrolled components.
 * @param {Function} [props.onChange] - A callback function triggered when the `<select>` value changes. Receives an event object.
 * @param {Function} [props.onBlur] - A callback function triggered when the `<select>` loses focus. Receives an event object.
 * @param {Object} props.rest - Any additional props passed to the `<select>` element.
 *
 * @returns {JSX.Element} A styled dropdown wrapped in a `SimpleCardCapsule` with dynamic options and change detection.
 *
 * @example
 * // Example usage with Options:
 * const MyComponent = () => {
 *   const fetchOptions = (params) => async (dispatch) => {
 *     const response = await fetch('/api/data', {
 *       method: 'POST',
 *       body: JSON.stringify(params),
 *     });
 *     const json = await response.json();
 *     return json;
 *   };
 *
 *   const [selectedValue, setSelectedValue] = useState("");
 *   const [fetchTrigger, setFetchTrigger] = useState(0);
 *
 *   const handleChange = (e) => {
 *     setSelectedValue(e.target.value);
 *   };
 *
 *   const refreshOptions = () => setFetchTrigger((prev) => prev + 1);
 *
 *   return (
 *     <div>
 *       <button onClick={refreshOptions}>Refresh Options</button>
 *       <Select
 *         label="Dynamic Select"
 *         id="dynamic-select"
 *         value={selectedValue}
 *         onChange={handleChange}
 *       >
 *         <Options asyncAction={fetchOptions} params={{ someParam: "value" }} shouldFetch={fetchTrigger} />
 *       </Select>
 *     </div>
 *   );
 * };
 */
export const Select_ = ({ label, children, defaultValue, onChange, onBlur, ariaHidden, ...props }) => {
    const selectRef = useRef(null);
    const prevValueRef = useRef(defaultValue); // poslední známá hodnota

    useEffect(() => {
        if (!selectRef.current || typeof onChange !== "function") return;

        const observer = new MutationObserver(() => {
            // Oddálíme vyhodnocení, až se React přepne na novou hodnotu
            setTimeout(() => {
                const current = selectRef.current?.value;

                if (prevValueRef.current !== current) {
                    prevValueRef.current = current;
                    const event = { target: { id: selectRef.current.id, value: current } };
                    console.log("Select firing event due to real change", event);
                    onChange(event);
                } else {
                    console.log("MutationObserver detected change but value unchanged");
                }
            }, 0);
        });

        observer.observe(selectRef.current, { childList: true, subtree: true });

        // Uložíme počáteční hodnotu
        if (selectRef.current?.value) {
            prevValueRef.current = selectRef.current.value;
        }

        return () => observer.disconnect();
    }, [onChange, children]);

    if (ariaHidden) return null;

    const selectElement = (
        <select
            ref={selectRef}
            defaultValue={defaultValue}
            onChange={onChange}
            onBlur={onBlur}
            {...props}
        >
            {children}
        </select>
    );

    return label ? <Label title={label}>{selectElement}</Label> : selectElement;
};


export const Select = ({ id, label, value, onChange, onBlur, children, ...props }) => {
    const [internalValue, setInternalValue] = useState(value ?? "");

    // Když se externí `value` změní, aktualizuj i vnitřní stav
    useEffect(() => {
        setInternalValue(value ?? "");
    }, [value]);

    const handleChange = (e) => {
        const newValue = e.target.value;
        setInternalValue(newValue); // aktualizuj interní stav
        onChange?.({ target: { id, value: newValue } }); // zavolej callback s konzistentním tvarem
    };

    const handleBlur = (e) => {
        const newValue = e.target.value;
        onBlur?.({ target: { id, value: newValue } });
    };

    const selectElement = (
        <select
            id={id}
            value={internalValue}
            onChange={handleChange}
            onBlur={handleBlur}
            {...props}
        >
            {children}
        </select>
    );

    if (props.ariaHidden) return null;

    return label ? (
        <Label title={label}>{selectElement}</Label>
    ) : (
        selectElement
    );
};
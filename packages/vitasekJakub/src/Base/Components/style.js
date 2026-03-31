/**
 * Combines multiple class name inputs into a single space-separated string.
 *
 * This helper is a lightweight alternative to libraries like `classnames`.
 * It accepts any number of arguments, flattens nested arrays, removes falsy
 * values, and joins the remaining entries with spaces.
 *
 * Supported inputs:
 * - string:        "btn"
 * - falsy values:  false, null, undefined, "" (ignored)
 * - arrays:        ["btn", "btn-primary"]
 * - nested arrays: ["btn", ["btn-sm", ["is-active"]]]
 *
 * Typical usage:
 * ```js
 * cx(
 *   "UiButton",
 *   isPrimary && "UiButton--primary",
 *   isDisabled && "is-disabled",
 *   ["btn", "btn-sm"]
 * );
 * // → "UiButton UiButton--primary btn btn-sm"
 * ```
 *
 * Partial / reusable usage:
 * You can predefine commonly used class combinations and reuse them
 * across components (layout slots, bootstrap adapters, etc.).
 *
 * ```js
 * // prepare partials
 * const bsCard = (...extra) => cx("card", "shadow-sm", extra);
 * const leftColumn = (...extra) => cx("LargeCard__left", "col-12", "col-lg-4", extra);
 *
 * // use partials
 * <div className={bsCard("LargeCard")}>
 *   <div className={leftColumn("is-collapsed")}>
 *     ...
 *   </div>
 * </div>
 * ```
 *
 * This pattern helps:
 * - centralize layout / framework mappings (e.g. Bootstrap → custom CSS),
 * - keep JSX readable,
 * - make future theme or framework replacement easier.
 *
 * Notes:
 * - The order of arguments does NOT affect CSS priority; it only affects
 *   the order of class names in the resulting string.
 * - All falsy values are removed via `Boolean` filtering.
 * - `flat(Infinity)` ensures arbitrarily nested arrays are supported.
 *
 * @param {...(string | false | null | undefined | Array<any>)} parts
 *   Class name fragments to be combined.
 *
 * @returns {string}
 *   A single space-separated `className` string.
 */
export function cx(...parts) {
    return parts.flat(Infinity).filter(Boolean).join(" ");
}

/**
 * Bootstrap class registry (theme adapter).
 * Use these helpers with `cx(...)` to keep JSX readable and make it easy
 * to swap Bootstrap for another styling system later.
 *
 * Usage:
 *   <div className={bs.card.root("LargeCard")} />
 *   <div className={bs.grid.row({ g: 3, align: "center" })} />
 *   <button className={bs.button({ variant: "primary", size: "sm" })}>OK</button>
 */

export const bs = {
    // ---- Layout / grid --------------------------------------------------------
    grid: {
        container: (...extra) => cx("container", extra),
        containerFluid: (...extra) => cx("container-fluid", extra),

        row: (opts = {}, ...extra) => {
            const {
                g, // number: 0..5
                gx,
                gy,
                align, // "start" | "center" | "end"
                justify, // "start" | "center" | "end" | "between" | "around" | "evenly"
            } = opts || {};
            return cx(
                "row",
                g != null && `g-${g}`,
                gx != null && `gx-${gx}`,
                gy != null && `gy-${gy}`,
                align && `align-items-${align}`,
                justify && `justify-content-${justify}`,
                extra
            );
        },

        col: (spans = {}, ...extra) => {
            // spans: { xs, sm, md, lg, xl, xxl } each can be:
            // - number 1..12
            // - "auto"
            // - true (meaning just "col-{bp}")
            const bp = ["", "sm", "md", "lg", "xl", "xxl"];
            const parts = [];

            for (const k of bp) {
                const key = k === "" ? "xs" : k;
                const v = spans?.[key];
                if (v == null) continue;

                const prefix = k === "" ? "col" : `col-${k}`;
                if (v === true) parts.push(prefix);
                else parts.push(`${prefix}-${v}`);
            }

            // default fallback if nothing provided
            if (parts.length === 0) parts.push("col");

            return cx(parts, extra);
        },
    },

    // ---- Card -----------------------------------------------------------------
    card: {
        root: (...extra) => cx("card", extra),
        header: (...extra) => cx("card-header", extra),
        body: (...extra) => cx("card-body", extra),
        footer: (...extra) => cx("card-footer", extra),
        title: (...extra) => cx("card-title", extra),
        subtitle: (...extra) => cx("card-subtitle", "mb-2", "text-muted", extra),
        text: (...extra) => cx("card-text", extra),
    },

    // ---- Buttons --------------------------------------------------------------
    button: (opts = {}, ...extra) => {
        const {
            variant = "secondary", // "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark" | "link"
            outline = false,
            size, // "sm" | "lg"
            active,
            disabled,
        } = opts || {};

        const v = outline ? `btn-outline-${variant}` : `btn-${variant}`;
        return cx(
            "btn",
            v,
            size && `btn-${size}`,
            active && "active",
            disabled && "disabled",
            extra
        );
    },

    // ---- Table ----------------------------------------------------------------
    table: (opts = {}, ...extra) => {
        const {
            striped,
            bordered,
            hover,
            small,
            responsive, // boolean or breakpoint: "sm"|"md"|"lg"|"xl"|"xxl"
            variant, // "light" | "dark"
            align, // "top" | "middle" | "bottom"
        } = opts || {};

        const tableClass = cx(
            "table",
            striped && "table-striped",
            bordered && "table-bordered",
            hover && "table-hover",
            small && "table-sm",
            variant && `table-${variant}`,
            align && `align-${align}`,
            extra
        );

        const wrapperClass =
            responsive === true
                ? "table-responsive"
                : typeof responsive === "string"
                    ? `table-responsive-${responsive}`
                    : null;

        return { tableClass, wrapperClass };
    },

    // ---- Forms ----------------------------------------------------------------
    form: {
        control: (opts = {}, ...extra) => {
            const { size, plaintext, isValid, isInvalid } = opts || {};
            return cx(
                plaintext ? "form-control-plaintext" : "form-control",
                size && `form-control-${size}`,
                isValid && "is-valid",
                isInvalid && "is-invalid",
                extra
            );
        },
        select: (opts = {}, ...extra) => {
            const { size, isValid, isInvalid } = opts || {};
            return cx(
                "form-select",
                size && `form-select-${size}`,
                isValid && "is-valid",
                isInvalid && "is-invalid",
                extra
            );
        },
        label: (...extra) => cx("form-label", extra),
        check: {
            wrapper: (...extra) => cx("form-check", extra),
            input: (...extra) => cx("form-check-input", extra),
            label: (...extra) => cx("form-check-label", extra),
        },
        inputGroup: {
            wrapper: (...extra) => cx("input-group", extra),
            text: (...extra) => cx("input-group-text", extra),
        },
        help: (...extra) => cx("form-text", extra),
    },

    // ---- Alerts / badges ------------------------------------------------------
    alert: (variant = "info", ...extra) => cx("alert", `alert-${variant}`, extra),
    badge: (opts = {}, ...extra) => {
        const { variant = "secondary", pill = false } = opts || {};
        return cx("badge", `text-bg-${variant}`, pill && "rounded-pill", extra);
    },

    // ---- Utilities (common) ---------------------------------------------------
    util: {
        d: (v, ...extra) => cx(v && `d-${v}`, extra), // e.g. "flex", "block"
        flex: (opts = {}, ...extra) => {
            const { dir, wrap, grow, shrink, align, justify } = opts || {};
            return cx(
                "d-flex",
                dir && `flex-${dir}`,
                wrap && `flex-${wrap}`,
                grow != null && `flex-grow-${grow}`,
                shrink != null && `flex-shrink-${shrink}`,
                align && `align-items-${align}`,
                justify && `justify-content-${justify}`,
                extra
            );
        },
        gap: (n, ...extra) => cx(n != null && `gap-${n}`, extra),
        text: (opts = {}, ...extra) => {
            const { align, muted, nowrap, truncate, wrap } = opts || {};
            return cx(
                align && `text-${align}`,
                muted && "text-muted",
                nowrap && "text-nowrap",
                truncate && "text-truncate",
                wrap === false && "text-nowrap",
                extra
            );
        },
        w: (v, ...extra) => cx(v && `w-${v}`, extra), // e.g. 100 => "w-100"
        h: (v, ...extra) => cx(v && `h-${v}`, extra),
        m: (side, n, ...extra) => cx(`m${side ?? ""}-${n}`, extra), // side: "", "t","b","s","e","x","y"
        p: (side, n, ...extra) => cx(`p${side ?? ""}-${n}`, extra),
        border: (opts = {}, ...extra) => {
            const { top, end, bottom, start, color, rounded } = opts || {};
            return cx(
                top && "border-top",
                end && "border-end",
                bottom && "border-bottom",
                start && "border-start",
                color && `border-${color}`,
                rounded && (rounded === true ? "rounded" : `rounded-${rounded}`),
                extra
            );
        },
        bg: (variant, ...extra) => cx(variant && `bg-${variant}`, extra),
    },
};


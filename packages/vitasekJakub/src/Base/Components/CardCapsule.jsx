import { Link } from "./Link"
import { cx } from "./style";

export const CardCapsuleBase = ({ title = null, header = null, children, item }) => {
    return (
        <div className="card">
            {(header || title) && <div className="card-header">{title || header}</div>}
            <div className="card-body">{children}</div>
        </div>
    )
}

/**
 * Inline styly pro komponentu {@link SimpleCardCapsule}.
 *
 * @type {Object<string, React.CSSProperties>}
 * @property {React.CSSProperties} capsuleContainer
 *  Kontejner “kapsle” se zaobleným rámečkem a vnitřním odsazením.
 *  - `position: relative` umožňuje absolutně pozicovat titulky na hraně rámečku.
 *  - Používá Bootstrap CSS proměnné pro barvu/šířku borderu.
 *
 * @property {React.CSSProperties} capsuleTitle
 *  Levý horní “štítek” umístěný přes horní hranu rámečku (absolutně pozicovaný).
 *  Typicky zobrazuje `title || header`.
 *
 * @property {React.CSSProperties} childrenWrapper
 *  Obal pro obsah; zajišťuje plnou šířku a zarovnání obsahu doleva.
 *
 * @property {React.CSSProperties} capsuleRightCorner
 *  Pravý horní “štítek” na hraně rámečku (zatím nepoužitý v renderu),
 *  vhodný např. pro akce, stav, badge, počty apod.
 */
const styles = {
    capsuleContainer: {
        position: "relative", // Allows positioning of the title
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        border: "var(--bs-border-width) solid var(--bs-border-color)", // Border around the component

        borderRadius: "8px", // Rounded corners

        // borderBottom: "2px solid #6c757d", // pouze dolní linka
        // borderTop: "2px solid #6c757d",
        // borderLeft: "none",
        // borderRight: "none",
        // borderRadius: "0", // žádné zaoblení

        padding: "16px", // Padding inside the container
        margin: "16px 0", // Margin around the container
        color: "#6c757d",
        backgroundColor: "white",
        textAlign: "center",
        width: "100%",
        // minWidth: "200px",
        // zIndex: 10
    },
    capsuleTitle: {
        position: "absolute", // Position the title on the border
        top: "-10px", // Move above the border
        // left: "50%", // Center horizontally
        // transform: "translateX(-50%)", // Adjust for horizontal centering
        left: "16px", // Center horizontally
        backgroundColor: "white", // Match background color to container
        padding: "0 8px", // Add some padding around the text
        textTransform: "uppercase",
        fontSize: "0.85rem",
        fontWeight: "bold",
        letterSpacing: "0.05em",
        color: "#6c757d",
    },
    childrenWrapper: {
        width: "100%", // Ensure children fill the width of the container
        textAlign: "left", // Align child content to the left
    },
    capsuleRightCorner: {
        position: "absolute",
        top: "-14px",
        right: "16px",
        backgroundColor: "white",
        padding: "0 8px",
        fontSize: "0.85rem",
        fontWeight: "bold",
        color: "#6c757d",
    },

    // NEW: footer label na spodní hraně (vlevo)
    capsuleFooter: {
        position: "absolute",
        bottom: "-10px",
        left: "16px",
        backgroundColor: "white",
        padding: "0 8px",
        fontSize: "0.85rem",
        fontWeight: "bold",
        letterSpacing: "0.02em",
        color: "#6c757d",
    },

    // NEW: footer corner (vpravo dole)
    capsuleFooterCorner: {
        position: "absolute",
        bottom: "-10px",
        right: "16px",
        backgroundColor: "white",
        padding: "0 8px",
        fontSize: "0.85rem",
        fontWeight: "bold",
        color: "#6c757d",
    },
};

/**
 * Jednoduchý “card/capsule” wrapper s titulkem umístěným přes horní okraj rámečku.
 * Hodí se jako vizuální sekce pro bloky obsahu (formuláře, detail, skupiny polí).
 *
 * Pozn.: Komponenta slučuje základní styl ({@link styles.capsuleContainer})
 * s `style` předaným zvenku.
 *
 * @component
 * @param {Object} props
 * @param {string} [props.id]
 *  ID atribut pro root element (např. pro anchor/scroll nebo testování).
 * @param {string} [props.header]
 *  Alternativní text titulku (použije se, pokud není `title`).
 * @param {string} [props.title]
 *  Primární text titulku. Pokud není uveden, použije se `header`.
 * @param {React.ReactNode} [props.children]
 *  Vnitřní obsah kapsle.
 * @param {React.CSSProperties} [props.style]
 *  Dodatečné inline styly sloučené do kontejneru kapsle.
 * @param {Object<string, any>} [props.props]
 *  Další props (např. `className`, `data-*`, `onClick`), aktuálně se ale
 *  nepředávají na root element (viz poznámka níže).
 *
 * @returns {JSX.Element}
 *
 * @example
 * <SimpleCardCapsule
 *   id="basic-info"
 *   title="Základní údaje"
 *   style={{ marginTop: 24 }}
 * >
 *   <FormFields />
 * </SimpleCardCapsule>
 *
 * @remarks
 * - V ukázce kódu máš `id={{id}}`, správně má být `id={id}`.
 * - Pokud chceš podporovat “zbytek props”, předej je na root: `<div {...props} ...>`.
 */
export const SimpleCardCapsule0 = ({ id, header, title, children, style, className, ...props }) => {
    return (
        <div id={id} style={{ ...styles.capsuleContainer, ...style }} className={className} >
            <span style={styles.capsuleTitle}>{title || header}</span>
            <div style={styles.childrenWrapper}>
                {children}
            </div>
        </div>
    );
};


/**
 * Bootstrap-first capsule/card wrapper.
 * - Root je `card position-relative`
 * - "Title badge" je absolutně přes horní hranu (`translate-middle-y`)
 * - Obsah je `card-body`
 * - Hook třídy jsou stabilní pro budoucí theme
 */
export const SimpleCardCapsule = ({
    id,
    header,
    title,
    children,
    className,
    style,        // nechávám pro kompatibilitu, ale ideálně nepoužívat
    ...props
}) => {
    const text = title || header;

    return (
        <div
            id={id}
            className={cx(
                "CardCapsule",                // hook
                "card",
                "position-relative",
                "my-3",
                className
            )}
            style={style}
            {...props}
        >
            {text && (
                <span
                    className={cx(
                        "CardCapsule__title",      // hook
                        "position-absolute",
                        "top-0",
                        "start-0",
                        "translate-middle-y",
                        "ms-3",
                        "px-2",
                        "bg-white",
                        "text-uppercase",
                        "fw-bold",
                        "text-muted"
                    )}
                >
                    {text}
                </span>
            )}

            <div className={cx("CardCapsule__body", "card-body")}>
                <div className={cx("CardCapsule__content", "text-start")}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export const CardCapsule = SimpleCardCapsule

export const SimpleCardCapsuleRightCorner0 = ({ children }) => {
    return <span style={styles.capsuleRightCorner}>{children}</span>;
};

export const SimpleCardCapsuleRightCorner = ({ children, className, ...props }) => {
    return (
        <span
            className={cx(
                "CardCapsule__corner", // hook
                "position-absolute",
                "top-0",
                "end-0",
                "translate-middle-y",
                "me-3",
                "px-2",
                "bg-white",
                "text-muted",
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
};

export const SimpleCardCapsuleTitle0 = ({ children, style, className, ...props }) => {
    return (
        <span
            style={{ ...styles.capsuleTitle, ...style }}
            className={className}
            {...props}
        >
            {children}
        </span>
    );
};

export const SimpleCardCapsuleTitle = ({ children, className, ...props }) => {
    return (
        <span
            className={cx(
                "CardCapsule__title",
                "position-absolute",
                "top-0",
                "start-0",
                "translate-middle-y",
                "ms-3",
                "px-2",
                "bg-white",
                "text-uppercase",
                "fw-bold",
                "text-muted",
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
};

export const SimpleCardCapsuleFooter0 = ({ children, style, className, ...props }) => {
    return (
        <span
            style={{ ...styles.capsuleFooter, ...style }}
            className={className}
            {...props}
        >
            {children}
        </span>
    );
};

export const SimpleCardCapsuleFooter = ({ children, className, ...props }) => {
    return (
        <span
            className={cx(
                "CardCapsule__footer",
                "position-absolute",
                "bottom-0",
                "start-0",
                "ms-3",
                "px-2",
                "bg-white",
                "text-muted",
                "fw-bold",
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
};

export const SimpleCardCapsuleFooterCorner0 = ({ children, style, className, ...props }) => {
    return (
        <span
            style={{ ...styles.capsuleFooterCorner, ...style }}
            className={className}
            {...props}
        >
            {children}
        </span>
    );
};

export const SimpleCardCapsuleFooterCorner = ({ children, className, ...props }) => {
    return (
        <span
            className={cx(
                "CardCapsule__footerCorner",
                "position-absolute",
                "bottom-0",
                "end-0",
                "me-3",
                "px-2",
                "bg-white",
                "text-muted",
                "fw-bold",
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
};
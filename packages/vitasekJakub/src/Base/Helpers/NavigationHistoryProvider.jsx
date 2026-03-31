import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"
import { selectItemById } from "../../../../dynamic/src/Store";
import { Navbar } from "react-bootstrap";
import { ProxyLink } from "../Components/ProxyLink";
// Trail z URL: vrátí pole crumbů [{key,label,to}]
function computeTrail(pathname) {
    const seg = pathname.split("/").filter(Boolean);
    if (seg.length < 3) return null;

    const [app, entityType, action, id] = seg;

    if (!id || id === "create" || id === "new") return null;

    const trail = [
        {
            key: `${entityType}:${id}:view`,
            label: entityType,
            to: `/${entityType}/view/${id}`,
        },
    ];

    if (action && action !== "view") {
        trail.push({
            key: `${entityType}:${id}:${action}`,
            label: action,
            to: `/${entityType}/${action}/${id}`,
        });
    }

    return { entityKey: `${entityType}:${id}`, trail, entityType, idFromUrl: id };
}


const Ctx = createContext(null);
const MAX = 10;

export const NavigationHistoryProvider = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const pathname = location.pathname
    const seg = pathname.split("/").filter(Boolean);
    const [app, entityType, action, id] = seg;
    
    
    const item = useSelector((rootState) => (id !=null)? selectItemById(rootState, id): null)
    useEffect(() => {
        
        if (!id || id === "create" || id === "new") 
            return
        
        const trail = []

        trail.push({
            key: `${entityType}:${id}:view`,
            label: entityType,
            to: `/${app}/${entityType}/view/${id}`,
        })

        if (action && action !== "view") {
            trail.push({
                key: `${entityType}:${id}:${action}`,
                label: action,
                to: `/${app}/${entityType}/${action}/${id}`,
            });
        }
        
        const computed = { entityKey: `${entityType}:${id}`, trail, entityType, idFromUrl: id };

        // čekej, až bude entita reálně známa
        
        const now = Date.now();

        setItems((prev) => {
            // console.log("NavigationHistoryProvider", prev)
            // najdi existující entry pro tuhle entitu (podle entityKey z URL)
            const existing = prev.find((x) => x.entityKey === computed.entityKey);
            const label = item?.fullname || item?.name || computed.entityType
            // vytvoř nový/aktualizovaný záznam
            const nextEntry = {
                ...(existing ?? {}),
                entityKey: computed.entityKey,
                trail: computed.trail,          // aktualizuj blade/trail (mění se při action)
                lastSeenAt: now,
                itemLabel: label,
                pathname
            };

            // pokud už je to první (nejnovější) a je to ta samá entita -> jen update
            if (prev[0]?.entityKey === computed.entityKey) {
                return [nextEntry, ...prev.slice(1)];
            }

            // jinak dedupe + posuň dopředu
            const without = prev.filter((x) => x.entityKey !== computed.entityKey);
            return [nextEntry, ...without].slice(0, MAX);
        });
    }, [ location.pathname, item]);

    const value = useMemo(
        () => ({
            items,
            goToCrumb: (crumb) => navigate(crumb.to),
            goToEntry: (entry) => navigate(entry.trail[entry.trail.length - 1].to),
            clear: () => setItems([]),
        }),
        [items, navigate]
    );

    return (<Ctx.Provider value={value}>
        {children}
        </Ctx.Provider>);
};

export const useAzureLikeHistory = () => {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error("useAzureLikeHistory must be used inside NavigationHistoryProvider");
    return ctx;
};


export const NavigationHistoryLinks = () => {
    const { items=[], goToEntry, clear } = useAzureLikeHistory();
    const navigate = useNavigate();
    const ordered = useMemo(() => [...items].reverse(), [items]);
    const handleClick = (e) => {
        const href = (e?.target || {})?.href
        e.preventDefault()
        // console.log("href", href)
        if (href)
            navigate(href)
    }
    const handleClickMain = (entry) => (e) => {
        e.preventDefault()
        goToEntry(entry)
    }

    if (!items.length) return null;

    return (
        <Navbar bg="light">
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ opacity: 0.7 }}></span>
            
            {ordered.map((e) => (<>
                <a
                    key={e.entityKey}
                    type="button"
                    href={e.pathname}
                    onClick={handleClickMain(e)}
                    // style={{ border: "1px solid #ccc", borderRadius: 999, padding: "2px 10px", cursor: "pointer" }}
                    className="btn btn-sm btn-link border-0" 
                    title={e.trail.map(t => t.label).join(" / ")}
                >
                    {/* Azure feeling: jméno entity + aktuální blade */}
                    {e.itemLabel}
                    
                </a>
                {e.trail.length > 1 && 
                    <span style={{ opacity: 0.7 }}>
                        {e.trail.map((t, i) => (
                            <a key={t.to + ":" + i} href={t.to} className="btn btn-sm btn-link border-0" onClick={handleClick}>
                                {t.label}
                            </a>
                        ))}
                    </span>
                }
                |
                </>
            ))}

            <button type="button" className="btn btn-sm btn-outline-danger border-0" onClick={clear}>Vymazat</button>
        </div>
        </Navbar>
    );
};
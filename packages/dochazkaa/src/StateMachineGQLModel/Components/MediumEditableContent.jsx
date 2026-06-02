import { useMemo } from "react";
import { Input } from "../../Base/FormControls/Input"
import { useState } from "react";
import { useEffect } from "react";
import { UpdateButton as UpdateTransitionButton } from "../../StateTransitionGQLModel/Mutations/Update";
import { DeleteButton as DeleteTransitionButton} from "../../StateTransitionGQLModel/Mutations/Delete";
import { useAsyncThunkAction } from "../../../../dynamic/src/Hooks";
import { InsertAsyncAction, ReadAsyncAction } from "../Queries";
import { CreateButton as CreateTransitionButton } from "../../StateTransitionGQLModel/Mutations/Create";
import { UpdateButton as UpdateStateButton } from "../../StateGQLModel/Mutations/Update";
import { CreateButton as CreateStateButton } from "../../StateGQLModel/Mutations/Create";
import { DeleteButton as DeleteStateButton } from "../../StateGQLModel/Mutations/Delete";
import { Arrow90degRight, ArrowRight, PencilFill, Trash } from "react-bootstrap-icons";
import { useGQLEntityContext } from "../../Base/Helpers/GQLEntityProvider";

/**
 * A component that displays medium-level content for an template entity.
 *
 * This component renders a label "TemplateMediumContent" followed by a serialized representation of the `template` object
 * and any additional child content. It is designed to handle and display information about an template entity object.
 *
 * @component
 * @param {Object} props - The properties for the TemplateMediumContent component.
 * @param {Object} props.template - The object representing the template entity.
 * @param {string|number} props.template.id - The unique identifier for the template entity.
 * @param {string} props.template.name - The name or label of the template entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render after the serialized `template` object.
 *
 * @returns {JSX.Element} A JSX element displaying the entity's details and optional content.
 *
 * @example
 * // Example usage:
 * const templateEntity = { id: 123, name: "Sample Entity" };
 * 
 * <TemplateMediumContent template={templateEntity}>
 *   <p>Additional information about the entity.</p>
 * </TemplateMediumContent>
 */
export const MediumEditableContent = ({ item, onChange = (e) => null, onBlur = (e) => null, children }) => {
    return (
        <>
            {/* defaultValue={item?.name|| "Název"}  */}
            <Input id={"name"} label={"Jméno"} className="form-control" value={item?.name || "Název"} onChange={onChange} onBlur={onBlur} />
            <Input id={"nameEn"} label={"Anglický název"} className="form-control" value={item?.nameEn || "Anglický název"} onChange={onChange} onBlur={onBlur} />
            {children}
            
            <StateMachineFlowVisualization item={item?.statemachine} />
        </>
    )
}



/**
 * Kompletní vizualizace (Flow SVG + volitelná incidence tabulka).
 *
 * Props:
 * - item: StateMachineGQLModel
 * - showMatrix: boolean (default true)
 * - currentId?: string (controlled) – pokud nedáš, bude se řídit interně
 * - onCurrentIdChange?: (id) => void – pro controlled mód
 *
 * Pozn.: Handlery jsou lokální (jak chceš). Všechny jsou připravené a volají "TODO".
 */
export function StateMachineFlowVisualization({
    item,
    showMatrix = true,
    currentId: currentIdProp,
    onCurrentIdChange,
}) {
    const sm = item;

    const { states, transitions } = useMemo(() => {
        const states = (sm?.states ?? [])
            .slice()
            .sort((a, b) => (a?.order ?? 0) - (b?.order ?? 0));

        const transitions = (sm?.transitions ?? [])
            .slice()
            .sort((a, b) =>
                String(a?.name ?? "").localeCompare(String(b?.name ?? ""), "cs")
            );

        return { states, transitions };
    }, [sm]);

    // currentId: controlled/uncontrolled
    const [currentIdLocal, setCurrentIdLocal] = useState(null);
    const currentId = currentIdProp ?? currentIdLocal;
    const setCurrentId = onCurrentIdChange ?? setCurrentIdLocal;

    useEffect(() => {
        if (!states.length) return;
        const exists = currentId && states.some((s) => s?.id === currentId);
        if (!exists) setCurrentId(states[0].id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [states]);

    const current = useMemo(
        () => states.find((s) => s?.id === currentId) ?? null,
        [states, currentId]
    );

    // ---- Handlery (stejné jako u incidence tabulky) ----
    const handleStateClick = (state) => () => {
        setCurrentId(state?.id ?? null);
    };

    const handleStateEdit = (state) => () => {
        // open dialog for edit
        console.log("edit state", state);
    };

    const handleStateRemove = (state) => () => {
        // confirm delete
        console.log("remove state", state);
    };

    const handleStateAdd = () => {
        // open dialog for state add
        console.log("add state");
    };

    const handleTransitionAdd = (stateFrom, stateTo) => () => {
        // open dialog for transition add
        console.log("add transition", { from: stateFrom, to: stateTo });
    };

    const handleTransitionEdit = (transition) => () => {
        // open dialog for transition edit
        console.log("edit transition", transition);
    };

    const handleTransitionRemove = (transition) => () => {
        // confirm delete
        console.log("remove transition", transition);
    };


    if (!sm) {
        return (
            <div className="alert alert-warning" role="alert">
                Nebyla dodána data state machine.
            </div>
        );
    }

    if (!states.length) {
        return (
            <div className="alert alert-info" role="alert">
                State machine neobsahuje žádné stavy.
                <CreateStateButton
                    className="btn btn-outline-primary form-control"
                    item={{
                        statemachineId: item?.id,
                        name: "Nový stavAAAAAAAAAAAA",
                        order: 0
                    }}
                >+ Přidat stav {item?.statemachine?.id}</CreateStateButton>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            {/* <div className="mb-2">
                <div className="h5 mb-1">{sm.name ?? "StateMachine"}</div>
                <div className="text-muted">
                    Stavy: {states.length} • Přechody: {transitions.length}
                    {current ? <> • Aktuální: {current.name}</> : null}
                </div>
            </div> */}

            {/* Toolbar */}
            {/* <div className="d-flex flex-wrap gap-2 mb-2">
                <button className="btn btn-sm btn-outline-primary" onClick={handleStateAdd}>
                    + Přidat stav
                </button>
                {current ? (
                    <>
                        <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={handleStateEdit(current)}
                        >
                            Edit aktuálního stavu
                        </button>
                        
                        <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={handleStateRemove(current)}
                        >
                            Smazat aktuální stav
                        </button>
                    </>
                ) : null}
            </div> */}

            {/* SVG Flow Graph */}
            <div className="mb-3">
                <StateMachineFlowSvg
                    item={item}
                    states={states}
                    transitions={transitions}
                    currentId={currentId}
                    onStateClick={(s) => handleStateClick(s)()}
                    onStateEdit={(s) => handleStateEdit(s)()}
                    onStateRemove={(s) => handleStateRemove(s)()}
                    onTransitionAdd={(from, to) => handleTransitionAdd(from, to)()}
                    onTransitionEdit={(t) => handleTransitionEdit(t)()}
                    onTransitionRemove={(t) => handleTransitionRemove(t)()}
                    TransitionEdgeComponent={TransitionEdge} // <- vyměnitelné!
                />
            </div>

            {/* Incidence matrix (volitelné) */}
            {showMatrix ? (
                <MatrixTable
                    item={item}
                    states={states}
                    transitions={transitions}
                    currentId={currentId}
                    onStateClick={(s) => handleStateClick(s)()}
                    onStateEdit={(s) => handleStateEdit(s)()}
                    onStateRemove={(s) => handleStateRemove(s)()}
                    onStateAdd={() => handleStateAdd()}
                    onTransitionAdd={(from, to) => handleTransitionAdd(from, to)()}
                    onTransitionEdit={(t) => handleTransitionEdit(t)()}
                    onTransitionRemove={(t) => handleTransitionRemove(t)()}
                />
            ) : null}
        </div>
    );
}

/* ------------------------- FLOW SVG ------------------------- */

export function StateMachineFlowSvg({
    states,
    transitions,
    currentId,
    onStateClick,
    onStateEdit,
    onStateRemove,
    onTransitionAdd,
    onTransitionEdit,
    onTransitionRemove,
    TransitionEdgeComponent,
    width = 1100,
    height = 200, // může být menší, protože uzly jsou menší
}) {
    const layout = useMemo(() => {
        // ↓↓↓ poloviční uzly
        const nodeW = 95;
        const nodeH = 26;

        // přiměřeně menší mezera a padding
        const gapX = 26;
        const paddingX = 18;

        const yBase = Math.round(height / 2);

        const pos = new Map();
        for (let i = 0; i < states.length; i++) {
            const x = paddingX + i * (nodeW + gapX);
            const y = yBase - nodeH / 2;
            pos.set(states[i].id, { x, y, w: nodeW, h: nodeH, cx: x + nodeW / 2, cy: yBase });
        }

        const indexById = new Map(states.map((s, i) => [s.id, i]));

        const forward = [];
        const backward = [];
        for (const t of transitions) {
            const a = indexById.get(t.sourceId);
            const b = indexById.get(t.targetId);
            if (a == null || b == null) continue;
            const span = Math.abs(b - a);
            const dir = b >= a ? "forward" : "backward";
            const edge = { t, a, b, span, dir };
            (dir === "forward" ? forward : backward).push(edge);
        }

        function assignLanes(edges) {
            edges.sort((e1, e2) => e2.span - e1.span || (e1.a - e2.a));
            const lanes = [];
            for (const e of edges) {
                const start = Math.min(e.a, e.b);
                const end = Math.max(e.a, e.b);
                const interval = { start, end };

                let placed = false;
                for (let li = 0; li < lanes.length; li++) {
                    const lane = lanes[li];
                    const fits = lane.every((it) => interval.end < it.start || interval.start > it.end);
                    if (fits) {
                        lane.push(interval);
                        e.lane = li;
                        placed = true;
                        break;
                    }
                }
                if (!placed) {
                    lanes.push([interval]);
                    e.lane = lanes.length - 1;
                }
            }
            return { edges, laneCount: lanes.length };
        }

        const f = assignLanes(forward);
        const b = assignLanes(backward);

        // menší amplitudy, aby křivky nebyly zbytečně vysoké
        const base = 60;
        const laneStep = 20;
        const spanStep = 8;

        function edgeGeom(e) {
            const from = pos.get(e.t.sourceId);
            const to = pos.get(e.t.targetId);
            if (!from || !to) return null;

            // středy uzlů
            const sx = from.cx;
            const sy = from.cy;
            const tx = to.cx;
            const ty = to.cy;

            // posun na "hranu" uzlu, ale symetricky od středu (half-width + padding)
            // (u tebe je pad záporný, aby se hrany víc přiblížily středu)
            const pad = -16;
            const fromHalf = from.w / 2 + pad;
            const toHalf = to.w / 2 + pad;

            // směr podle X (dopředná/zpětná)
            const dirX = tx >= sx ? 1 : -1;

            const x1 = sx + dirX * fromHalf;
            const y1 = sy;
            const x2 = tx - dirX * toHalf;
            const y2 = ty;

            const span = e.span || 1;

            // parametry pro větší oblouky + clearance pro label
            const labelH = 22;
            const labelMargin = 8;

            const base = 12 + labelH + labelMargin; // 42
            const laneStep = 14;
            const spanStep = 10;

            const Araw = base + spanStep * (span - 1) + laneStep * (e.lane ?? 0);
            const minClearance = labelH + labelMargin;
            const A = Math.max(minClearance, Araw);

            // NEW: odsazení hran od osy (baseline) v ose Y
            // dopředné nahoru, zpětné dolů
            const axisGap = 16; // dolaď (např. 16–26)
            const dirY = e.dir === "forward" ? -1 : 1;

            const y1o = y1 + dirY * axisGap;
            const y2o = y2 + dirY * axisGap;

            const mx = (x1 + x2) / 2;
            const ctrlY = y1o + dirY * A;

            const d = `M ${x1} ${y1o} Q ${mx} ${ctrlY} ${x2} ${y2o}`;

            const labelX = mx;
            const labelY = (y1o + y2o) / 2 + (ctrlY - y1o) * 0.55;

            return { d, labelX, labelY };
        }

        const edges = [...f.edges, ...b.edges].map((e) => ({
            ...e,
            geom: edgeGeom(e),
        }));

        return { pos, edges, nodeW, nodeH, yBase };
    }, [states, transitions, height]);

    const viewW = Math.max(width, 18 + states.length * (95 + 26));
    const viewH = height;

    const stroke = "#212529";
    const primary = "#0d6efd";
    const light = "#f8f9fa7f";
    const border = "#dee2e6";

    return (
        <svg width="100%" viewBox={`0 0 ${viewW} ${viewH}`} role="img" aria-label="State machine flow graph">
            <defs>
                <marker id="arrow" markerWidth="4" markerHeight="4" refX="3.3" refY="2" orient="auto">
                    <path d="M0,0 L4,2 L0,4 Z" fill={stroke} />
                </marker>

                <marker id="arrowPrimary" markerWidth="4" markerHeight="4" refX="3.3" refY="2" orient="auto">
                    <path d="M0,0 L4,2 L0,4 Z" fill={primary} />
                </marker>
            </defs>

            {/* edges */}
            {layout.edges.map(({ t, geom }) => {
                if (!geom) return null;
                const isRelatedToCurrent = t.sourceId === currentId //|| t.targetId === currentId;

                return (
                    <TransitionEdgeComponent
                        key={t.id}
                        transition={t}
                        d={geom.d}
                        labelX={geom.labelX}
                        labelY={geom.labelY}
                        markerEnd={isRelatedToCurrent ? "url(#arrowPrimary)" : "url(#arrow)"}
                        stroke={isRelatedToCurrent ? primary : stroke}
                        labelFill={isRelatedToCurrent ? primary : stroke}
                        labelBg={light}
                        labelBorder={border}
                        onEdit={() => onTransitionEdit?.(t)}
                        onRemove={() => onTransitionRemove?.(t)}
                    />
                );
            })}

            {/* nodes */}
            {states.map((s) => {
                const p = layout.pos.get(s.id);
                if (!p) return null;

                const isCurrent = s.id === currentId;
                const fill = isCurrent ? "#e7f1ff" : light;
                const outline = isCurrent ? primary : stroke;

                return (
                    <g key={s.id}>
                        <rect
                            x={p.x}
                            y={p.y}
                            width={p.w}
                            height={p.h}
                            rx="10"
                            fill={fill}
                            stroke={outline}
                            strokeWidth={isCurrent ? 3 : 2}
                            onClick={() => onStateClick?.(s)}
                            style={{ cursor: onStateClick ? "pointer" : "default" }}
                        />
                        <text
                            x={p.cx}
                            y={p.cy + 4}
                            textAnchor="middle"
                            fontSize="10.5"
                            fill={outline}
                            fontFamily="system-ui, -apple-system, Segoe UI, Roboto, Arial"
                            pointerEvents="none"
                        >
                            {shortLabel(s.name, 12)}
                        </text>

                        {/* mini actions (menší) */}
                        {/* <g transform={`translate(${p.x + p.w - 34 + 10}, ${p.y + 4 - 10})`}>
                            <rect
                                x="0"
                                y="0"
                                width="14"
                                height="14"
                                rx="4"
                                fill="#ffffff"
                                stroke={border}
                                onClick={() => onStateEdit?.(s)}
                                style={{ cursor: onStateEdit ? "pointer" : "default" }}
                            />
                            <text
                                x="7"
                                y="10.5"
                                textAnchor="middle"
                                fontSize="9"
                                fill={stroke}
                                fontFamily="system-ui, -apple-system, Segoe UI, Roboto, Arial"
                                pointerEvents="none"
                            >
                                E
                            </text>

                            <rect
                                x="16"
                                y="0"
                                width="14"
                                height="14"
                                rx="4"
                                fill="#ffffff"
                                stroke={border}
                                onClick={() => onStateRemove?.(s)}
                                style={{ cursor: onStateRemove ? "pointer" : "default" }}
                            />
                            <text
                                x="23"
                                y="10.5"
                                textAnchor="middle"
                                fontSize="10"
                                fill={stroke}
                                fontFamily="system-ui, -apple-system, Segoe UI, Roboto, Arial"
                                pointerEvents="none"
                            >
                                ×
                            </text>
                        </g> */}
                    </g>
                );
            })}

            {/* "+" hotspot mezi sousedy (menší) */}
            {/* {states.slice(0, -1).map((fromState, i) => {
                const toState = states[i + 1];
                const a = layout.pos.get(fromState.id);
                const b = layout.pos.get(toState.id);
                if (!a || !b) return null;

                const x = (a.x + a.w + b.x) / 2 - 8;
                const y = layout.yBase - 8;

                return (
                    <g key={`${fromState.id}->${toState.id}`}>
                        <rect
                            x={x}
                            y={y}
                            width="16"
                            height="16"
                            rx="5"
                            fill="#ffffff"
                            stroke="#dee2e6"
                            onClick={() => onTransitionAdd?.(fromState, toState)}
                            style={{ cursor: onTransitionAdd ? "pointer" : "default" }}
                        />
                        <text
                            x={x + 8}
                            y={y + 12}
                            textAnchor="middle"
                            fontSize="12"
                            fill="#0d6efd"
                            fontFamily="system-ui, -apple-system, Segoe UI, Roboto, Arial"
                            pointerEvents="none"
                        >
                            +
                        </text>
                    </g>
                );
            })} */}
        </svg>
    );
}

function shortLabel(name, max = 12) {
    const s = String(name ?? "").trim();
    if (!s) return "—";
    return s.length > max ? s.slice(0, max - 1) + "…" : s;
}
/* ---------------- TransitionEdge: samostatná komponenta ----------------
   Tuhle můžeš vyměnit za jinou implementaci (ortho routing, jiné labely, ikony, ...)
*/
export function TransitionEdge({
    transition,
    d,
    labelX,
    labelY,
    markerEnd,
    stroke,
    labelFill,
    labelBg,
    labelBorder,
    onEdit,
    onRemove,

    // NEW:
    labelWidth = 95,      // default = tvoje poloviční šířka stavu
    labelHeight = 22,     // nechávám
    labelPadX = 8,        // pro výpočet zkrácení textu
}) {
    const name = transition?.name ?? "—";

    const w = labelWidth;
    const h = labelHeight;
    const rx = h / 2;

    // kolik místa sežerou 2 mini tlačítka vpravo + mezery
    const btnW = 14;
    const btnGap = 2;
    const btnBlockW = btnW * 2 + btnGap; // 38
    const rightPad = -6;
    const leftPad = 6;

    // oblast pro text uvnitř labelu
    const textBoxW = Math.max(10, w - btnBlockW - leftPad - rightPad - labelPadX);

    // velmi jednoduchý odhad: ~6px na znak při font-size 11
    const approxCharW = 6;
    const maxChars = Math.max(3, Math.floor(textBoxW / approxCharW));
    const text =
        name.length > maxChars ? name.slice(0, Math.max(1, maxChars - 1)) + "…" : name;

    const x0 = labelX - w / 2;
    const y0 = labelY - h / 2;

    return (
        <g>
            <path
                d={d}
                fill="none"
                stroke={stroke}
                strokeWidth="2.3"
                markerEnd={markerEnd}
            />

            {/* label group */}
            <g>
                {/* <rect
                    x={x0}
                    y={y0}
                    width={w}
                    height={h}
                    rx={rx}
                    fill={labelBg}
                    stroke={labelBorder}
                /> */}

                {/* text je vlevo od tlačítek, ne přesně na střed pill */}
                <text
                    x={x0 + leftPad + (w - btnBlockW - leftPad - rightPad) / 2}
                    y={labelY + 4}
                    textAnchor="middle"
                    fontSize="11"
                    fill={labelFill}
                    fontFamily="system-ui, -apple-system, Segoe UI, Roboto, Arial"
                    pointerEvents="none"
                >
                    {text}
                </text>

                {/* buttons in right side */}
                {/* <rect
                    x={x0 + w - btnBlockW - rightPad}
                    y={labelY - 16}
                    width={btnW}
                    height={btnW}
                    rx="5"
                    fill="#ffffff"
                    stroke={labelBorder}
                    onClick={onEdit}
                    style={{ cursor: onEdit ? "pointer" : "default" }}
                />
                <text
                    x={x0 + w - btnBlockW - rightPad + btnW / 2}
                    y={labelY - 5}
                    textAnchor="middle"
                    fontSize="9"
                    fill="#212529"
                    fontFamily="system-ui, -apple-system, Segoe UI, Roboto, Arial"
                    pointerEvents="none"
                >
                    E
                </text>

                <rect
                    x={x0 + w - btnW - rightPad}
                    y={labelY - 16}
                    width={btnW}
                    height={btnW}
                    rx="5"
                    fill="#ffffff"
                    stroke={labelBorder}
                    onClick={onRemove}
                    style={{ cursor: onRemove ? "pointer" : "default" }}
                />
                <text
                    x={x0 + w - rightPad - btnW / 2}
                    y={labelY - 5}
                    textAnchor="middle"
                    fontSize="9"
                    fill="#212529"
                    fontFamily="system-ui, -apple-system, Segoe UI, Roboto, Arial"
                    pointerEvents="none"
                >
                    ×
                </text> */}
            </g>
        </g>
    );
}

/* ------------------------- Incidence table ------------------------- */

function MatrixTable({
    item,
    states: states_,
    transitions,
    currentId,
    onStateClick,
    onStateEdit,
    onStateRemove,
    onStateAdd,
    onTransitionAdd,
    onTransitionEdit,
    onTransitionRemove,
}) {
    const states = useMemo(()=> states_.toSorted((a,b) => ((a?.order ?? 0)-(b?.order ?? 0))), [
        states_
    ])

    const { matrix } = useMemo(() => {
        const indexById = new Map(states.map((s, i) => [s.id, i]));
        const n = states.length;

        const matrix = Array.from({ length: n }, () =>
            Array.from({ length: n }, () => [])
        );

        for (const t of transitions) {
            const r = indexById.get(t.sourceId);
            const c = indexById.get(t.targetId);
            if (r == null || c == null) continue;
            matrix[r][c].push(t);
        }

        // seřadit podle názvu v buňkách
        // for (let r = 0; r < n; r++) {
        //     for (let c = 0; c < n; c++) {
        //         matrix[r][c].sort((a, b) =>
        //             String(a?.name ?? "").localeCompare(String(b?.name ?? ""), "cs")
        //         );
        //     }
        // }

        return { matrix };
    }, [states, transitions]);

    const currentRowIndex = useMemo(() => {
        const idx = states.findIndex((s) => s?.id === currentId);
        return idx >= 0 ? idx : 0;
    }, [states, currentId]);

    const current = useMemo(
        () => states.find((s) => s?.id === currentId) ?? null,
        [states, currentId]
    );

    // const { run: reRead } = useAsyncThunkAction(ReadAsyncAction, item, {deferred: true})
    const { reRead } = useGQLEntityContext()
    const handleDeleteTransition = (t) => () => {
        console.log("handleDeleteTransition", t)
        reRead()
    }
    const handleReRead = () => {
        reRead()
    }
    // const handleAddTransition = (t) => () => {}

    return (
        <div className="table-responsive">
            <table className="table table-sm align-top table-bordered ">
                <thead className="table-light">
                    <tr>
                        <th rowSpan={2} scope="col" className="align-middle table-primary">
                            <div className="d-flex gap-2 justify-content-center">
                            Zdroj
                            </div>
                        </th>
                        <th
                            colSpan={states.length}
                            scope="col"
                            className="text-center table-warning me-3"
                        >
                            <div className="d-flex gap-2 justify-content-center">
                            Cíl
                            <CreateStateButton
                                className="btn btn-sm btn-outline-secondary"
                                item={{
                                    statemachineId: current?.statemachineId,
                                    name: "Nový stav",
                                    order: states.length
                                }}
                                onOk={handleReRead}
                            >
                                +
                            </CreateStateButton>
                            </div>
                        </th>
                    </tr>
                    <tr>
                        {states.map((s) => (
                            <th key={s.id} scope="col" className="table-warning  mx-3">
                                <div className="d-flex gap-2 justify-content-center">
                                    <button
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() => onStateClick?.(s)}
                                    >
                                        {s.name}
                                    </button>
                                    <UpdateStateButton
                                        className="btn btn-sm btn-outline-secondary"
                                        item={s}
                                    >
                                        <PencilFill />
                                    </UpdateStateButton>
                                    <DeleteStateButton
                                        className="btn btn-sm btn-outline-secondary"
                                        item={s}
                                        onOk={handleDeleteTransition(s)}
                                    >
                                        <Trash />
                                    </DeleteStateButton>
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {/* {states.map((rowState, r) => (
                        <tr key={rowState.id}>
                            <th scope="row">
                                <div className="d-flex flex-wrap gap-1">
                                    <button
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() => onStateClick?.(rowState)}
                                    >
                                        {rowState.name}
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() => onStateEdit?.(rowState)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline-secondary"
                                        onClick={() => onStateRemove?.(rowState)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </th>

                            {states.map((colState, c) => {
                                const list = matrix[r][c];
                                return (
                                    <td key={colState.id}>
                                        {(list.length === 0) && (r !== c) && (
                                            <CreateButton 
                                                className="btn btn-sm btn-outline-light w-100"
                                                item={{
                                                    name: (r>c)?"Vrátit":"Schválit",
                                                    sourceId: rowState?.id,
                                                    targetId: colState?.id,
                                                    statemachineId: rowState?.statemachineId
                                                }}
                                            >
                                                +
                                            </CreateButton>
                                        )}
                                        {(list.length !== 0) && (
                                            <div className="d-flex flex-wrap gap-1">
                                                {list.map((t) => (
                                                    <span key={t.id} title={t.id}>
                                                        <button className="btn btn-sm btn-secondary border-0">
                                                            {t.name} ({})
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => onTransitionEdit?.(t)}
                                                        >
                                                            Edit
                                                        </button>
                                                        <UpdateTransitionButton 
                                                            item={t} 
                                                            className="btn btn-sm btn-outline-primary"
                                                        >
                                                            Pencil
                                                        </UpdateTransitionButton>
                                                        <DeleteTransitionButton
                                                            item={t}
                                                            className="btn btn-sm btn-outline-danger"
                                                            onOk={handleDeleteTransition(t)}
                                                        >
                                                            "trash"
                                                        </DeleteTransitionButton>
                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => onTransitionRemove?.(t)}
                                                        >
                                                            -
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </td>
                                );
                            })}
                        </tr>
                    ))} */}

                    {/* “current” řádek pro rychlou práci */}
                    <tr>
                        <th scope="row" className="table-primary">
                            <div className="d-flex gap-2 justify-content-center">
                            {current ? (
                                <button className="btn btn-sm btn-primary">{current.name}</button>
                            ) : (
                                <span className="text-muted">—</span>
                            )}
                            </div>
                        </th>
                        {states.map((colState, c) => {
                            const list = matrix?.[currentRowIndex]?.[c] ?? [];
                            return (
                                <td key={colState.id}>
                                    <div className="d-flex gap-2 justify-content-center">
                                    {(list.length === 0) && (current !== colState) && (
                                        <CreateTransitionButton 
                                            className="btn btn-sm btn-outline-secondary w-100"
                                            item={{
                                                // name: (r>c)?"Vrátit":"Schválit",
                                                name: (current?.order < colState?.order)?"Vrátit":"Schválit",
                                                sourceId: current?.id,
                                                targetId: colState?.id,
                                                statemachineId: current?.statemachineId
                                            }}
                                            onOk={handleReRead}
                                        >
                                            Přidat: {current?.name} <ArrowRight/> {colState?.name}
                                        </CreateTransitionButton>
                                    )}
                                    {(current === colState) && (
                                        <span className="form-control btn btn-sm btn-outline-danger border-0">
                                            Nelze do stejného stavu
                                        </span>
                                    )}
                                    {(list.length !== 0) && (
                                            list.map((t) => (
                                                <span key={t.id} title={t.id}>
                                                    <button
                                                        className="btn btn-sm btn-primary border-0 me-2"
                                                        onClick={() => onStateClick?.(colState)}
                                                    >
                                                        {t.name}
                                                    </button>
                                                    <UpdateTransitionButton
                                                        className="btn btn-sm btn-outline-danger  me-2"
                                                        item={t}
                                                    >
                                                        <PencilFill />
                                                    </UpdateTransitionButton>
                                                    <DeleteTransitionButton
                                                        className="btn btn-sm btn-outline-danger me-2"
                                                        item={t}
                                                        onOk={handleDeleteTransition(t)}
                                                    >
                                                        <Trash />
                                                    </DeleteTransitionButton>
                                                </span>
                                            ))
                                        
                                    )}
                                    </div>
                                </td>
                            );
                        })}
                    </tr>

                    {/* add state row */}
                    {/* <tr>
                        <th>
                            <button
                                className="form-control btn btn-outline-primary"
                                onClick={() => onStateAdd?.()}
                            >
                                +
                            </button>
                        </th>
                        <td colSpan={states.length}></td>
                    </tr> */}
                </tbody>
            </table>
        </div>
    );
}

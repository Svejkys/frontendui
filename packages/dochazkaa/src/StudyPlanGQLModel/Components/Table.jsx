import { Table as BaseTable } from "../../../../_template/src/Base/Components/Table"
import { Link } from "./Link"

/** Název předmětu: přímá událost plánu, jinak událost první lekce, která ji má. */
const getSubjectName = (row) =>
    row?.event?.name
    || row?.lessons?.find((lesson) => lesson?.event?.name)?.event?.name
    || ""

/** První sloupec: odkaz na detail plánu s názvem předmětu místo UUID. */
const CellPlan = ({ row }) => (
    <td><Link item={row}>{getSubjectName(row) || row?.id}</Link></td>
)

const CellSubject = ({ row }) => <td>{getSubjectName(row)}</td>

const CellDate = ({ row, name }) => (
    <td>{row?.[name] ? new Date(row[name]).toLocaleDateString("cs-CZ") : ""}</td>
)

const table_def = {
    name:       { label: "Studijní plán", component: CellPlan },
    event:      { label: "Předmět",       component: CellSubject },
    created:    { label: "Vytvořeno",     component: CellDate },
    lastchange: { label: "Změněno",       component: CellDate },
}

export const Table = ({ data }) => <BaseTable data={data} table_def={table_def} />
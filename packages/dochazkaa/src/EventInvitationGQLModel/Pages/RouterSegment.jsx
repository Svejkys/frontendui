import { PageEventAttendance } from "./PageEventAttendance"
import { PageAttendanceMatrix, PageAttendanceMatrixAll } from "./PageAttendanceMatrix"
import { URIRoot } from "../../uriroot"

const modelURI = `${URIRoot}/eventinvitation`

/** Route na docházku jedné výuky: /dochazka/eventinvitation/event/:id */
export const EventAttendanceURI = `${modelURI}/event/`
/** Route na matici jednoho předmětu: /dochazka/eventinvitation/matrix/:id */
export const MatrixURI = `${modelURI}/matrix/`

export const EventInvitationRouterSegments = [
    {
        path: `${EventAttendanceURI}:id`,
        element: (<PageEventAttendance />),
    },
    {
        path: `${MatrixURI}:id`,
        element: (<PageAttendanceMatrix />),
    },
    {
        path: MatrixURI.replace(/\/$/, ""),
        element: (<PageAttendanceMatrixAll />),
    },
]

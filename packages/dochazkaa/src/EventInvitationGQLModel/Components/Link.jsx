import { URIRoot } from "../../uriroot";
import { registerLink } from "../../../../_template/src/Base/Components/Link";
import { ProxyLink } from "../../../../_template/src/Base/Components/ProxyLink";

const modelURI = `${URIRoot}/eventinvitation`;
export const ListURI = `${modelURI}/list/`;
export const CreateURI = `${modelURI}/create/`;
export const ReadURI = `${modelURI}/view/`;
export const UpdateURI = `${modelURI}/edit/`;
export const DeleteURI = `${modelURI}/delete/`;

export const LinkURI = ReadURI;
export const VectorItemsURI = ListURI;

const idParam = ":id"
export const ReadItemURI = `${LinkURI}${idParam}`;

/** URI docházkové matice pro konkrétní událost: /dochazka/eventinvitation/matrix/:id */
export const MatrixURI = `${modelURI}/matrix/`;
export const MatrixItemURI = `${MatrixURI}${idParam}`;

/**
 * Odkaz na detail pozvánky. Jako text zobrazí jméno uživatele a stav.
 */
export const Link = ({ item, LinkURI: LinkURI_ = LinkURI, action = "view", children, ...props }) => {
    const targetURI = LinkURI_.replace('view', action);
    const label = children
        || (item?.user?.fullname && `${item.user.fullname} – ${item?.state?.name ?? "?"}`)
        || item?.id
        || "Pozvánka"
    return <ProxyLink to={targetURI + item?.id} {...props}>{label}</ProxyLink>
}

registerLink('EventInvitationGQLModel', Link)

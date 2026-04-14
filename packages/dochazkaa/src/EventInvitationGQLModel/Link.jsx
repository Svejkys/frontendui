import { URIRoot } from "../../uriroot";
import { registerLink } from "../../../../_template/src/Base/Components/Link";
import { ProxyLink } from "../../../../_template/src/Base/Components/ProxyLink";

const modelURI = `${URIRoot}/EventInvitationGQLModel`
export const ListURI = `${modelURI}/list/`;
export const CreateURI = `${modelURI}/create/`;
export const ReadURI = `${modelURI}/view/`;
export const UpdateURI = `${modelURI}/edit/`;
export const DeleteURI = `${modelURI}/delete/`;

export const LinkURI = ReadURI;
export const VectorItemsURI = ListURI;

const idParam = ":id"
export const ReadItemURI = `${LinkURI}${idParam}`;
export const UpdateItemURI = `${UpdateURI}${idParam}`;
export const DeleteItemURI = `${DeleteURI}${idParam}`;

export const Link = ({ item, LinkURI: LinkURI_ = LinkURI, action="view", children, ...props}) => {
    const targetURI = LinkURI_.replace('view', action);
    return (
        <ProxyLink to={targetURI + item?.id} {...props}>
            {children || item?.name || item?.id || "Nevim"}
        </ProxyLink>
    )
}

registerLink('EventInvitationGQLModel', Link)
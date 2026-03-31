import { AddRoleOnGroupURI, ReadItemURI } from "../Components"
import { InsertAsyncAction } from "../Queries"
import { SearchAsyncAction as SearchUserAsyncAction } from "../../UserGQLModel/Queries/SearchAsyncAction"
import { SearchAsyncAction as SearchGroupAsyncAction } from "../../GroupGQLModel/Queries/SearchAsyncAction"
import { 
    CreateBody as BaseCreateBody, 
    CreateButton as BaseCreateButton, 
    CreateDialog as BaseCreateDialog, 
    CreateLink  as BaseCreateLink
} from "../../../../_template/src/Base/Mutations/Create"
import { EntityLookup } from "../../../../_template/src/Base/FormControls/EntityLookup"
import { Input } from "../../../../_template/src/Base/FormControls/Input"

const AddRoleOnGroupContent = ({ item, onChange=(e)=>null, onBlur=(e)=>null, children}) => {
    return (
        <>           
        {/* defaultValue={item?.name|| "Název"}  */}
            <EntityLookup 
                asyncAction={SearchGroupAsyncAction} //SearchGroupAsyncAction
                id={"groupId"} 
                label={"Skupina"} 
                className="form-control" 
                value={item?.group} 
                onChange={onChange} 
                onBlur={onBlur} 
                disabled
            />
            <EntityLookup 
                asyncAction={SearchUserAsyncAction} //SearchGroupAsyncAction
                id={"userId"} 
                label={"Uživatel"} 
                className="form-control" 
                value={item?.user} 
                onChange={onChange} 
                onBlur={onBlur} 
            />
            <Input 
                id={"startdate"} 
                type={"datetime-local"}
                label={"Počáteční datum"} 
                className="form-control" 
                value={item?.startdate} // || isoNowZ } //|| new Date().toISOString()} 
                onChange={onChange} 
                onBlur={onBlur} 
            />
            <Input 
                id={"enddate"} 
                type={"datetime-local"}
                label={"Koncové datum"} 
                className="form-control" 
                value={item?.enddate} 
                onChange={onChange} 
                onBlur={onBlur} 
            />
            {children}
        </>
    )
}

const DefaultContent = AddRoleOnGroupContent
const MutationAsyncAction = InsertAsyncAction

const permissions = {
    oneOfRoles: ["administrátor"],
    mode: "item",
}

export const AddRoleOnGroupLink = ({
    uriPattern=AddRoleOnGroupURI,
    ...props
}) => (
    <BaseCreateLink {...props} uriPattern={uriPattern} />
);

export const AddRoleOnGroupButton = ({
    mutationAsyncAction=MutationAsyncAction,
    DefaultContent:defaultContent=DefaultContent,
    readItemURI=ReadItemURI, 
    ...props
}) => {
    return <BaseCreateButton 
        {...props}
        DefaultContent={defaultContent} 
        readItemURI={readItemURI}
        mutationAsyncAction={mutationAsyncAction}
        {...permissions}
    />
}

export const AddRoleOnGroupDialog = ({
    mutationAsyncAction=MutationAsyncAction,
    DefaultContent:defaultContent=DefaultContent,
    readItemURI=ReadItemURI, 
    ...props
}) => {
    return <BaseCreateDialog 
        {...props} 
        DefaultContent={defaultContent} 
        readItemURI={readItemURI}
        mutationAsyncAction={mutationAsyncAction}
    />
};

export const AddRoleOnGroupBody = ({
    mutationAsyncAction=MutationAsyncAction,
    DefaultContent:defaultContent=DefaultContent,
    readItemURI=ReadItemURI, 
    ...props
}) => {
    return <BaseCreateBody 
        {...props} 
        DefaultContent={defaultContent} 
        readItemURI={readItemURI}
        mutationAsyncAction={mutationAsyncAction}
    />
};


import { CreateURI, ReadItemURI } from "../Components"
// import { InsertAsyncAction } from "../Queries"
import { 
    CreateBody as BaseCreateBody, 
    CreateButton as BaseCreateButton, 
    CreateDialog as BaseCreateDialog, 
    CreateLink  as BaseCreateLink
} from "../../../../_template/src/Base/Mutations/Create"
import { SearchAsyncAction as SearchGroupAsyncAction } from "../../GroupGQLModel/Queries/SearchAsyncAction"
import { Input } from "../../../../_template/src/Base/FormControls/Input"
import { EntityLookup } from "../../../../_template/src/Base/FormControls/EntityLookup"
import { InsertAsyncAction } from "../../MembershipGQLModel/Queries"


// const DefaultContent = MediumEditableContent
const UserInserMembershipContent = ({ item, onChange=(e)=>null, onBlur=(e)=>null, children}) => {
    // const isoNow = new Date().toISOString()
    // const isoNowZ = isoNow.slice(0, isoNow.length - 1)
    // console.log("isoNow", isoNow.slice(0, isoNow.length - 1))
    return (
        <>           
        {/* defaultValue={item?.name|| "Název"}  */}
            <Input 
                id={"userId"} 
                // label={"Id uživatele"} 
                className="form-control" 
                value={item?.user?.id} 
                onChange={onChange} 
                onBlur={onBlur} 
                hidden
            />
            <Input 
                id={"userName"} 
                label={"Uživatele"} 
                className="form-control" 
                value={item?.user?.fullname||item?.user?.name||"K"} 
                onChange={onChange} 
                onBlur={onBlur} 
                disabled
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
            <EntityLookup 
                asyncAction={SearchGroupAsyncAction} //SearchGroupAsyncAction
                id={"groupId"} 
                label={"Skupina"} 
                className="form-control" 
                value={item?.group} 
                onChange={onChange} 
                onBlur={onBlur} 
            />
        </>
    )
}


const MutationAsyncAction = InsertAsyncAction
const CreateUserInserMembershipURI = CreateURI
const permissions = {
    oneOfRoles: ["administrátor", "personalista"],
    mode: "item",
}

export const CreateUserInserMembershipLink = ({
    uriPattern=CreateUserInserMembershipURI,
    ...props
}) => (
    <BaseCreateLink {...props} uriPattern={uriPattern} />
);

export const CreateUserInserMembershipButton = ({
    mutationAsyncAction=MutationAsyncAction,
    DefaultContent:defaultContent=UserInserMembershipContent,
    readItemURI=ReadItemURI, 
    item={},
    // item={},
    ...props
}) => {
    return <BaseCreateButton 
        {...props}
        DefaultContent={defaultContent} 
        readItemURI={readItemURI}
        mutationAsyncAction={mutationAsyncAction}
        rbacitem={item}
        item={item}
        {...permissions}
    />
}

export const CreateUserInserMembershipDialog = ({
    mutationAsyncAction=MutationAsyncAction,
    DefaultContent:defaultContent=UserInserMembershipContent,
    readItemURI=ReadItemURI, 
    item={},
    ...props
}) => {
    return <BaseCreateDialog 
        {...props} 
        title="Nové členství"
        item={item}
        DefaultContent={defaultContent} 
        readItemURI={readItemURI}
        mutationAsyncAction={mutationAsyncAction}
    />
};

export const CreateUserInserMembershipBody = ({
    mutationAsyncAction=MutationAsyncAction,
    DefaultContent:defaultContent=UserInserMembershipContent,
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


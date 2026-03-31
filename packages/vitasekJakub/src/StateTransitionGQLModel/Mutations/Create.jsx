import { CreateURI, MediumEditableContent, ReadItemURI } from "../Components"
import { InsertAsyncAction } from "../Queries"
import { 
    CreateBody as BaseCreateBody, 
    CreateButton as BaseCreateButton, 
    CreateDialog as BaseCreateDialog, 
    CreateLink  as BaseCreateLink
} from "../../Base/Mutations/Create"

const DefaultContent = (props) => <MediumEditableContent {...props} />
const MutationAsyncAction = InsertAsyncAction

const permissions = {
    oneOfRoles: ["superadmin"],
    mode: "absolute",
}

export const CreateLink = ({
    uriPattern=CreateURI,
    ...props
}) => (
    <BaseCreateLink {...props} uriPattern={uriPattern} />
);

export const CreateButton = ({
    mutationAsyncAction=MutationAsyncAction,
    CreateDialog: CreateDialog_=CreateDialog,
    DefaultContent:defaultContent=DefaultContent,
    readItemURI=ReadItemURI, 
    rbacitem,
    item={
        name: "Nový",
    },
    ...props
}) => {
    return <BaseCreateButton 
        {...props}
        DefaultContent={defaultContent} 
        CreateDialog={CreateDialog_}
        readItemURI={readItemURI}
        rbacitem={rbacitem}
        item={item}
        mutationAsyncAction={mutationAsyncAction}
        {...permissions}
    />
}

export const CreateDialog = ({
    title = "Nová změna stavu",
    mutationAsyncAction=MutationAsyncAction,
    DefaultContent:defaultContent=DefaultContent,
    readItemURI=ReadItemURI, 
    item,
    ...props
}) => {
    return <BaseCreateDialog 
        {...props} 
        title={title}
        DefaultContent={defaultContent} 
        readItemURI={readItemURI}
        item={item}
        mutationAsyncAction={mutationAsyncAction}
    />
};

export const CreateBody = ({
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


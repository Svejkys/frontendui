import { DeleteItemURI, ListURI, MediumContent, VectorItemsURI } from "../Components";
import { DeleteAsyncAction } from "../Queries";
import { 
    DeleteBody as BaseDeleteBody, 
    DeleteButton as BaseDeleteButton, 
    DeleteDialog as BaseDeleteDialog, 
    DeleteLink as BaseDeleteLink
} from "../../Base/Mutations/Delete";

const DefaultContent = MediumContent
const MutationAsyncAction = DeleteAsyncAction

const permissions = {
    oneOfRoles: ["superadmin"],
    mode: "absolute",
}

export const DeleteLink = ({ 
    uriPattern=DeleteItemURI,
    ...props
 }) => {
    return (
        <BaseDeleteLink 
            {...props} 
            uriPattern={uriPattern} 
            {...permissions}
        />
    )
};

/**
 * 
 * @param {onOk} param0 if defined, it is used to feeback that delete has been run, otherwise vectorItemsURI is used for navigation
 * @returns 
 */
export const DeleteButton = ({
    mutationAsyncAction=MutationAsyncAction,
    DefaultContent:DefaultContent_=DefaultContent,
    vectorItemsURI=ListURI,
    onOk,
    ...props 
}) => {
    return (
        <BaseDeleteButton 
            {...props} 
            DefaultContent={DefaultContent_} 
            mutationAsyncAction={mutationAsyncAction}
            vectorItemsURI={vectorItemsURI}
            onOk={onOk}
            {...permissions}
        />
    )
}

export const DeleteDialog = ({
    mutationAsyncAction=MutationAsyncAction,
    DefaultContent:DefaultContent_=DefaultContent,
    vectorItemsURI=ListURI,
    ...props 
}) => {
    return (
        <BaseDeleteDialog 
            {...props} 
            DefaultContent={DefaultContent} 
            mutationAsyncAction={MutationAsyncAction}
            vectorItemsURI={vectorItemsURI}
            {...permissions}
        />
    )
}

export const DeleteBody = ({ 
    mutationAsyncAction=MutationAsyncAction,
    DefaultContent:DefaultContent_=DefaultContent,
    vectorItemsURI=ListURI,
    ...props
}) => {
    return (
        <BaseDeleteBody 
            {...props} 
            DefaultContent={DefaultContent} 
            mutationAsyncAction={MutationAsyncAction}
            vectorItemsURI={vectorItemsURI}
            {...permissions}
        />
    )
}

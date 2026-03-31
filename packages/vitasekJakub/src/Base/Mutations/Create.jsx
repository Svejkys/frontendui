import { PermissionGate, usePermissionGateContext } from "../../../../dynamic/src/Hooks/useRoles"
import { LinkURI, MediumEditableContent } from "../Components"
import { useState } from "react"
import { useCreateSession } from "../../../../dynamic/src/Hooks/useCreateSession"
import { InsertAsyncAction } from "../Queries"
import { AsyncStateIndicator } from "../../../../_template/src/Base/Helpers/AsyncStateIndicator"
import { Dialog } from "../../../../_template/src/Base/FormControls/Dialog"
import { ProxyLink } from "../../../../_template/src/Base/Components/ProxyLink"
import { makeMutationURI } from "./helpers"
import { Lock } from "react-bootstrap-icons"
import { GeneralButton, GeneralDialog, GeneralLink } from "./General"


export const CreateURI = makeMutationURI(LinkURI, "create", { withId: false });
const ReadItemURI = `${LinkURI}:id`

export const CreateLink = ({
    uriPattern = CreateURI,
    children,
    ...props
}) => (
    <GeneralLink uriPattern={uriPattern} {...props}>
        {children}
    </GeneralLink>
);


const DefaultContent = MediumEditableContent

export const CreateDialog = ({
    title = "Nové oprávnění",
    oklabel = "Ok",
    cancellabel = "Zrušit",
    DefaultContent: DefaultContent_ = DefaultContent,
    item,
    onOk,
    onCancel,
    children,
    ...props
}) => (
    <GeneralDialog
        title={title}
        oklabel={oklabel}
        cancellabel={cancellabel}
        DefaultContent={DefaultContent_}
        item={item}
        onOk={onOk}
        onCancel={onCancel}
        {...props}
    >
        {children}
    </GeneralDialog>
);
export const CreateButton = ({
    mutationAsyncAction = InsertAsyncAction,
    CreateDialog: CreateDialog_ = CreateDialog,
    DefaultContent: DefaultContent_ = DefaultContent,
    readItemURI = ReadItemURI,
    uriPattern,          // pokud chceš allow override
    children,
    ...props
}) => (
    <GeneralButton
        mutationAsyncAction={mutationAsyncAction}
        Dialog={CreateDialog_}
        DefaultContent={DefaultContent_}
        uriPattern={uriPattern ?? readItemURI}
        {...props}
    >
        {children}
    </GeneralButton>
);

export const CreateBody = ({
    children,
    rbacitem,
    mutationAsyncAction = InsertAsyncAction,
    onOk,
    onCancel,
    DefaultContent: DefaultContent_ = DefaultContent,
    readItemURI = ReadItemURI,
    oneOfRoles = ["superadmin"],
    mode = "absolute",
    ...props
}) => {
    return (
        <PermissionGate oneOfRoles={oneOfRoles} mode={mode} item={rbacitem}>
            <CreateBodyBody
                children={children}
                mutationAsyncAction={mutationAsyncAction}
                onOk={onOk} 
                onCancel={onCancel}
                DefaultContent={DefaultContent_}
                readItemURI={readItemURI}
                {...props}
            />
        </PermissionGate>
    );
};

const CreateBodyBody = ({
    children,
    mutationAsyncAction = InsertAsyncAction,
    onOk,
    onCancel,
    DefaultContent: DefaultContent_ = DefaultContent,
    readItemURI = ReadItemURI,
    ...props
}) => {
    const session = useCreateSession({
        readUri: readItemURI,
        mutationAsyncAction,
        onAfterConfirm: async (result, draft) => {
            if (onOk) return onOk(result, draft);
            // když onOk není, session udělá default navigaci
        },
        onAfterCancel: async () => {
            if (onCancel) return onCancel();
            // když onCancel není, session udělá default navigate(-1)
        }
    });

    return (
        <>
            <DefaultContent_
                item={session.draft}
                onChange={session.onChange}
                onBlur={session.onBlur}
                {...props}
            >
                <AsyncStateIndicator error={session.error} loading={session.saving} />
                {children}

                <button
                    className="btn btn-warning form-control"
                    onClick={session.handleCancel}
                // disabled={!session.dirty || session.saving}
                >
                    Zrušit změny
                </button>

                <button
                    className="btn btn-primary form-control"
                    onClick={session.handleConfirm}
                // disabled={!session.dirty || session.saving}
                >
                    Uložit změny
                </button>
            </DefaultContent_>
        </>
    );
};

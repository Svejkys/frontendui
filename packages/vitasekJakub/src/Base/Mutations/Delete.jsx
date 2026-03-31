import { useNavigate } from "react-router-dom";
import { useGQLEntityContext } from "../../../../_template/src/Base/Helpers/GQLEntityProvider";
import { PermissionGate, usePermissionGateContext } from "../../../../dynamic/src/Hooks/useRoles"
import { useEditAction } from "../../../../dynamic/src/Hooks/useEditAction";
import { LinkURI, MediumContent } from "../Components";
import { DeleteAsyncAction } from "../Queries";
import { AsyncStateIndicator } from "../../../../_template/src/Base/Helpers/AsyncStateIndicator";
import { useState } from "react";
import { useCallback } from "react";
import { useMemo } from "react";
import { makeMutationURI } from "./helpers";
import { GeneralButton, GeneralDialog, GeneralLink } from "./General";


export const DeleteURI = makeMutationURI(LinkURI, "delete", { withId: true });
const VectorItemsURI = makeMutationURI(LinkURI, "list", { withId: false });
const DefaultContent = MediumContent

export const DeleteLink = ({
    item,
    preserveHash = true,
    preserveSearch = true,
    oneOfRoles = ["superadmin"],
    mode = "absolute",
    uriPattern = DeleteURI,
    children,
    ...props
}) => {
    const to = useMemo(() => {
        const id = item?.id ?? "";
        return uriPattern.replace(":id", String(id));
    }, [uriPattern, item?.id]);

    return (
        <GeneralLink
            rbacitem={item}
            oneOfRoles={oneOfRoles}
            mode={mode}
            uriPattern={to}
            preserveHash={preserveHash}
            preserveSearch={preserveSearch}
            {...props}
        >
            {children}
        </GeneralLink>
    );
};


export const DeleteButton = ({
    children,
    item,
    mutationAsyncAction = DeleteAsyncAction,
    oneOfRoles = ["superadmin"],
    mode = "absolute",
    vectorItemsURI = VectorItemsURI,
    Dialog, // možnost override
    onOk,
    ...props
}) => {
    return (
        <GeneralButton
            rbacitem={item}
            oneOfRoles={oneOfRoles}
            mode={mode}
            mutationAsyncAction={mutationAsyncAction}
            Dialog={Dialog}              // default dáme níže
            item={item}
            uriPattern={vectorItemsURI}  // po úspěchu přesměruj na list
            onOk={onOk}
            {...props}
        >
            {children || "Odstranit"}
        </GeneralButton>
    );
};

export const DeleteDialog = ({
    title = "Odstranit",
    item,
    oklabel = "Odstranit",
    cancellabel = "Zrušit",
    onOk,
    onCancel,
    DefaultContent: DefaultContent_ = DefaultContent,
}) => {
    // GeneralDialog očekává "item" + bude volat onOk(draft)
    // Draft tady = item, nemění se.
    const [draft] = useState(item);

    const handleOk_ = useCallback(async () => {
        // zavoláme onOk s itemem (draftem)
        return onOk?.(draft);
    }, [onOk, draft]);

    return (
        <GeneralDialog
            title={title}
            oklabel={oklabel}
            cancellabel={cancellabel}
            item={draft}
            onOk={handleOk_}
            onCancel={onCancel}
            // DefaultContent u delete je jen "read-only"
            DefaultContent={({ item }) => (
                <>
                    {/* <AsyncStateIndicator error={error} loading={saving} text={"Odstraňuji"} /> */}
                    <DefaultContent_ item={item} />
                </>
            )}
        />
    );
};

export const DeleteDialogContext = ({
    title = "Odstranit",

    oklabel = "Odstranit",
    cancellabel = "Zrušit",
    onOk: handleOk,
    onCancel: handleCancel,
    mutationAsyncAction = DeleteAsyncAction,
    vectorItemsURI = VectorItemsURI,
    DefaultContent: DefaultContent_ = DefaultContent
}) => {
    const {
        item,
        // onChange: contextOnChange 
    } = useGQLEntityContext()

    return (
        <DeleteDialog
            title={title}
            item={item}
            oklabel={oklabel}
            cancellabel={cancellabel}
            onCancel={handleCancel}
            onOk={handleOk}
            vectorItemsURI={vectorItemsURI}
            mutationAsyncAction={mutationAsyncAction}
        >
            {/* <AsyncStateIndicator error={error} loading={saving} text={"Odstraňuji"} /> */}
            <DefaultContent_ item={item} />
        </DeleteDialog>
    )
}

export const DeleteBody = ({
    children,
    mutationAsyncAction = DeleteAsyncAction,
    DefaultContent: DefaultContent_ = DefaultContent,
    oneOfRoles = ["superadmin"],
    mode = "absolute",
    vectorItemsURI = VectorItemsURI,
}) => {
    return (
        <PermissionGate oneOfRoles={oneOfRoles} mode={mode}>
            <DeleteBodyBody
                mutationAsyncAction={mutationAsyncAction}
                DefaultContent={DefaultContent_}
                vectorItemsURI={vectorItemsURI}
                children={children}
            />
        </PermissionGate>
    )
}

export const DeleteBodyBody = ({
    children,
    mutationAsyncAction = DeleteAsyncAction,
    DefaultContent: DefaultContent_ = DefaultContent,
    vectorItemsURI = VectorItemsURI,
}) => {
    const { allowed } = usePermissionGateContext()
    const navigate = useNavigate();
    const { item } = useGQLEntityContext()

    const {
        loading: saving,
        error: savingError,
        commitNow
    } = useEditAction(mutationAsyncAction, item, {
        mode: "confirm",
        // onCommit: contextOnChange
    })

    const handleConfirm = useCallback(async () => {
        const result = await commitNow(item)
        console.log("handleConfirm", result)
        if (result && navigate) {
            navigate(vectorItemsURI, { replace: true })
        }
    }, [navigate, commitNow])

    const handleCancel = () => {
        navigate(-1)
    }

    if (!item) return null
    if (allowed) {
        return (
            <>
                <DefaultContent_ item={item} >
                    <AsyncStateIndicator error={savingError} loading={saving} text={"Odstraňuji"} />
                    {children}
                    <button
                        className="btn btn-warning form-control"
                        onClick={handleCancel}
                        disabled={saving}
                    >
                        Zrušit
                    </button>
                    <button
                        className="btn btn-primary form-control"
                        onClick={handleConfirm}
                        disabled={saving}
                    >
                        Smazat
                    </button>

                </DefaultContent_>
            </>
        )
    } else {
        return (
            <div>
                <button
                    className="btn btn-warning form-control"
                    onClick={handleCancel}
                    disabled={saving}
                >
                    Nemáte oprávnění
                </button>
            </div>
        )
    }
}

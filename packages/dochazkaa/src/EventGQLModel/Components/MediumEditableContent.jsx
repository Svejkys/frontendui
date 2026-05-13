import { Input } from "../../../../_template/src/Base/FormControls/Input"

export const MediumEditableContent = ({
    item,
    onChange = (e) => null,
    onBlur = (e) => null,
    children
}) => {
    return (
        <>
            <Input
                id={"name"}
                type={"string"}
                label={"Název"}
                className="form-control"
                value={item?.name || ""}
                onChange={onChange}
                onBlur={onBlur}
            />

            <Input
                id={"description"}
                type={"string"}
                label={"Popis"}
                className="form-control"
                value={item?.description || ""}
                onChange={onChange}
                onBlur={onBlur}
            />

            {children}
        </>
    )
}
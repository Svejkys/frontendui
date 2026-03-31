import { useState } from "react"
import { Link } from "../../Base/Components"
import { Attribute, formatDateTime } from "../../Base/Components/Attribute"
import { EntityLookup } from "../../Base/FormControls/EntityLookup"
import { Input } from "../../Base/FormControls/Input"
import { SearchAsyncAction as SearchUserAsyncAction } from "../../UserGQLModel/Queries/SearchAsyncAction"
import { useEffect } from "react"
import { useAsyncThunkAction } from "../../../../dynamic/src/Hooks"
import { ReadAsyncAction } from "../../GroupGQLModel"
import { AsyncStateIndicator } from "../../Base/Helpers/AsyncStateIndicator"
import { InsertAsyncAction } from "../../RoleGQLModel/Queries"
import { SearchAsyncAction as SearchRoleTypeAsyncAction } from "../../RoleTypeGQLModel/Queries/SearchAsyncAction"

/**
 * A component that displays medium-level content for an template entity.
 *
 * This component renders a label "TemplateMediumContent" followed by a serialized representation of the `template` object
 * and any additional child content. It is designed to handle and display information about an template entity object.
 *
 * @component
 * @param {Object} props - The properties for the TemplateMediumContent component.
 * @param {Object} props.template - The object representing the template entity.
 * @param {string|number} props.template.id - The unique identifier for the template entity.
 * @param {string} props.template.name - The name or label of the template entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render after the serialized `template` object.
 *
 * @returns {JSX.Element} A JSX element displaying the entity's details and optional content.
 *
 * @example
 * // Example usage:
 * const templateEntity = { id: 123, name: "Sample Entity" };
 * 
 * <TemplateMediumContent template={templateEntity}>
 *   <p>Additional information about the entity.</p>
 * </TemplateMediumContent>
 */
export const MediumEditableContent = ({ item, onChange=(e)=>null, onBlur=(e)=>null, children}) => {
    return (
        <>           
        {/* defaultValue={item?.name|| "Název"}  */}
            <Input id={"name"} label={"Jméno"} className="form-control" value={item?.name|| "Název"} onChange={onChange} onBlur={onBlur} />
            <Input id={"nameEn"} label={"Anglický název"} className="form-control" value={item?.nameEn|| "Anglický název"} onChange={onChange} onBlur={onBlur} />
            {children}
        </>
    )
}


export const RBACEdit = ({ item, onChange }) => {
    const { id="" } = item || {}
    const { entity, loading, error, run } = useAsyncThunkAction(ReadAsyncAction, {id}, {deferred: true})
    const { data, loading: saving, error: updateError, run: save } = useAsyncThunkAction(InsertAsyncAction, {id}, {deferred: true})

    const [roles, setRoles] = useState((entity || {})?.roles||[])
    
    // useEffect(()=>{
    //     const newRoles = (entity || {})?.roles||[]
    //     if (newRoles === roles)
    //         return 
    //     setRoles(newRoles)
    // }, [entity, roles])

    useEffect(()=>{
        if (!id) return
        console.log("RBACEdit", item?.id, item)
    
        const runner = async () => {
            const result = await run({id})
            console.log("RBACEdit", item?.id, result)
    
        }
        runner()
    }, [id])

    useEffect(() => {
        console.log("RBACEdit.useEffect2", item?.id, entity)
        const newRoles = (entity || {})?.roles||[]
        setRoles(newRoles)
    },[entity])

    const [role, setRole] = useState({
        id: crypto.randomUUID(),
        groupId: entity?.id ?? id,
        // startdate: formatDateTime(new Date()),
        // enddate: formatDateTime(new Date() + 14)
    })

    const handleChangeOrBlur = (e) => {
        const id = e?.target?.id
        const value = e?.target?.value
        if (!id) return;
            
        setRole(prev => ({
            ...prev, [id]: value
        }))
        
    }
    const handleConfirm = async() => {
        console.log("RBACEdit.handleConfirm", item?.id, role)
        await save(role)
        await run({id})
        setRole(
            prev => ({
                ...prev,
                id: crypto.randomUUID(),
                userId: null,
                user: null,
            })
        )
        // setRoles(prev => ([...prev, role]))
    }
    return (<>
        <AsyncStateIndicator 
            error={error} 
            loading={loading} 
            text={"Nahrávám"} 
        />
        <AsyncStateIndicator 
            error={updateError} 
            loading={saving} 
            text={"Ukládám"} 
        />
        <table className="table table-stripped">
            <thead>
            <tr>
                <th>Typ role</th>
                <th>Osoba</th>
                <th>Počátek</th>
                <th>Konec</th>
                <th>Platná</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
                {roles.map(role => <tr key={role?.id}>
                    <td>
                        <Link item={role?.roletype || {}}/>
                    </td>
                    <td>
                        <Link item={role?.user || {}}/>
                    </td>
                    <td>
                        {role?.startdate?formatDateTime(role?.startdate):"-"}
                    </td>
                    <td>
                        {role?.enddate?formatDateTime(role?.enddate):"-"}
                    </td>
                    <td>
                        {role?.valid?"Ano":"Ne"}
                    </td>
                    <td>

                    </td>
                </tr>
                )}
            </tbody>
            <tfoot>
                <tr>
                    <td>
                        <EntityLookup 
                            id="roletypeId"
                            className="form-control"
                            asyncAction={SearchRoleTypeAsyncAction}
                            onChange={handleChangeOrBlur}
                            onBlur={handleChangeOrBlur}
                            value={role?.roletype}
                        />
                    </td>
                    <td>
                        <EntityLookup 
                            id="userId"
                            className="form-control"
                            asyncAction={SearchUserAsyncAction}
                            onChange={handleChangeOrBlur}
                            onBlur={handleChangeOrBlur}
                            value={role?.user}
                        />
                    </td>
                    <td>
                        <Input 
                            id="startdate"
                            type="datetime-local" 
                            className="form-control"
                            onChange={handleChangeOrBlur}
                            onBlur={handleChangeOrBlur}
                            value={role?.startdate}
                        />
                    </td>
                    <td>
                        <Input 
                            id="enddate"
                            type="datetime-local" 
                            className="form-control"
                            onChange={handleChangeOrBlur}
                            onBlur={handleChangeOrBlur}
                            value={role?.enddate}
                        />
                    </td>
                    <td colSpan={2}>
                        <button 
                            className="btn btn-outline-primary form-control"
                            onClick={handleConfirm}
                            disabled={
                                !(role?.userId && role?.startdate && role?.roletypeId)
                            }
                        >Ok</button>
                    </td>
                </tr>
            </tfoot>
        </table>
    </>)
}
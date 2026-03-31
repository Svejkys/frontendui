import { Input } from "@hrbolek/uoisfrontend-shared"
import { EntityLookup } from "../../../../_template/src/Base/FormControls/EntityLookup"
import { ReadPageAsyncAction } from "../Queries"
import { SearchAsyncAction } from "../Queries/SearchAsyncAction"
import { Group } from "../../../../_template/src/Base/Helpers/GQLEntityProvider"

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
            <Input id={"abbreviation"} label={"Zkratka"} className="form-control" value={item?.abbreviation|| "Zkr"} onChange={onChange} onBlur={onBlur} />
            <EntityLookup 
                asyncAction={SearchAsyncAction}
                id={"mastergroupId"} 
                label={"Nadřízený"} 
                className="form-control" 
                value={item?.mastergroup} 
                onChange={onChange} 
                onBlur={onBlur} 
            />
            {/* <Group id="subgroup">
                <Input id={"name"} label={"Jméno"} className="form-control" value={item?.name|| "Název"} onChange={onChange} onBlur={onBlur} />    
            </Group> */}
            {children}
        </>
    )
}

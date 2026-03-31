import { CardCapsule } from "./CardCapsule"
import { Link } from "./Link"
import { MediumContent } from "./MediumContent"

export const MediumCard = ({ header, item, children }) => {
    return (
        <CardCapsule header={header || <Link item={item}/>} item={item}>
            
            <MediumContent item={item} />
            {children}
            <hr/>
            {Object.entries(item).map(([attribute_name, attribute_value]) => {
                if (Array.isArray(attribute_value)) return null
                if (typeof attribute_value === "object" && attribute_value !== null) {
                    return <Link item={attribute_value}><b>{attribute_name} {JSON.stringify({})}</b><br/></Link>
                    return <Link item={item} action={attribute_name}><b>{attribute_name} {JSON.stringify({})}</b><br/></Link>
                }
                return null
            }
            )}
            <hr/>
            {Object.entries(item).map(([attribute_name, attribute_value]) => {
                if (Array.isArray(attribute_value)) return (
                    <Link item={item} action={attribute_name}><b>{attribute_name} []</b><br/></Link>
                )
                return null
            })}
        </CardCapsule>
    )
}

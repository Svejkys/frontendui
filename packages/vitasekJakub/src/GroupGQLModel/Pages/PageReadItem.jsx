import { GroupSubgroups } from "../Vectors/GroupSubgroups"
import { PageItemBase } from "./PageBase"

export const PageReadItem = ({ 
    // SubPage=GeneratedContentBase,
    SubPage=GroupSubgroups,
    ...props
}) => {
    return (
        <PageItemBase SubPage={SubPage} {...props}/>
    )
}
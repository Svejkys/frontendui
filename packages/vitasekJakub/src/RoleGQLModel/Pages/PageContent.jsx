import { BaseUI } from "../../Base"
import { useGQLEntityContext } from "../../Template/Utils/GQLEntityProvider"

/**
 * Renders a page layout for a single template entity, including navigation and detailed view.
 *
 * This component wraps `TemplatePageNavbar` and `TemplateLargeCard` to provide a consistent
 * interface for displaying an individual template. It also supports rendering children as 
 * nested content inside the card.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {React.ReactNode} [props.children] - Optional nested content rendered inside the card.
 * @returns {JSX.Element} Rendered page layout for a template.
 *
 * @example
 * const template = { id: 1, name: "Example Template" };
 * <TemplatePageContent template={template}>
 *   <p>Additional info here.</p>
 * </TemplatePageContent>
 */
export const PageContent = ({ children, ...props}) => {
    const { item } = useGQLEntityContext()
    if (!item) return null
    return (<>
        <BaseUI.LargeCard item={item} {...props} >
            {children}
            {/* Template {JSON.stringify(item)} */}
        </BaseUI.LargeCard>        
    </>)
}
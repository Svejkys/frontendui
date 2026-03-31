import { useLocation } from "react-router"
import { InfiniteScroll } from "@hrbolek/uoisfrontend-shared"
import { ReadPageAsyncAction } from "../Queries"
import { Link, MediumCard } from "../Components"
import { PageNavbar } from "./PageNavbar"
import { Col } from "react-bootstrap"

/**
 * Visualizes a list of template entities using TemplateMediumCard.
 *
 * This component receives an array of template objects via the `items` prop
 * and renders a `TemplateMediumCard` for each item. Each card is keyed by the template's `id`.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Array<Object>} props.items - Array of template entities to visualize. Each object should have a unique `id` property.
 * @returns {JSX.Element} A fragment containing a list of TemplateMediumCard components.
 *
 * @example
 * const templates = [
 *   { id: 1, name: "Template 1", ... },
 *   { id: 2, name: "Template 2", ... }
 * ];
 *
 * <TemplateVisualiser items={templates} />
 */
const CardVisualiser = ({items}) => {
    return (
        <>
            {items.map(template => (
                <Col key={requesttype.id} >
                    <MediumCard key={template.id} template={template}>
                        
                    </MediumCard>
                </Col>
            ))}
        </>
    )
}

/**
 * Visualizes a list of template entities using table.
 *
 * This component receives an array of template objects via the `items` prop
 * and renders a `tr` for each item. Each row is keyed by the template's `id`.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Array<Object>} props.items - Array of template entities to visualize. Each object should have a unique `id` property.
 * @returns {JSX.Element} A fragment containing a list of TemplateMediumCard components.
 *
 * @example
 * const templates = [
 *   { id: 1, name: "Template 1", ... },
 *   { id: 2, name: "Template 2", ... }
 * ];
 *
 * <TemplateTableVisualiser items={templates} />
 */
export const TableVisualiser = ({items}) => {
    return (
        <table className="table table-striped">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Name</th>
                    <th>Tools</th>
                </tr>
            </thead>
            <tbody>
            {items.map(template => (
                <tr key={template?.id} >
                    <td>
                        <Link template={template} />
                    </td>
                    <td>{template?.name}</td>
                    <td></td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}

/**
 * Page component for displaying a (potentially filtered) list of template entities with infinite scrolling.
 *
 * This component parses the `where` query parameter from the URL (if present), 
 * passes it as a filter to the `InfiniteScroll` component, and visualizes the resulting templates using the specified `Visualiser`.
 * 
 * You can optionally provide custom children or a custom Visualiser component.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {function} [props.Visualiser=TemplateVisualiser] - 
 *   Optional component used to visualize the loaded templates. Receives `items` as prop.
 * @param {React.ReactNode} [props.children] - Optional child elements to render below the visualized templates.
 *
 * @returns {JSX.Element} The rendered page with infinite scroll and optional children.
 *
 * @example
 * // Will fetch and display templates filtered by a `where` clause passed in the URL, e.g.:
 * //   /template?where={"name":"Example"}
 * <TemplateVectorPage />
 *
 * @example
 * // With a custom visualizer and children:
 * <TemplateVectorPage Visualiser={CustomTemplateList}>
 *   <Footer />
 * </TemplateVectorPage>
 */
export const VectorPage = ({children, Visualiser=CardVisualiser}) => {
    const { search } = useLocation();
    let actionParams = { skip: 0, limit: 10};
    try {
        const params = new URLSearchParams(search);
        const where = params.get('where');        
        actionParams.where = where ? JSON.parse(where) : undefined;
    } catch (e) {
        console.warn("Invalid 'where' query parameter!", e);
    }
    const onSearchChange = () => null
    return (<>
        <PageNavbar template={template} onSearchChange={onSearchChange} />
        <InfiniteScroll
            preloadedItems={[]} // No preloaded items for template
            actionParams={actionParams} 
            asyncAction={ReadPageAsyncAction}
            Visualiser={Visualiser}
        />
        {children}
    </>)
}
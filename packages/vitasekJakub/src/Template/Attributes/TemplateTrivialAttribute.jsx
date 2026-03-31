/**
 * A component for displaying the `trivial` attribute of an template entity.
 *
 * This component checks if the `trivial` attribute exists on the `template` object. If `trivial` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it displays a placeholder message
 * and a JSON representation of the `trivial` attribute.
 *
 * @component
 * @param {Object} props - The props for the TemplateTrivialAttribute component.
 * @param {Object} props.template - The object representing the template entity.
 * @param {*} [props.template.trivial] - The trivial attribute of the template entity to be displayed, if defined.
 *
 * @returns {JSX.Element|null} A JSX element displaying the `trivial` attribute or `null` if the attribute is undefined.
 *
 * @example
 * // Example usage:
 * const templateEntity = { trivial: { id: 1, name: "Sample Trivial" } };
 *
 * <TemplateTrivialAttribute template={templateEntity} />
 */
export const TemplateTrivialAttribute = ({template}) => <>{template?.trivial}</>

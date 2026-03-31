import { Col as Col_ } from "react-bootstrap"
import { bs, cx } from "./style";

export const Col0 = ({ children, className, ...props }) => {
    return (
        <div {...props} className={className ? className + " col" : "col"}>
            {children}
        </div>
    )
}

export function Col({ className, classNames, xs, sm, md, lg, xl, xxl, as: Tag = "div", ...props }) {
  return (
    <Tag
      {...props}
      className={cx(
        "Col", // hook
        bs.grid.col({ xs, sm, md, lg, xl, xxl }),
        className,
        classNames?.root
      )}
    />
  );
}

export const LeftColumn = ({children, ...props}) => {
    return (
        <Col xl={3} md={12} className="LeftColumn" {...props}>{children}</Col> 
    )
}

export const MiddleColumn = ({children, ...props}) => {
    return (
        <Col xl={9} md={12} className="MiddleColumn" {...props}>{children}</Col> 
    )
}
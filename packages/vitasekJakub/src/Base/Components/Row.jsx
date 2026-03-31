import { bs, cx } from "./style";

export const Row0 = ({ children, className, ...props }) => {
    return (
        <div {...props} className={className ? className + " row" : "row"}>
            {children}
        </div>
    )
}

export function Row({ className, classNames, g, gx, gy, align, justify, as: Tag = "div", ...props }) {
  return (
    <Tag
      {...props}
      className={cx(
        "Row", // hook
        bs.grid.row({ g, gx, gy, align, justify }),
        className,
        classNames?.root
      )}
    />
  );
}
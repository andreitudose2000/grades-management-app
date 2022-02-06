import { Link, LinkProps } from "react-router-dom";

interface CustomLinkProps extends LinkProps {}

export default function CustomLink(props: CustomLinkProps) {
  return (
    <Link {...props} style={{ textDecoration: "none" }}>
      {props.children}
    </Link>
  );
}

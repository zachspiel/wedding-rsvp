"use client";

import { HTMLMotionProps, m } from "framer-motion";

interface Props {
  motionProps: HTMLMotionProps<"div">;
  children: React.ReactNode;
}

const MotionContainer = ({ children, motionProps }: Props) => {
  return <m.div {...motionProps}>{children}</m.div>;
};

export default MotionContainer;

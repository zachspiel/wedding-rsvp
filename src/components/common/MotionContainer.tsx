"use client";

import { HTMLMotionProps, motion } from "framer-motion";

interface Props {
  motionProps: HTMLMotionProps<"div">;
  children: React.ReactNode;
}

const MotionContainer = ({ children, motionProps }: Props) => {
  return <motion.div {...motionProps}>{children}</motion.div>;
};

export default MotionContainer;

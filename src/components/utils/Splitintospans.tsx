import { motion } from "motion/react"

type SplitIntoSpanProps = {
    children: string,
    separator?: string,
    delay?: number,
    stagger?: number,
    duration?: number,
    className?: (word?: string, i?: number) => string,
}

export default function StaggerredSpans({ children, separator = " ", className = () => "", delay = 0, duration = 1, stagger = 0.1 }: SplitIntoSpanProps) {
    return children.split(separator).map((word, i) => (
        <motion.span
            initial={{ opacity: 0, filter: "blur(16px)" }}
            whileInView={{ opacity: 1, filter: "blur(0)" }}
            viewport={{ once: true }}
            transition={{ delay: delay + stagger * i, duration, ease: "easeInOut" }}
            key={i} className={className(word, i)} >{word} </motion.span>
    ))
}
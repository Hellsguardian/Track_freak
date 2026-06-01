import React from 'react';
import { motion } from 'motion/react';

interface ControlSectionProps {
  children: React.ReactNode;
  className?: string;
}

const ControlSection = ({ children, className = "" }: ControlSectionProps) => (
  <motion.section 
    initial={{ opacity: 0, y: 15 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    className={`glass-card glow-border ${className}`}
  >
    {children}
  </motion.section>
);

export default ControlSection;

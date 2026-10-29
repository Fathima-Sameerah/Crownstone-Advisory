import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function PracticeBlock() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="practice-block-container">
      <div className="practice-cards-wrapper">
        <motion.div
          className="practice-card practice-card-left"
          initial={shouldReduceMotion ? {} : { opacity: 0, x: -40 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="practice-card-title">SRI LANKA PRACTICE</span>
        </motion.div>

        <motion.div
          className="practice-card practice-card-right"
          initial={shouldReduceMotion ? {} : { opacity: 0, x: 40 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="practice-card-title">GCC PRACTICE</span>
        </motion.div>
      </div>

      <motion.p
        className="practice-motto"
        initial={shouldReduceMotion ? {} : { opacity: 0, y: 15 }}
        whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        LOCAL EXPERTISE. REGIONAL PERSPECTIVE. GLOBAL STANDARDS.
      </motion.p>
    </div>
  );
}

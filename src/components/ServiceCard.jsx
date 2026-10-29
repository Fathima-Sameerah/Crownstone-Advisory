import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import IconCircle from './IconCircle';

export default function ServiceCard({
  icon,
  title,
  badge = null,
  items = [],
  variant = "white", // "white" or "navy"
  className = "",
  style = {}
}) {
  const shouldReduceMotion = useReducedMotion();
  const isNavy = variant === "navy";

  return (
    <motion.div
      className={`service-card ${isNavy ? 'service-card-navy' : 'service-card-white'} ${className}`}
      style={style}
      whileHover={shouldReduceMotion ? {} : { y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="service-card-header">
        <IconCircle name={icon} className={isNavy ? 'icon-circle-on-navy' : ''} />
        {badge && <span className="service-card-badge">{badge}</span>}
      </div>

      <h3 className="service-card-title">{title}</h3>

      {items && items.length > 0 && (
        <ul className="service-card-list">
          {items.map((item, idx) => (
            <motion.li
              key={idx}
              className="service-card-item"
              initial={shouldReduceMotion ? {} : { opacity: 0, x: -10 }}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.08 * idx, duration: 0.4 }}
            >
              <span className="gold-dot-bullet" aria-hidden="true" />
              <span className="service-card-item-text">{item}</span>
            </motion.li>
          ))}
        </ul>
      )}
    </motion.div>
  );
}

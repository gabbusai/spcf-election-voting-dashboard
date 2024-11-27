import React from 'react';
import { motion } from 'motion/react';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const StatsCard = ({ title, bgColor, color, statistic, icon, trend }) => {
  return (
    <motion.div
      className="relative p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
      style={{ backgroundColor: bgColor, color: color }}
      layout
    >
      {/* Title */}
      <div className="text-sm font-semibold">{title}</div>

      {/* Icon */}
      <div className="absolute top-3 right-3 text-3xl">
        {icon ? icon : <FiTrendingUp />}  {/* Default icon */}
      </div>

      {/* Statistic */}
      <div className="text-xl font-bold mt-2">{statistic}</div>

      {/* Trend */}
      {trend && (
        <div className="flex items-center mt-2 text-sm">
          {trend === "up" ? (
            <FiTrendingUp className="text-green-500 mr-1" />
          ) : (
            <FiTrendingDown className="text-red-500 mr-1" />
          )}
          {trend === "up" ? "Increase" : trend === "down" ? "Decrease" : "No Change"}
        </div>
      )}
    </motion.div>
  );
};

export default StatsCard;

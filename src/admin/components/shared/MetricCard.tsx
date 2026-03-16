/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';
import { clsx } from 'clsx';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isUp: boolean;
  };
  color?: 'accent' | 'emerald' | 'amber' | 'blue';
}

export function MetricCard({ label, value, icon: Icon, trend, color = 'accent' }: MetricCardProps) {
  const colorClasses = {
    accent: 'text-accent bg-accent/10 border-accent/20',
    emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    amber: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="glass-card p-6 flex flex-col justify-between h-40 group hover:border-accent/50 transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div className={clsx("p-3 rounded-xl border transition-all duration-300 group-hover:scale-110", colorClasses[color])}>
          <Icon size={24} />
        </div>
        {trend && (
          <div className={clsx(
            "flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full",
            trend.isUp ? "text-emerald-500 bg-emerald-500/10" : "text-red-500 bg-red-500/10"
          )}>
            {trend.isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trend.value}%
          </div>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{label}</p>
        <p className="text-2xl font-display font-bold text-white">{value}</p>
      </div>
    </motion.div>
  );
}

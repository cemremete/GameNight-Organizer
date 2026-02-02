import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import clsx from 'clsx'

interface StatCardProps {
  icon: ReactNode
  label: string
  value: string | number
  trend?: { value: string; positive: boolean }
  color?: string
}

export default function StatCard({ icon, label, value, trend, color = 'bg-coral-100' }: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-2xl border-3 border-charcoal-900 p-5 shadow-playful"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center border-2 border-charcoal-900", color)}>
          {icon}
        </div>
        {trend && (
          <span className={clsx(
            "text-sm font-bold px-2 py-1 rounded-full",
            trend.positive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          )}>
            {trend.positive ? '↗' : '↘'} {trend.value}
          </span>
        )}
      </div>
      <div className="font-display text-2xl font-bold text-charcoal-900 mb-1">{value}</div>
      <div className="text-sm text-charcoal-700">{label}</div>
    </motion.div>
  )
}

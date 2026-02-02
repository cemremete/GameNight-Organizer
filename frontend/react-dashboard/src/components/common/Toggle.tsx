import { motion } from 'framer-motion'
import clsx from 'clsx'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
}

export default function Toggle({ checked, onChange, label, disabled = false }: ToggleProps) {
  return (
    <label className={clsx(
      "flex items-center gap-3 cursor-pointer",
      disabled && "opacity-50 cursor-not-allowed"
    )}>
      <div 
        className={clsx(
          "relative w-14 h-8 rounded-full border-3 border-charcoal-900 transition-colors",
          checked ? "bg-green-400" : "bg-gray-200"
        )}
        onClick={() => !disabled && onChange(!checked)}
      >
        <motion.div
          className="absolute top-0.5 w-6 h-6 bg-white rounded-full border-2 border-charcoal-900"
          animate={{ left: checked ? '24px' : '2px' }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </div>
      {label && <span className="font-body text-charcoal-900">{label}</span>}
    </label>
  )
}

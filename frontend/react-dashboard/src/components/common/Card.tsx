import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import clsx from 'clsx'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  borderColor?: string
  onClick?: () => void
}

export default function Card({ 
  children, 
  className, 
  hover = true,
  borderColor = 'border-charcoal-900',
  onClick 
}: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4 } : undefined}
      className={clsx(
        "bg-white rounded-2xl border-3 p-6 shadow-playful transition-all",
        borderColor,
        hover && "hover:shadow-playful-lg cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}

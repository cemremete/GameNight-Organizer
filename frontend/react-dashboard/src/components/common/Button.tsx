import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import clsx from 'clsx'

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  onClick?: () => void
  icon?: ReactNode
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit'
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  icon,
  className,
  disabled = false,
  type = 'button'
}: ButtonProps) {
  const baseClasses = "font-display font-bold rounded-full border-3 border-charcoal-900 transition-all duration-200 inline-flex items-center justify-center gap-2"
  
  const variantClasses = {
    primary: "bg-coral-400 hover:bg-coral-500 text-charcoal-900 shadow-playful hover:shadow-playful-hover hover:-translate-y-0.5",
    secondary: "bg-white hover:bg-gray-50 text-charcoal-900 shadow-playful hover:shadow-playful-hover hover:-translate-y-0.5",
    ghost: "bg-transparent border-transparent hover:bg-coral-100"
  }
  
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  }

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {icon && <span>{icon}</span>}
      {children}
    </motion.button>
  )
}

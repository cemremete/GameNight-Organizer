import clsx from 'clsx'

interface Participant {
  id: string
  name: string
  avatar?: string
}

interface AvatarStackProps {
  participants: Participant[]
  max?: number
  size?: 'sm' | 'md' | 'lg'
}

const colors = ['bg-coral-400', 'bg-blue-400', 'bg-green-400', 'bg-purple-400', 'bg-yellow-400']

export default function AvatarStack({ participants, max = 4, size = 'md' }: AvatarStackProps) {
  const visible = participants.slice(0, max)
  const remaining = participants.length - max
  
  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-10 h-10 text-base'
  }

  return (
    <div className="flex -space-x-2">
      {visible.map((p, i) => (
        <div
          key={p.id}
          className={clsx(
            "rounded-full border-2 border-white flex items-center justify-center font-bold text-charcoal-900",
            sizeClasses[size],
            colors[i % colors.length]
          )}
          title={p.name}
        >
          {p.avatar ? (
            <img src={p.avatar} alt={p.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            p.name.charAt(0).toUpperCase()
          )}
        </div>
      ))}
      {remaining > 0 && (
        <div className={clsx(
          "rounded-full border-2 border-white bg-gray-300 flex items-center justify-center font-bold text-charcoal-900",
          sizeClasses[size]
        )}>
          +{remaining}
        </div>
      )}
    </div>
  )
}

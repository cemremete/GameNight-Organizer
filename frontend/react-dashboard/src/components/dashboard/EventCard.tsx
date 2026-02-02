import { motion } from 'framer-motion'
import { Calendar, Clock, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Badge from '../common/Badge'
import AvatarStack from '../common/AvatarStack'
import Button from '../common/Button'

interface Event {
  id: string
  name: string
  date: string
  time: string
  gameType: string
  status: 'confirmed' | 'pending' | 'full' | 'cancelled'
  participants: Array<{ id: string; name: string; avatar?: string }>
  maxParticipants: number
}

interface EventCardProps {
  event: Event
  onEdit?: () => void
  onCancel?: () => void
}

export default function EventCard({ event, onEdit, onCancel }: EventCardProps) {
  const navigate = useNavigate()

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl border-3 border-charcoal-900 p-6 shadow-playful hover:shadow-playful-lg transition-all cursor-pointer"
      onClick={() => navigate(`/events/${event.id}`)}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-display text-xl font-bold text-charcoal-900 mb-2">
            {event.name}
          </h3>
          <div className="flex flex-wrap gap-3 text-sm text-charcoal-700">
            <span className="flex items-center gap-1">
              <Calendar size={16} />
              {event.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={16} />
              {event.time}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={16} />
              {event.gameType}
            </span>
          </div>
        </div>
        <Badge status={event.status} />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AvatarStack participants={event.participants} max={4} />
          <span className="text-sm text-charcoal-700">
            {event.participants.length} / {event.maxParticipants}
          </span>
        </div>

        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <Button variant="secondary" size="sm" onClick={onEdit}>
            Edit
          </Button>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

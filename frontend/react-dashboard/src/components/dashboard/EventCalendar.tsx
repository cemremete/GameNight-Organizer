import { useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import clsx from 'clsx'

// mock events for demo
const mockEvents: Record<string, { color: string; count: number }> = {
  '2026-02-05': { color: 'bg-coral-400', count: 1 },
  '2026-02-12': { color: 'bg-blue-400', count: 2 },
  '2026-02-15': { color: 'bg-green-400', count: 1 },
  '2026-02-20': { color: 'bg-purple-400', count: 1 },
  '2026-02-28': { color: 'bg-yellow-400', count: 3 },
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

export default function EventCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1)) // feb 2026
  
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  
  // get days in month
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const days = []
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const getEventForDay = (day: number | null) => {
    if (!day) return null
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return mockEvents[dateStr]
  }

  return (
    <div className="bg-white rounded-2xl border-3 border-charcoal-900 p-6 shadow-playful">
      {/* header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-xl font-bold">{MONTHS[month]} {year}</h3>
        <div className="flex gap-2">
          <button 
            onClick={prevMonth}
            className="p-2 hover:bg-coral-100 rounded-lg transition-colors border-2 border-charcoal-900"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={nextMonth}
            className="p-2 hover:bg-coral-100 rounded-lg transition-colors border-2 border-charcoal-900"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map(day => (
          <div key={day} className="text-center text-sm font-bold text-charcoal-700 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          const event = getEventForDay(day)
          const isToday = day === 2 && month === 1 && year === 2026 // feb 2 2026
          
          return (
            <motion.div
              key={i}
              whileHover={day ? { scale: 1.1 } : undefined}
              className={clsx(
                "aspect-square flex flex-col items-center justify-center rounded-lg text-sm relative",
                day && "cursor-pointer hover:bg-coral-50",
                isToday && "bg-coral-400 border-2 border-charcoal-900 font-bold"
              )}
            >
              {day}
              {event && (
                <div className="flex gap-0.5 mt-1">
                  {Array.from({ length: Math.min(event.count, 3) }).map((_, j) => (
                    <div key={j} className={clsx("w-1.5 h-1.5 rounded-full", event.color)} />
                  ))}
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

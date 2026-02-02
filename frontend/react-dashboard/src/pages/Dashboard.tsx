import { useState, useEffect } from 'react'
import { Calendar, Users, Clock, Star } from 'lucide-react'
import Sidebar from '../components/dashboard/Sidebar'
import StatCard from '../components/dashboard/StatCard'
import EventCard from '../components/dashboard/EventCard'
import EventCalendar from '../components/dashboard/EventCalendar'
import { eventsApi } from '../lib/api'

export default function Dashboard() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    eventsApi.getEvents()
      .then(response => {
        setEvents(response.events)
      })
      .catch(err => {
        setError(err.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen bg-coral-50">
        <Sidebar />
        <main className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coral-500 mx-auto mb-4"></div>
            <p className="text-charcoal-700">Loading events...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-coral-50">
        <Sidebar />
        <main className="flex-1 p-8 flex items-center justify-center">
          <div className="bg-red-100 border-2 border-red-400 text-red-700 px-6 py-4 rounded-xl">
            <p className="font-bold mb-2">Error loading events</p>
            <p>{error}</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-coral-50">
      <Sidebar />
      
      <main className="flex-1 p-8">
        {/* header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-charcoal-900 mb-2">
            Welcome back! 🎮
          </h1>
          <p className="text-charcoal-700">
            You have {events.length} upcoming game nights this month. Let's make them epic.
          </p>
        </div>

        {/* stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Calendar size={24} />}
            label="Upcoming Events"
            value={5}
            trend={{ value: '+2', positive: true }}
            color="bg-coral-100"
          />
          <StatCard
            icon={<Users size={24} />}
            label="Active Players"
            value={24}
            trend={{ value: '+8', positive: true }}
            color="bg-blue-100"
          />
          <StatCard
            icon={<Clock size={24} />}
            label="Total Hours"
            value={142}
            color="bg-green-100"
          />
          <StatCard
            icon={<Star size={24} />}
            label="Avg Rating"
            value="4.8"
            color="bg-yellow-100"
          />
        </div>

        {/* main content grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* events list - takes 2 cols */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl font-bold text-charcoal-900">
                Upcoming Events
              </h2>
              <a href="/events/create" className="text-coral-600 hover:text-coral-700 font-medium">
                + Create New
              </a>
            </div>
            
            <div className="space-y-4">
              {events.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border-3 border-charcoal-900">
                  <p className="text-charcoal-700 text-lg mb-4">No events yet</p>
                  <a href="/events/create" className="text-coral-600 hover:text-coral-700 font-bold">
                    Create your first event →
                  </a>
                </div>
              ) : (
                events.map((event: any) => (
                  <EventCard 
                    key={event.id} 
                    event={event}
                    onEdit={() => console.log('edit', event.id)}
                    onCancel={() => console.log('cancel', event.id)}
                  />
                ))
              )}
            </div>
          </div>

          {/* calendar - takes 1 col */}
          <div>
            <h2 className="font-display text-xl font-bold text-charcoal-900 mb-6">
              Calendar
            </h2>
            <EventCalendar />
          </div>
        </div>
      </main>
    </div>
  )
}

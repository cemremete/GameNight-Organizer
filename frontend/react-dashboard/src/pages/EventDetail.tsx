import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, MapPin, Edit, X, Share2, Download, MessageCircle, Send, Users } from 'lucide-react'
import Sidebar from '../components/dashboard/Sidebar'
import Button from '../components/common/Button'
import Badge from '../components/common/Badge'
import { useState, useEffect } from 'react'
import { eventsApi } from '../lib/api'

export default function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    if (id) {
      eventsApi.getEvent(id)
        .then(response => {
          setEvent(response.event)
        })
        .catch(err => {
          setError(err.message)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [id])

  const sendMessage = () => {
    if (!newMessage.trim()) return
    console.log('sending:', newMessage)
    setNewMessage('')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-coral-50">
        <Sidebar />
        <main className="flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-coral-500 mx-auto mb-4"></div>
            <p className="text-charcoal-700">Loading event...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="flex min-h-screen bg-coral-50">
        <Sidebar />
        <main className="flex-1 p-8 flex items-center justify-center">
          <div className="bg-red-100 border-2 border-red-400 text-red-700 px-6 py-4 rounded-xl">
            <p className="font-bold mb-2">Error loading event</p>
            <p>{error || 'Event not found'}</p>
            <button onClick={() => navigate('/dashboard')} className="mt-4 text-coral-600 hover:text-coral-700 font-bold">
              ← Back to Dashboard
            </button>
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
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-charcoal-700 hover:text-charcoal-900 mb-4"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="font-display text-3xl font-bold text-charcoal-900">
                  🎲 {event.name}
                </h1>
                <Badge status={event.status || 'pending'} />
              </div>
              <div className="flex flex-wrap gap-4 text-charcoal-700">
                <span className="flex items-center gap-1">
                  <Calendar size={18} />
                  {new Date(event.eventTime).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={18} />
                  {new Date(event.eventTime).toLocaleTimeString()}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={18} />
                  {event.gameType || 'Game Night'}
                </span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" icon={<Edit size={16} />}>
                Edit
              </Button>
              <Button variant="secondary" size="sm" icon={<Share2 size={16} />}>
                Share
              </Button>
              <Button variant="secondary" size="sm" icon={<Download size={16} />}>
                Export
              </Button>
              <Button variant="ghost" size="sm" icon={<X size={16} />}>
                Cancel
              </Button>
            </div>
          </div>
        </div>

        {/* main content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* left column - description and chat */}
          <div className="lg:col-span-2 space-y-6">
            {/* description */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border-3 border-charcoal-900 p-6 shadow-playful"
            >
              <h2 className="font-display text-xl font-bold mb-4">About this event</h2>
              <p className="text-charcoal-700">{event.description || 'No description provided.'}</p>
            </motion.div>

            {/* chat section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border-3 border-charcoal-900 p-6 shadow-playful"
            >
              <div className="flex items-center gap-2 mb-4">
                <MessageCircle size={20} />
                <h2 className="font-display text-xl font-bold">Event Chat</h2>
              </div>
              
              <div className="space-y-4 mb-4 max-h-64 overflow-y-auto">
                <div className="text-center py-8 text-charcoal-600">
                  <MessageCircle size={32} className="mx-auto mb-2 opacity-50" />
                  <p>Chat feature coming soon</p>
                  <p className="text-sm">Connect with WebSocket for real-time messaging</p>
                </div>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 rounded-xl border-2 border-charcoal-900 focus:outline-none focus:ring-2 focus:ring-coral-400"
                />
                <Button size="sm" onClick={sendMessage} icon={<Send size={16} />}>
                  Send
                </Button>
              </div>
            </motion.div>
          </div>

          {/* right column - participants and timezone */}
          <div className="space-y-6">
            {/* participants */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl border-3 border-charcoal-900 p-6 shadow-playful"
            >
              <h2 className="font-display text-xl font-bold mb-4">
                Participants ({event.participants?.length || 0}/{event.maxParticipants || 0})
              </h2>
              
              <div className="space-y-3">
                {event.participants?.length > 0 ? event.participants.map((p: any) => (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-coral-50">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{p.flag || '👤'}</span>
                      <div>
                        <div className="font-display font-bold text-sm">{p.name || p.username}</div>
                        <div className="text-xs text-charcoal-600">{p.timezone || 'UTC'}</div>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      p.status === 'confirmed' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                    }`}>
                      {p.status === 'confirmed' ? '✓ Confirmed' : '⏳ Pending'}
                    </span>
                  </div>
                )) : (
                  <div className="text-center py-6 text-charcoal-600">
                    <Users size={32} className="mx-auto mb-2 opacity-50" />
                    <p>No participants yet</p>
                  </div>
                )}
              </div>

              <Button variant="secondary" className="w-full mt-4">
                + Invite More Players
              </Button>
            </motion.div>

            {/* timezone conversion */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl border-3 border-charcoal-900 p-6 shadow-playful"
            >
              <h2 className="font-display text-xl font-bold mb-4">Time Zones</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between p-2 bg-coral-100 rounded-lg">
                  <span className="font-bold">Your Time (PST)</span>
                  <span className="font-mono">Fri 8:00 PM</span>
                </div>
                <div className="flex justify-between p-2">
                  <span>🇬🇧 London (GMT)</span>
                  <span className="font-mono">Sat 4:00 AM</span>
                </div>
                <div className="flex justify-between p-2">
                  <span>🇯🇵 Tokyo (JST)</span>
                  <span className="font-mono">Sat 1:00 PM</span>
                </div>
                <div className="flex justify-between p-2">
                  <span>🇩🇪 Berlin (CET)</span>
                  <span className="font-mono">Sat 5:00 AM</span>
                </div>
                <div className="flex justify-between p-2">
                  <span>🇧🇷 São Paulo (BRT)</span>
                  <span className="font-mono">Sat 1:00 AM</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}

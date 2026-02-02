import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, Gamepad2, Calendar, Users, Settings } from 'lucide-react'
import Sidebar from '../components/dashboard/Sidebar'
import Button from '../components/common/Button'
import Toggle from '../components/common/Toggle'
import { eventsApi } from '../lib/api'
import clsx from 'clsx'

const STEPS = [
  { id: 1, title: 'Event Basics', icon: Gamepad2 },
  { id: 2, title: 'Date & Time', icon: Calendar },
  { id: 3, title: 'Invite Players', icon: Users },
  { id: 4, title: 'Settings', icon: Settings },
]

const GAME_TYPES = ['Board Game', 'Video Game', 'Card Game', 'RPG', 'Other']

// mock squad members
const mockSquad = [
  { id: '1', name: 'Alex Chen', timezone: 'GMT+0', status: 'confirmed' },
  { id: '2', name: 'Yuki Tanaka', timezone: 'GMT+9', status: 'pending' },
  { id: '3', name: 'Hans Mueller', timezone: 'GMT+1', status: 'confirmed' },
  { id: '4', name: 'Maria Santos', timezone: 'GMT-3', status: 'pending' },
]

export default function CreateEvent() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    gameType: '',
    description: '',
    date: '',
    time: '',
    selectedPlayers: [] as string[],
    maxPlayers: 6,
    sendReminder: true,
    allowGuestInvites: false,
    makePublic: false,
    requireRsvp: true,
    enableChat: true,
  })

  const updateForm = (field: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const togglePlayer = (id: string) => {
    setFormData(prev => ({
      ...prev,
      selectedPlayers: prev.selectedPlayers.includes(id)
        ? prev.selectedPlayers.filter(p => p !== id)
        : [...prev.selectedPlayers, id]
    }))
  }

  const nextStep = () => setStep(s => Math.min(s + 1, 4))
  const prevStep = () => setStep(s => Math.max(s - 1, 1))

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Combine date and time into ISO string
      const eventDateTime = new Date(`${formData.date}T${formData.time}`).toISOString()
      
      const eventData = {
        name: formData.name,
        description: formData.description,
        gameType: formData.gameType,
        eventTime: eventDateTime,
        maxParticipants: formData.maxPlayers,
        isPublic: formData.makePublic,
      }
      
      await eventsApi.createEvent(eventData)
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to create event')
    } finally {
      setLoading(false)
    }
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
          <h1 className="font-display text-3xl font-bold text-charcoal-900">
            Create New Event 🎲
          </h1>
        </div>

        {/* step indicator */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div 
                className={clsx(
                  "w-12 h-12 rounded-full border-3 border-charcoal-900 flex items-center justify-center transition-colors",
                  step >= s.id ? "bg-coral-400" : "bg-white"
                )}
              >
                {step > s.id ? <Check size={20} /> : <s.icon size={20} />}
              </div>
              {i < STEPS.length - 1 && (
                <div className={clsx(
                  "w-16 h-1 mx-2",
                  step > s.id ? "bg-coral-400" : "bg-gray-300"
                )} />
              )}
            </div>
          ))}
        </div>

        {/* form container */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl border-3 border-charcoal-900 shadow-playful p-8">
            <AnimatePresence mode="wait">
              {/* Step 1: Event Basics */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="font-display text-2xl font-bold mb-6">What are we playing? 🎮</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block font-display font-bold mb-2">Event Name</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => updateForm('name', e.target.value)}
                        placeholder="Friday Night Board Games"
                        className="w-full px-4 py-3 rounded-xl border-3 border-charcoal-900 focus:outline-none focus:ring-2 focus:ring-coral-400"
                      />
                    </div>

                    <div>
                      <label className="block font-display font-bold mb-2">Game Type</label>
                      <div className="flex flex-wrap gap-2">
                        {GAME_TYPES.map(type => (
                          <button
                            key={type}
                            onClick={() => updateForm('gameType', type)}
                            className={clsx(
                              "px-4 py-2 rounded-full border-2 border-charcoal-900 font-medium transition-colors",
                              formData.gameType === type 
                                ? "bg-coral-400" 
                                : "bg-white hover:bg-coral-100"
                            )}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block font-display font-bold mb-2">Description</label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => updateForm('description', e.target.value)}
                        placeholder="Tell your squad what the plan is..."
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl border-3 border-charcoal-900 focus:outline-none focus:ring-2 focus:ring-coral-400 resize-none"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Date & Time */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="font-display text-2xl font-bold mb-6">When's the game? 📅</h2>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block font-display font-bold mb-2">Date</label>
                        <input
                          type="date"
                          value={formData.date}
                          onChange={(e) => updateForm('date', e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border-3 border-charcoal-900 focus:outline-none focus:ring-2 focus:ring-coral-400"
                        />
                      </div>
                      <div>
                        <label className="block font-display font-bold mb-2">Time</label>
                        <input
                          type="time"
                          value={formData.time}
                          onChange={(e) => updateForm('time', e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border-3 border-charcoal-900 focus:outline-none focus:ring-2 focus:ring-coral-400"
                        />
                      </div>
                    </div>

                    {/* timezone preview - this is the cool part */}
                    <div className="bg-coral-50 rounded-xl p-4 border-2 border-coral-200">
                      <h3 className="font-display font-bold mb-3">For your squad:</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>🇬🇧 Alex (London)</span>
                          <span className="font-mono">Sat, Feb 7, 4:00 AM GMT</span>
                        </div>
                        <div className="flex justify-between">
                          <span>🇯🇵 Yuki (Tokyo)</span>
                          <span className="font-mono">Sat, Feb 7, 1:00 PM JST</span>
                        </div>
                        <div className="flex justify-between">
                          <span>🇩🇪 Hans (Berlin)</span>
                          <span className="font-mono">Sat, Feb 7, 5:00 AM CET</span>
                        </div>
                      </div>
                    </div>

                    <Button variant="secondary" className="w-full">
                      🪄 Smart Suggest Best Time
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Invite Players */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="font-display text-2xl font-bold mb-6">Who's joining? 👥</h2>
                  
                  <div className="space-y-6">
                    <input
                      type="text"
                      placeholder="Search players by name or email..."
                      className="w-full px-4 py-3 rounded-xl border-3 border-charcoal-900 focus:outline-none focus:ring-2 focus:ring-coral-400"
                    />

                    <div className="space-y-3">
                      {mockSquad.map(player => (
                        <div
                          key={player.id}
                          onClick={() => togglePlayer(player.id)}
                          className={clsx(
                            "flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors",
                            formData.selectedPlayers.includes(player.id)
                              ? "border-coral-400 bg-coral-50"
                              : "border-gray-200 hover:border-coral-200"
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-coral-400 rounded-full border-2 border-charcoal-900 flex items-center justify-center font-bold">
                              {player.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-display font-bold">{player.name}</div>
                              <div className="text-sm text-charcoal-700">{player.timezone}</div>
                            </div>
                          </div>
                          <div className={clsx(
                            "w-6 h-6 rounded-full border-2 border-charcoal-900 flex items-center justify-center",
                            formData.selectedPlayers.includes(player.id) ? "bg-green-400" : "bg-white"
                          )}>
                            {formData.selectedPlayers.includes(player.id) && <Check size={14} />}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div>
                      <label className="block font-display font-bold mb-2">Max Players: {formData.maxPlayers}</label>
                      <input
                        type="range"
                        min="2"
                        max="12"
                        value={formData.maxPlayers}
                        onChange={(e) => updateForm('maxPlayers', parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Settings */}
              {step === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <h2 className="font-display text-2xl font-bold mb-6">Final touches ⚙️</h2>
                  
                  <div className="space-y-6">
                    <Toggle
                      checked={formData.sendReminder}
                      onChange={(v) => updateForm('sendReminder', v)}
                      label="Send reminder 24h before"
                    />
                    <Toggle
                      checked={formData.allowGuestInvites}
                      onChange={(v) => updateForm('allowGuestInvites', v)}
                      label="Allow guests to invite others"
                    />
                    <Toggle
                      checked={formData.makePublic}
                      onChange={(v) => updateForm('makePublic', v)}
                      label="Make event public"
                    />
                    <Toggle
                      checked={formData.requireRsvp}
                      onChange={(v) => updateForm('requireRsvp', v)}
                      label="Require RSVP confirmation"
                    />
                    <Toggle
                      checked={formData.enableChat}
                      onChange={(v) => updateForm('enableChat', v)}
                      label="Enable event chat"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* error message */}
            {error && (
              <div className="mt-6 bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-xl">
                <p className="font-bold">Error</p>
                <p>{error}</p>
              </div>
            )}

            {/* navigation buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <Button 
                variant="ghost" 
                onClick={step === 1 ? () => navigate('/dashboard') : prevStep}
                disabled={step === 1 || loading}
              >
                {step === 1 ? 'Cancel' : <ArrowLeft size={18} />} Back
              </Button>
              
              {step < 4 ? (
                <Button onClick={nextStep} icon={<ArrowRight size={18} />}>
                  Next
                </Button>
              ) : (
                <Button onClick={handleSubmit} icon={<Check size={18} />} disabled={loading}>
                  {loading ? 'Creating...' : 'Create Event'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

import { motion } from 'framer-motion'
import { Calendar, Users, Clock, Gamepad2 } from 'lucide-react'

const steps = [
  {
    icon: Calendar,
    title: 'Create Your Event',
    description: 'Pick a game, set the vibe',
    color: 'bg-coral-400'
  },
  {
    icon: Users,
    title: 'Add Your Squad',
    description: 'Invite friends from anywhere',
    color: 'bg-blue-400'
  },
  {
    icon: Clock,
    title: 'Pick Best Time',
    description: 'We find when everyone is free',
    color: 'bg-green-400'
  },
  {
    icon: Gamepad2,
    title: 'Game On!',
    description: 'Show up and have fun',
    color: 'bg-purple-400'
  }
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-charcoal-900 mb-4">
            How It Works
          </h2>
          <p className="text-charcoal-700">
            Four simple steps to gaming glory
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <div className="flex flex-col items-center text-center w-48">
                <motion.div 
                  className={`w-20 h-20 ${step.color} rounded-2xl border-3 border-charcoal-900 shadow-playful flex items-center justify-center mb-4`}
                  whileHover={{ scale: 1.05, rotate: 5 }}
                >
                  <step.icon size={36} className="text-charcoal-900" />
                </motion.div>
                <h3 className="font-display font-bold text-lg text-charcoal-900 mb-1">
                  {step.title}
                </h3>
                <p className="text-sm text-charcoal-700">
                  {step.description}
                </p>
              </div>
              
              {/* connector arrow - hidden on last item and mobile */}
              {i < steps.length - 1 && (
                <div className="hidden md:block w-16 h-1 bg-charcoal-900 mx-2 relative">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-l-8 border-l-charcoal-900 border-y-4 border-y-transparent" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

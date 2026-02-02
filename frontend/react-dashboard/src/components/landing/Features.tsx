import { motion } from 'framer-motion'
import { Globe, BarChart3, Bell } from 'lucide-react'
import Card from '../common/Card'

const features = [
  {
    icon: Globe,
    title: '⏰ Smart Timezone Magic',
    description: "Automatically converts times for all participants. No more timezone confusion!",
    borderColor: 'border-coral-400',
    iconBg: 'bg-coral-100'
  },
  {
    icon: BarChart3,
    title: '📊 Real-Time Dashboard',
    description: 'Track RSVPs, availability, and event status in real-time',
    borderColor: 'border-blue-400',
    iconBg: 'bg-blue-100'
  },
  {
    icon: Bell,
    title: '🔔 Automated Scheduling',
    description: "Find perfect times when everyone's available, automatically",
    borderColor: 'border-green-400',
    iconBg: 'bg-green-100'
  }
]

export default function Features() {
  return (
    <section className="py-20 bg-coral-50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-charcoal-900 mb-4">
            Everything You Need for Perfect Game Nights
          </h2>
          <p className="text-charcoal-700 max-w-2xl mx-auto">
            We built this because coordinating game nights across timezones was a nightmare. 
            Now it takes like 30 seconds.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card borderColor={feature.borderColor} className="h-full">
                <div className={`w-14 h-14 ${feature.iconBg} rounded-xl flex items-center justify-center mb-4 border-2 border-charcoal-900`}>
                  <feature.icon size={28} className="text-charcoal-900" />
                </div>
                <h3 className="font-display text-xl font-bold text-charcoal-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-charcoal-700 font-body">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

import { motion } from 'framer-motion'
import Card from '../common/Card'

const testimonials = [
  {
    name: 'Alex Chen',
    location: 'London, UK',
    avatar: '🧑‍💻',
    quote: "Finally I can play DnD with my friends in Tokyo without someone doing timezone math wrong at 3am"
  },
  {
    name: 'Maria Santos',
    location: 'São Paulo, Brazil',
    avatar: '👩‍🎨',
    quote: "Our weekly board game night went from 50% attendance to like 95%. The reminders are clutch."
  },
  {
    name: 'Jake Morrison',
    location: 'Austin, TX',
    avatar: '🎮',
    quote: "I run a gaming discord with 200+ people. This thing saved my sanity for real."
  }
]

export default function Testimonials() {
  return (
    <section className="py-20 bg-gradient-coral">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-charcoal-900 mb-4">
            What Gamers Are Saying
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-coral-100 rounded-full border-2 border-charcoal-900 flex items-center justify-center text-2xl">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-display font-bold text-charcoal-900">{t.name}</div>
                    <div className="text-sm text-charcoal-700">{t.location}</div>
                  </div>
                </div>
                <p className="text-charcoal-800 font-body italic">"{t.quote}"</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

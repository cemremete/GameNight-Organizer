import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Play, ChevronDown } from 'lucide-react'
import Button from '../common/Button'

// Single floating dice component
function SingleDice({ className, color, rotation }: { className: string; color: string; rotation: number }) {
  const colorMap: Record<string, string> = {
    green: 'bg-green-400',
    blue: 'bg-blue-400',
    purple: 'bg-purple-300',
    yellow: 'bg-yellow-400',
    pink: 'bg-pink-400',
    orange: 'bg-orange-400',
  }

  return (
    <motion.div
      className={`${className} ${colorMap[color]} rounded-lg border-3 border-charcoal-900 shadow-playful pointer-events-none`}
      style={{ transform: `rotate(${rotation}deg)` }}
      animate={{
        y: [0, -15, 0],
        rotate: [rotation, rotation + 5, rotation - 5, rotation],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <div className="w-2 h-2 bg-charcoal-900 rounded-full m-1"></div>
    </motion.div>
  )
}

export default function Hero() {
  const navigate = useNavigate()

  return (
    <section className="relative h-screen bg-gradient-hero overflow-hidden">
      {/* Floating Dice - More spread out */}
      <SingleDice className="absolute top-20 right-20 w-20 h-20" color="green" rotation={15} />
      <SingleDice className="absolute top-40 left-10 w-16 h-16" color="blue" rotation={-20} />
      <SingleDice className="absolute bottom-32 right-32 w-24 h-24" color="purple" rotation={45} />
      <SingleDice className="absolute bottom-20 left-20 w-20 h-20" color="yellow" rotation={-30} />
      <SingleDice className="absolute top-1/3 left-1/4 w-14 h-14" color="pink" rotation={60} />
      <SingleDice className="absolute top-2/3 right-1/4 w-18 h-18" color="orange" rotation={-45} />

      <div className="container mx-auto px-6 h-screen flex items-center relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          
          {/* Left Side - Mobile Mockup (BIGGER) */}
          <motion.div 
            className="flex justify-center lg:justify-end order-2 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              {/* Phone mockup - 1.5x bigger */}
              <div className="w-[320px] h-[640px] bg-charcoal-900 rounded-[45px] border-8 border-charcoal-900 shadow-playful-lg relative overflow-hidden">
                {/* Phone notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-charcoal-900 rounded-b-3xl z-10"></div>
                
                {/* Phone content */}
                <div className="w-full h-full bg-coral-300 rounded-[37px] overflow-hidden p-5 pt-9">
                  <div className="bg-white rounded-t-3xl p-4 h-full">
                    {/* Player name badge */}
                    <div className="flex justify-center mb-3">
                      <div className="bg-white border-3 border-charcoal-900 rounded-full px-5 py-1.5">
                        <span className="font-display font-bold text-xs">Player name</span>
                      </div>
                    </div>
                    
                    {/* GameNight! Title */}
                    <div className="text-center mb-6">
                      <h2 className="font-display font-black text-5xl text-charcoal-900 relative inline-block"
                          style={{
                            textShadow: '3px 3px 0px #FFB5B5',
                            WebkitTextStroke: '2px #2D2D2D'
                          }}>
                        <span className="text-yellow-400">Game</span>
                        <span className="text-green-400">Night!</span>
                      </h2>
                      <div className="flex justify-center gap-3 mt-1">
                        <div className="w-12 h-1 bg-charcoal-900"></div>
                        <div className="w-12 h-1 bg-charcoal-900"></div>
                      </div>
                    </div>

                    {/* Upcoming Events */}
                    <div className="bg-coral-200 rounded-2xl p-4 border-3 border-charcoal-900">
                      <h3 className="font-display font-bold text-base mb-3">Upcoming Events</h3>
                      
                      <div className="space-y-2">
                        {['Friday Board Games', 'DnD Campaign', 'Mario Kart Night'].map((event, i) => (
                          <div key={i} className="flex items-center justify-between bg-white rounded-xl p-2.5 border-2 border-charcoal-900">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 border-2 border-charcoal-900 rounded"></div>
                              <span className="font-body text-xs font-medium">{event}</span>
                            </div>
                            <div className="w-10 h-5 bg-coral-300 rounded-full border-2 border-charcoal-900"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-300 rounded-full border-3 border-charcoal-900 animate-bounce"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-green-300 rounded-full border-3 border-charcoal-900 animate-pulse"></div>
            </div>
          </motion.div>

          {/* Right Side - Hero Content (BIGGER & BOLDER) */}
          <motion.div 
            className="text-left order-1 lg:order-2 space-y-8"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Main Headline - MUCH BIGGER */}
            <h1 className="font-display font-black text-6xl lg:text-7xl leading-tight text-charcoal-900"
                style={{
                  textShadow: '5px 5px 0px rgba(255, 255, 255, 0.5)',
                  WebkitTextStroke: '2px #2D2D2D'
                }}>
              Plan Epic Game Nights{' '}
              <span className="text-green-400">Across Any Timezone!</span>{' '}
              <span className="inline-block animate-bounce">🎲</span>
            </h1>

            {/* Subheading - BIGGER */}
            <p className="text-xl lg:text-2xl text-charcoal-800 font-body leading-relaxed max-w-2xl">
              Multiplayer, remote-friendly event coordination for your gaming squad. 
              <span className="font-bold"> No more timezone confusion</span> or scheduling headaches.
            </p>

            {/* CTA Buttons - BIGGER */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={() => navigate('/register')}
                className="bg-white hover:bg-gray-50 text-charcoal-900 font-display font-bold text-lg px-8 py-4 rounded-full border-4 border-charcoal-900 shadow-playful-lg hover:shadow-playful hover:-translate-y-1 transition-all flex items-center gap-2 justify-center"
              >
                <Sparkles className="w-6 h-6" />
                Start Planning
              </button>
              
              <button className="bg-transparent hover:bg-white/20 text-charcoal-900 font-display font-bold text-lg px-8 py-4 rounded-full border-4 border-charcoal-900 transition-all flex items-center gap-2 justify-center">
                <Play className="w-6 h-6" />
                See How It Works
              </button>
            </div>

            {/* Stats - MUCH BIGGER & MORE PROMINENT */}
            <div className="grid grid-cols-3 gap-6 pt-6">
              <div className="text-center">
                <div className="font-display font-black text-4xl text-charcoal-900 mb-1">10,000+</div>
                <div className="font-body text-base text-charcoal-800 font-semibold">Game Nights</div>
              </div>
              <div className="text-center">
                <div className="font-display font-black text-4xl text-green-500 mb-1">95%</div>
                <div className="font-body text-base text-charcoal-800 font-semibold">Attendance Rate</div>
              </div>
              <div className="text-center">
                <div className="font-display font-black text-4xl text-blue-500 mb-1">50+</div>
                <div className="font-body text-base text-charcoal-800 font-semibold">Countries</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
        <ChevronDown className="w-8 h-8 text-charcoal-900" strokeWidth={3} />
      </div>
    </section>
  )
}

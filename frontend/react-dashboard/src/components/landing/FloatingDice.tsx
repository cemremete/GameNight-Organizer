import { motion } from 'framer-motion'

// dice colors matching the reference image
const diceConfigs = [
  { color: 'bg-green-400', dots: 6, top: '10%', right: '5%', delay: 0 },
  { color: 'bg-blue-400', dots: 4, top: '25%', right: '2%', delay: 0.3 },
  { color: 'bg-purple-300', dots: 5, bottom: '30%', right: '8%', delay: 0.6 },
  { color: 'bg-yellow-400', dots: 3, bottom: '15%', right: '3%', delay: 0.9 },
  { color: 'bg-coral-400', dots: 2, bottom: '45%', left: '5%', delay: 0.4 },
  { color: 'bg-white', dots: 1, top: '40%', left: '3%', delay: 0.7 },
]

// this was kinda tricky to get the dots positioned right
function DiceDots({ count }: { count: number }) {
  const dotClass = "w-2 h-2 bg-charcoal-900 rounded-full"
  
  // different layouts for different dot counts
  const layouts: Record<number, JSX.Element> = {
    1: <div className="flex items-center justify-center h-full"><div className={dotClass} /></div>,
    2: (
      <div className="flex flex-col justify-between h-full p-1.5">
        <div className="flex justify-start"><div className={dotClass} /></div>
        <div className="flex justify-end"><div className={dotClass} /></div>
      </div>
    ),
    3: (
      <div className="flex flex-col justify-between h-full p-1.5">
        <div className="flex justify-start"><div className={dotClass} /></div>
        <div className="flex justify-center"><div className={dotClass} /></div>
        <div className="flex justify-end"><div className={dotClass} /></div>
      </div>
    ),
    4: (
      <div className="grid grid-cols-2 gap-1 p-1.5 h-full">
        <div className={dotClass} /><div className={dotClass} />
        <div className={dotClass} /><div className={dotClass} />
      </div>
    ),
    5: (
      <div className="grid grid-cols-3 gap-0.5 p-1 h-full items-center">
        <div className={dotClass} /><div /><div className={dotClass} />
        <div /><div className={dotClass} /><div />
        <div className={dotClass} /><div /><div className={dotClass} />
      </div>
    ),
    6: (
      <div className="grid grid-cols-2 gap-1 p-1.5 h-full">
        <div className={dotClass} /><div className={dotClass} />
        <div className={dotClass} /><div className={dotClass} />
        <div className={dotClass} /><div className={dotClass} />
      </div>
    ),
  }
  
  return layouts[count] || layouts[1]
}

export default function FloatingDice() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {diceConfigs.map((dice, i) => (
        <motion.div
          key={i}
          className={`absolute w-12 h-12 ${dice.color} rounded-lg border-3 border-charcoal-900 shadow-playful`}
          style={{
            top: dice.top,
            right: dice.right,
            bottom: dice.bottom,
            left: dice.left,
            transform: `rotate(${Math.random() * 30 - 15}deg)`
          }}
          animate={{
            y: [0, -15, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 3,
            delay: dice.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <DiceDots count={dice.dots} />
        </motion.div>
      ))}
    </div>
  )
}

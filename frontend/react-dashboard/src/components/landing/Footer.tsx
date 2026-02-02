import { Dice5, Github, Twitter } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-charcoal-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Dice5 size={32} className="text-coral-400" />
            <span className="font-display text-xl font-bold">GameNight</span>
          </div>
          
          <div className="flex gap-8 text-sm">
            <a href="#" className="hover:text-coral-400 transition-colors">About</a>
            <a href="#" className="hover:text-coral-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-coral-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-coral-400 transition-colors">Contact</a>
          </div>
          
          <div className="flex gap-4">
            <a href="#" className="p-2 bg-charcoal-800 rounded-full hover:bg-coral-400 transition-colors">
              <Twitter size={20} />
            </a>
            <a href="#" className="p-2 bg-charcoal-800 rounded-full hover:bg-coral-400 transition-colors">
              <Github size={20} />
            </a>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-charcoal-800 text-center text-sm text-gray-400">
          © 2026 GameNight Organizer. Made with 🎲 for gamers everywhere.
        </div>
      </div>
    </footer>
  )
}

import { NavLink, useNavigate } from 'react-router-dom'
import { Calendar, PlusCircle, BarChart3, Users, Settings, Dice5, LogOut } from 'lucide-react'
import clsx from 'clsx'

const navItems = [
  { icon: Calendar, label: 'My Events', path: '/dashboard' },
  { icon: PlusCircle, label: 'Create Event', path: '/events/create' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Users, label: 'My Squad', path: '/dashboard?tab=squad' },
  { icon: Settings, label: 'Settings', path: '/dashboard?tab=settings' },
]

export default function Sidebar() {
  const navigate = useNavigate()

  return (
    <aside className="w-64 bg-white border-r-3 border-charcoal-900 min-h-screen flex flex-col">
      {/* logo */}
      <div 
        className="p-6 border-b-3 border-charcoal-900 cursor-pointer"
        onClick={() => navigate('/')}
      >
        <div className="flex items-center gap-2">
          <Dice5 size={32} className="text-coral-400" />
          <span className="font-display text-xl font-bold text-charcoal-900">GameNight</span>
        </div>
      </div>

      {/* nav items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => clsx(
                  "flex items-center gap-3 px-4 py-3 rounded-xl font-display font-medium transition-all",
                  isActive 
                    ? "bg-coral-400 text-charcoal-900 border-2 border-charcoal-900 shadow-playful-hover" 
                    : "text-charcoal-700 hover:bg-coral-100"
                )}
              >
                <item.icon size={20} />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* user profile at bottom */}
      <div className="p-4 border-t-3 border-charcoal-900">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-coral-50">
          <div className="w-10 h-10 bg-coral-400 rounded-full border-2 border-charcoal-900 flex items-center justify-center font-bold">
            U
          </div>
          <div className="flex-1">
            <div className="font-display font-bold text-sm">User Name</div>
            <div className="text-xs text-charcoal-700">GMT+0</div>
          </div>
          <button className="p-2 hover:bg-coral-200 rounded-lg transition-colors">
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  )
}

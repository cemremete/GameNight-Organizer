import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Clock, Globe, Users, Calendar, Gamepad2 } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts'
import Sidebar from '../components/dashboard/Sidebar'
import StatCard from '../components/dashboard/StatCard'
import { analyticsApi } from '../lib/api'

export default function Analytics() {
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    analyticsApi.getDashboard()
      .then(response => {
        setAnalyticsData(response)
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
            <p className="text-charcoal-700">Loading analytics...</p>
          </div>
        </main>
      </div>
    )
  }

  if (error || !analyticsData) {
    return (
      <div className="flex min-h-screen bg-coral-50">
        <Sidebar />
        <main className="flex-1 p-8 flex items-center justify-center">
          <div className="bg-red-100 border-2 border-red-400 text-red-700 px-6 py-4 rounded-xl">
            <p className="font-bold mb-2">Error loading analytics</p>
            <p>{error || 'No data available'}</p>
          </div>
        </main>
      </div>
    )
  }

  const { stats, trends, gameTypes, timezones } = analyticsData
  return (
    <div className="flex min-h-screen bg-coral-50">
      <Sidebar />
      
      <main className="flex-1 p-8">
        {/* header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-charcoal-900 mb-2">
            Analytics 📊
          </h1>
          <p className="text-charcoal-700">
            See how your game nights are doing. Data from the last 6 months.
          </p>
        </div>

        {/* top stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<TrendingUp size={24} />}
            label="Success Rate"
            value={stats?.successRate ? `${stats.successRate}%` : "N/A"}
            trend={stats?.successRateTrend ? { value: `${stats.successRateTrend > 0 ? '+' : ''}${stats.successRateTrend}%`, positive: stats.successRateTrend > 0 } : undefined}
            color="bg-green-100"
          />
          <StatCard
            icon={<Calendar size={24} />}
            label="Total Events"
            value={stats?.totalEvents || 0}
            trend={stats?.eventsTrend ? { value: `+${stats.eventsTrend}`, positive: true } : undefined}
            color="bg-coral-100"
          />
          <StatCard
            icon={<Users size={24} />}
            label="Avg Attendance"
            value={stats?.avgAttendance || "0"}
            color="bg-blue-100"
          />
          <StatCard
            icon={<Clock size={24} />}
            label="Avg Response Time"
            value={stats?.avgResponseTime || "N/A"}
            color="bg-yellow-100"
          />
        </div>

        {/* charts grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* event trend chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border-3 border-charcoal-900 p-6 shadow-playful"
          >
            <h2 className="font-display text-xl font-bold mb-4">Event Trends</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trends || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: '2px solid #2D2D2D',
                    boxShadow: '4px 4px 0px 0px rgba(45, 45, 45, 1)'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="events" 
                  stroke="#FF9B9B" 
                  strokeWidth={3}
                  dot={{ fill: '#FF9B9B', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* game types pie chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border-3 border-charcoal-900 p-6 shadow-playful"
          >
            <h2 className="font-display text-xl font-bold mb-4">Game Types</h2>
            <div className="flex items-center">
              <ResponsiveContainer width="60%" height={200}>
                <PieChart>
                  <Pie
                    data={gameTypes || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {(gameTypes || []).map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#2D2D2D" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {(gameTypes || []).map((item: any, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded-full border border-charcoal-900" style={{ backgroundColor: item.color }} />
                    <span>{item.name}</span>
                    <span className="ml-auto font-bold">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* bottom charts */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* response time bar chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border-3 border-charcoal-900 p-6 shadow-playful"
          >
            <h2 className="font-display text-xl font-bold mb-4">Response Time by Player</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={[]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="name" stroke="#6B7280" />
                <YAxis stroke="#6B7280" unit="h" />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: '2px solid #2D2D2D' 
                  }} 
                />
                <Bar dataKey="hours" fill="#60A5FA" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* timezone distribution */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl border-3 border-charcoal-900 p-6 shadow-playful"
          >
            <div className="flex items-center gap-2 mb-4">
              <Globe size={20} />
              <h2 className="font-display text-xl font-bold">Timezone Distribution</h2>
            </div>
            
            <div className="space-y-4">
              {(timezones || []).map((tz: any, i: number) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{tz.zone}</span>
                    <span className="font-bold">{tz.percentage}%</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden border border-charcoal-900">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${tz.percentage}%` }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
                      className="h-full bg-coral-400"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-coral-50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Gamepad2 size={18} />
                <span className="font-display font-bold">Best Time to Play</span>
              </div>
              <p className="text-sm text-charcoal-700">
                Based on your squad's timezones, <strong>Saturday 2:00 PM UTC</strong> works best for everyone.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

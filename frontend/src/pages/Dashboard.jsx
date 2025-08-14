import React from 'react'
import { Ship, Users, MapPin, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Ships',
      value: '24',
      change: '+2',
      changeType: 'positive',
      icon: Ship,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Crew',
      value: '156',
      change: '+12',
      changeType: 'positive',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'Ships at Sea',
      value: '18',
      change: '-1',
      changeType: 'negative',
      icon: MapPin,
      color: 'bg-purple-500'
    },
    {
      title: 'Maintenance Due',
      value: '3',
      change: '+1',
      changeType: 'warning',
      icon: AlertTriangle,
      color: 'bg-yellow-500'
    }
  ]

  const recentShips = [
    {
      id: 1,
      name: 'Ocean Voyager',
      status: 'At Sea',
      location: 'Pacific Ocean',
      eta: '2024-01-15'
    },
    {
      id: 2,
      name: 'Sea Explorer',
      status: 'Docked',
      location: 'Port of Singapore',
      eta: 'N/A'
    },
    {
      id: 3,
      name: 'Maritime Star',
      status: 'Maintenance',
      location: 'Dry Dock',
      eta: '2024-01-20'
    }
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's an overview of your fleet.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center mt-1">
                  <span className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' :
                    stat.changeType === 'negative' ? 'text-red-600' :
                    'text-yellow-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">from last month</span>
                </div>
              </div>
              <div className={`p-3 rounded-full ${stat.color} bg-opacity-10`}>
                <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Ships */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Ships</h3>
          <div className="space-y-4">
            {recentShips.map((ship) => (
              <div key={ship.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{ship.name}</h4>
                  <p className="text-sm text-gray-600">{ship.location}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    ship.status === 'At Sea' ? 'bg-blue-100 text-blue-800' :
                    ship.status === 'Docked' ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {ship.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">ETA: {ship.eta}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full btn-primary">
              Add New Ship
            </button>
            <button className="w-full btn-outline">
              View Fleet Report
            </button>
            <button className="w-full btn-outline">
              Schedule Maintenance
            </button>
            <button className="w-full btn-outline">
              Export Data
            </button>
          </div>
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Fleet Performance</h3>
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Performance charts coming soon</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard 
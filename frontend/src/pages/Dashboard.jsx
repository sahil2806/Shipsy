import React, { useState, useEffect } from 'react'
import { Ship, Users, MapPin, TrendingUp, AlertTriangle, CheckCircle, Plus, FileText, Wrench, Download } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { shipsAPI } from '../services/api'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const { user } = useAuth()
  
  // Fetch fleet statistics
  const { data: fleetStats, isLoading: statsLoading } = useQuery({
    queryKey: ['fleetStats'],
    queryFn: shipsAPI.getFleetStats,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
  
  // Fetch recent ships
  const { data: shipsData, isLoading: shipsLoading } = useQuery({
    queryKey: ['recentShips'],
    queryFn: () => shipsAPI.getAllShips({ page: 1, limit: 5 }),
    staleTime: 2 * 60 * 1000, // 2 minutes
  })
  
  const stats = [
    {
      title: 'Total Ships',
      value: fleetStats?.totalShips || '0',
      change: fleetStats?.changeFromLastMonth ? `+${fleetStats.changeFromLastMonth}` : '0',
      changeType: 'positive',
      icon: Ship,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Crew',
      value: fleetStats?.totalCrew || '0',
      change: fleetStats?.crewChange ? `+${fleetStats.crewChange}` : '0',
      changeType: 'positive',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      title: 'Ships at Sea',
      value: fleetStats?.shipsAtSea || '0',
      change: fleetStats?.seaChange ? `${fleetStats.seaChange > 0 ? '+' : ''}${fleetStats.seaChange}` : '0',
      changeType: fleetStats?.seaChange > 0 ? 'positive' : 'negative',
      icon: MapPin,
      color: 'bg-purple-500'
    },
    {
      title: 'Maintenance Due',
      value: fleetStats?.maintenanceDue || '0',
      change: fleetStats?.maintenanceChange ? `+${fleetStats.maintenanceChange}` : '0',
      changeType: 'warning',
      icon: AlertTriangle,
      color: 'bg-yellow-500'
    }
  ]

  const recentShips = shipsData?.ships || []

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {user?.profile?.firstName || user?.username || 'User'}! Here's an overview of your fleet.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsLoading ? (
          // Loading skeleton
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="card animate-pulse">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="p-3 rounded-full bg-gray-200">
                  <div className="h-6 w-6 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          stats.map((stat, index) => (
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
          ))
        )}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Ships */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Ships</h3>
          <div className="space-y-4">
            {shipsLoading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg animate-pulse">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="text-right space-y-2">
                    <div className="h-5 bg-gray-200 rounded w-16"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
              ))
            ) : recentShips.length > 0 ? (
              recentShips.map((ship) => (
                <div key={ship._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">{ship.name}</h4>
                    <p className="text-sm text-gray-600">{ship.location?.currentPort || 'Unknown'}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      ship.status === 'Active' ? 'bg-blue-100 text-blue-800' :
                      ship.status === 'Docked' ? 'bg-green-100 text-green-800' :
                      ship.status === 'Maintenance' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {ship.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      ETA: {ship.location?.estimatedArrival ? 
                        new Date(ship.location.estimatedArrival).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Ship className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No ships found</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link to="/ships/new" className="w-full btn-primary flex items-center justify-center">
              <Plus className="h-4 w-4 mr-2" />
              Add New Ship
            </Link>
            <Link to="/ships" className="w-full btn-outline flex items-center justify-center">
              <FileText className="h-4 w-4 mr-2" />
              View Fleet Report
            </Link>
            <button className="w-full btn-outline flex items-center justify-center">
              <Wrench className="h-4 w-4 mr-2" />
              Schedule Maintenance
            </button>
            <button className="w-full btn-outline flex items-center justify-center">
              <Download className="h-4 w-4 mr-2" />
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
import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Ship, MapPin, Users, Calendar, Wrench, AlertTriangle } from 'lucide-react'

const ShipDetail = () => {
  const { id } = useParams()

  // Mock ship data - in real app, this would come from API
  const ship = {
    id: id,
    name: 'Ocean Voyager',
    type: 'Container Ship',
    capacity: '5000 TEU',
    status: 'Active',
    location: 'Pacific Ocean',
    coordinates: { latitude: 25.7617, longitude: -80.1918 },
    crew: {
      captain: 'Capt. John Smith',
      totalCrew: 25,
      requiredCrew: 20
    },
    specifications: {
      length: '300m',
      width: '40m',
      height: '25m',
      draft: '15m',
      yearBuilt: 2018,
      flag: 'Panama',
      homePort: 'Rotterdam'
    },
    maintenance: {
      lastMaintenance: '2023-12-01',
      nextMaintenance: '2024-03-01',
      status: 'Up to date'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800'
      case 'Maintenance':
        return 'bg-yellow-100 text-yellow-800'
      case 'Docked':
        return 'bg-blue-100 text-blue-800'
      case 'Out of Service':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link
          to="/ships"
          className="btn-outline"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Ships
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{ship.name}</h1>
          <p className="text-gray-600">{ship.type}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <div className="mt-1">
                  <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(ship.status)}`}>
                    {ship.status}
                  </span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Capacity</label>
                <p className="mt-1 text-gray-900">{ship.capacity}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Flag</label>
                <p className="mt-1 text-gray-900">{ship.specifications.flag}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Home Port</label>
                <p className="mt-1 text-gray-900">{ship.specifications.homePort}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Year Built</label>
                <p className="mt-1 text-gray-900">{ship.specifications.yearBuilt}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Current Location</label>
                <p className="mt-1 text-gray-900">{ship.location}</p>
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Length</label>
                <p className="mt-1 text-gray-900">{ship.specifications.length}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Width</label>
                <p className="mt-1 text-gray-900">{ship.specifications.width}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Height</label>
                <p className="mt-1 text-gray-900">{ship.specifications.height}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Draft</label>
                <p className="mt-1 text-gray-900">{ship.specifications.draft}</p>
              </div>
            </div>
          </div>

          {/* Maintenance */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Maintenance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Last Maintenance</label>
                <p className="mt-1 text-gray-900">{ship.maintenance.lastMaintenance}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Next Maintenance</label>
                <p className="mt-1 text-gray-900">{ship.maintenance.nextMaintenance}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Status</label>
                <p className="mt-1 text-gray-900">{ship.maintenance.status}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Crew Information */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Crew Information</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Captain</p>
                  <p className="text-sm text-gray-600">{ship.crew.captain}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Total Crew</p>
                  <p className="text-sm text-gray-600">{ship.crew.totalCrew}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Required Crew</p>
                  <p className="text-sm text-gray-600">{ship.crew.requiredCrew}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full btn-primary">
                Update Status
              </button>
              <button className="w-full btn-outline">
                Schedule Maintenance
              </button>
              <button className="w-full btn-outline">
                View Route
              </button>
              <button className="w-full btn-outline">
                Export Data
              </button>
            </div>
          </div>

          {/* Alerts */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Alerts</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Maintenance Due</p>
                  <p className="text-xs text-yellow-700">Next maintenance in 2 months</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShipDetail 
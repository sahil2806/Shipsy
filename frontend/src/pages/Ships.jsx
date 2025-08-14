import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus, Filter, Ship, MapPin, Users } from 'lucide-react'

const Ships = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const ships = [
    {
      id: 1,
      name: 'Ocean Voyager',
      type: 'Container Ship',
      capacity: '5000 TEU',
      status: 'Active',
      location: 'Pacific Ocean',
      crew: 25,
      captain: 'Capt. John Smith'
    },
    {
      id: 2,
      name: 'Sea Explorer',
      type: 'Bulk Carrier',
      capacity: '80000 DWT',
      status: 'Maintenance',
      location: 'Port of Singapore',
      crew: 18,
      captain: 'Capt. Maria Garcia'
    },
    {
      id: 3,
      name: 'Maritime Star',
      type: 'Tanker',
      capacity: '120000 DWT',
      status: 'Docked',
      location: 'Port of Rotterdam',
      crew: 22,
      captain: 'Capt. David Wilson'
    },
    {
      id: 4,
      name: 'Pacific Pioneer',
      type: 'Container Ship',
      capacity: '6000 TEU',
      status: 'Active',
      location: 'Atlantic Ocean',
      crew: 28,
      captain: 'Capt. Sarah Johnson'
    }
  ]

  const filteredShips = ships.filter(ship => {
    const matchesSearch = ship.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ship.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ship.captain.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || ship.status === statusFilter
    return matchesSearch && matchesStatus
  })

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fleet Management</h1>
          <p className="text-gray-600 mt-2">Manage and monitor your fleet of vessels</p>
        </div>
        <Link
          to="/ships/new"
          className="btn-primary mt-4 sm:mt-0"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Ship
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search ships by name, type, or captain..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input"
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Docked">Docked</option>
              <option value="Out of Service">Out of Service</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ships Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredShips.map((ship) => (
          <div key={ship.id} className="card hover:shadow-md transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <Ship className="h-6 w-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{ship.name}</h3>
                  <p className="text-sm text-gray-600">{ship.type}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ship.status)}`}>
                {ship.status}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{ship.location}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Users className="h-4 w-4 mr-2" />
                <span>Crew: {ship.crew}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Capacity: </span>
                <span className="font-medium text-gray-900">{ship.capacity}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Captain: </span>
                <span className="font-medium text-gray-900">{ship.captain}</span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <Link
                to={`/ships/${ship.id}`}
                className="btn-outline w-full text-center"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredShips.length === 0 && (
        <div className="text-center py-12">
          <Ship className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No ships found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  )
}

export default Ships 
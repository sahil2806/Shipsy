import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Ship, Save, X, MapPin, Users, Wrench, Info } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { shipsAPI } from '../services/api'
import toast from 'react-hot-toast'

const NewShip = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    type: 'Container Ship',
    capacity: '',
    status: 'Active',
    specifications: {
      length: '',
      width: '',
      height: '',
      draft: '',
      yearBuilt: new Date().getFullYear(),
      flag: '',
      homePort: ''
    },
    crew: {
      captain: '',
      totalCrew: '',
      requiredCrew: ''
    },
    location: {
      currentPort: '',
      nextPort: '',
      estimatedArrival: ''
    },
    maintenance: {
      lastMaintenance: '',
      nextMaintenance: ''
    }
  })

  const shipTypes = [
    'Container Ship',
    'Bulk Carrier',
    'Tanker',
    'Passenger Ship',
    'Fishing Vessel',
    'Other'
  ]

  const statusOptions = [
    'Active',
    'Maintenance',
    'Docked',
    'Out of Service'
  ]

  const handleChange = (e, section = null, subsection = null) => {
    const { name, value } = e.target
    
    if (section && subsection) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [subsection]: value
        }
      }))
    } else if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Clean up the data
      const cleanData = {
        ...formData,
        specifications: {
          ...formData.specifications,
          length: formData.specifications.length ? Number(formData.specifications.length) : undefined,
          width: formData.specifications.width ? Number(formData.specifications.width) : undefined,
          height: formData.specifications.height ? Number(formData.specifications.height) : undefined,
          draft: formData.specifications.draft ? Number(formData.specifications.draft) : undefined,
          yearBuilt: Number(formData.specifications.yearBuilt)
        },
        crew: {
          ...formData.crew,
          totalCrew: Number(formData.crew.totalCrew),
          requiredCrew: Number(formData.crew.requiredCrew)
        },
        location: {
          ...formData.location,
          estimatedArrival: formData.location.estimatedArrival ? new Date(formData.location.estimatedArrival) : undefined
        },
        maintenance: {
          ...formData.maintenance,
          lastMaintenance: formData.maintenance.lastMaintenance ? new Date(formData.maintenance.lastMaintenance) : undefined,
          nextMaintenance: formData.maintenance.nextMaintenance ? new Date(formData.maintenance.nextMaintenance) : undefined
        }
      }

      // Remove undefined values
      Object.keys(cleanData).forEach(key => {
        if (cleanData[key] && typeof cleanData[key] === 'object') {
          Object.keys(cleanData[key]).forEach(subKey => {
            if (cleanData[key][subKey] === undefined) {
              delete cleanData[key][subKey]
            }
          })
        }
      })

      await shipsAPI.createShip(cleanData)
      
      toast.success('Ship created successfully!')
      queryClient.invalidateQueries(['ships'])
      navigate('/ships')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create ship')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Ship</h1>
          <p className="text-gray-600 mt-2">Register a new vessel to your fleet</p>
        </div>
        <button
          onClick={() => navigate('/ships')}
          className="btn-outline"
        >
          <X className="h-5 w-5 mr-2" />
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Info className="h-6 w-6 text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ship Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="input"
                placeholder="Enter ship name"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ship Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="input"
                disabled={loading}
              >
                {shipTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Capacity *
              </label>
              <input
                type="text"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                required
                className="input"
                placeholder="e.g., 5000 TEU, 80000 DWT"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="input"
                disabled={loading}
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Ship className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Specifications</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Length (m)
              </label>
              <input
                type="number"
                name="length"
                value={formData.specifications.length}
                onChange={(e) => handleChange(e, 'specifications', 'length')}
                className="input"
                placeholder="300"
                min="0"
                step="0.1"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Width (m)
              </label>
              <input
                type="number"
                name="width"
                value={formData.specifications.width}
                onChange={(e) => handleChange(e, 'specifications', 'width')}
                className="input"
                placeholder="40"
                min="0"
                step="0.1"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Height (m)
              </label>
              <input
                type="number"
                name="height"
                value={formData.specifications.height}
                onChange={(e) => handleChange(e, 'specifications', 'height')}
                className="input"
                placeholder="25"
                min="0"
                step="0.1"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Draft (m)
              </label>
              <input
                type="number"
                name="draft"
                value={formData.specifications.draft}
                onChange={(e) => handleChange(e, 'specifications', 'draft')}
                className="input"
                placeholder="15"
                min="0"
                step="0.1"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Year Built
              </label>
              <input
                type="number"
                name="yearBuilt"
                value={formData.specifications.yearBuilt}
                onChange={(e) => handleChange(e, 'specifications', 'yearBuilt')}
                className="input"
                min="1900"
                max={new Date().getFullYear()}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Flag
              </label>
              <input
                type="text"
                name="flag"
                value={formData.specifications.flag}
                onChange={(e) => handleChange(e, 'specifications', 'flag')}
                className="input"
                placeholder="Panama"
                disabled={loading}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Home Port
              </label>
              <input
                type="text"
                name="homePort"
                value={formData.specifications.homePort}
                onChange={(e) => handleChange(e, 'specifications', 'homePort')}
                className="input"
                placeholder="Rotterdam"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Crew Information */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Crew Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Captain
              </label>
              <input
                type="text"
                name="captain"
                value={formData.crew.captain}
                onChange={(e) => handleChange(e, 'crew', 'captain')}
                className="input"
                placeholder="Capt. John Smith"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Crew *
              </label>
              <input
                type="number"
                name="totalCrew"
                value={formData.crew.totalCrew}
                onChange={(e) => handleChange(e, 'crew', 'totalCrew')}
                required
                className="input"
                placeholder="25"
                min="1"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Required Crew *
              </label>
              <input
                type="number"
                name="requiredCrew"
                value={formData.crew.requiredCrew}
                onChange={(e) => handleChange(e, 'crew', 'requiredCrew')}
                required
                className="input"
                placeholder="20"
                min="1"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <MapPin className="h-6 w-6 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Location</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Port
              </label>
              <input
                type="text"
                name="currentPort"
                value={formData.location.currentPort}
                onChange={(e) => handleChange(e, 'location', 'currentPort')}
                className="input"
                placeholder="Pacific Ocean"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Next Port
              </label>
              <input
                type="text"
                name="nextPort"
                value={formData.location.nextPort}
                onChange={(e) => handleChange(e, 'location', 'nextPort')}
                className="input"
                placeholder="Port of Los Angeles"
                disabled={loading}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Arrival
              </label>
              <input
                type="datetime-local"
                name="estimatedArrival"
                value={formData.location.estimatedArrival}
                onChange={(e) => handleChange(e, 'location', 'estimatedArrival')}
                className="input"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Maintenance */}
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Wrench className="h-6 w-6 text-yellow-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Maintenance</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Maintenance
              </label>
              <input
                type="date"
                name="lastMaintenance"
                value={formData.maintenance.lastMaintenance}
                onChange={(e) => handleChange(e, 'maintenance', 'lastMaintenance')}
                className="input"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Next Maintenance
              </label>
              <input
                type="date"
                name="nextMaintenance"
                value={formData.maintenance.nextMaintenance}
                onChange={(e) => handleChange(e, 'maintenance', 'nextMaintenance')}
                className="input"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/ships')}
            className="btn-outline"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Ship...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-2" />
                Create Ship
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewShip

import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Ship, MapPin, Users, Calendar, Wrench, AlertTriangle, Edit, Trash2, Eye, TrendingUp } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { shipsAPI } from '../services/api'
import toast from 'react-hot-toast'

const ShipDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Fetch ship data
  const { data: ship, isLoading, error } = useQuery({
    queryKey: ['ship', id],
    queryFn: () => shipsAPI.getShipById(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })

  // Delete ship mutation
  const deleteMutation = useMutation({
    mutationFn: () => shipsAPI.deleteShip(id),
    onSuccess: () => {
      toast.success('Ship deleted successfully')
      queryClient.invalidateQueries(['ships'])
      navigate('/ships')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete ship')
    }
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

  const getEfficiencyColor = (efficiency) => {
    if (efficiency >= 80) return 'text-green-600'
    if (efficiency >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleDelete = () => {
    deleteMutation.mutate()
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card">
                  <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <div key={j} className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-20"></div>
                        <div className="h-4 bg-gray-200 rounded w-32"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card">
                  <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                  <div className="space-y-3">
                    {Array.from({ length: 3 }).map((_, j) => (
                      <div key={j} className="h-4 bg-gray-200 rounded w-full"></div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading ship</h3>
        <p className="text-gray-600 mb-4">Failed to load ship details</p>
        <Link to="/ships" className="btn-primary">
          Back to Ships
        </Link>
      </div>
    )
  }

  if (!ship) {
    return (
      <div className="text-center py-12">
        <Ship className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Ship not found</h3>
        <p className="text-gray-600 mb-4">The ship you're looking for doesn't exist</p>
        <Link to="/ships" className="btn-primary">
          Back to Ships
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
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
        
        <div className="flex items-center space-x-3">
          <Link
            to={`/ships/${id}/edit`}
            className="btn-outline"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Link>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="btn-outline text-red-600 border-red-300 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
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
                <p className="mt-1 text-gray-900">{ship.specifications?.flag || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Home Port</label>
                <p className="mt-1 text-gray-900">{ship.specifications?.homePort || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Year Built</label>
                <p className="mt-1 text-gray-900">{ship.specifications?.yearBuilt || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Current Location</label>
                <p className="mt-1 text-gray-900">{ship.location?.currentPort || 'Unknown'}</p>
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Length</label>
                <p className="mt-1 text-gray-900">{ship.specifications?.length ? `${ship.specifications.length}m` : 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Width</label>
                <p className="mt-1 text-gray-900">{ship.specifications?.width ? `${ship.specifications.width}m` : 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Height</label>
                <p className="mt-1 text-gray-900">{ship.specifications?.height ? `${ship.specifications.height}m` : 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Draft</label>
                <p className="mt-1 text-gray-900">{ship.specifications?.draft ? `${ship.specifications.draft}m` : 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Performance Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Efficiency</label>
                <div className="mt-1 flex items-center space-x-2">
                  <span className={`text-lg font-bold ${getEfficiencyColor(ship.efficiency)}`}>
                    {ship.efficiency}%
                  </span>
                  <TrendingUp className="h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Operational Days</label>
                <p className="mt-1 text-gray-900">{ship.operationalDays || 0} days</p>
              </div>
            </div>
          </div>

          {/* Maintenance */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Maintenance</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Last Maintenance</label>
                <p className="mt-1 text-gray-900">{formatDate(ship.maintenance?.lastMaintenance)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Next Maintenance</label>
                <p className="mt-1 text-gray-900">{formatDate(ship.maintenance?.nextMaintenance)}</p>
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Location Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Current Port</label>
                <p className="mt-1 text-gray-900">{ship.location?.currentPort || 'Unknown'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Next Port</label>
                <p className="mt-1 text-gray-900">{ship.location?.nextPort || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Estimated Arrival</label>
                <p className="mt-1 text-gray-900">{formatDate(ship.location?.estimatedArrival)}</p>
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
                  <p className="text-sm text-gray-600">{ship.crew?.captain || 'N/A'}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Total Crew</p>
                  <p className="text-sm text-gray-600">{ship.crew?.totalCrew || 0}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Required Crew</p>
                  <p className="text-sm text-gray-600">{ship.crew?.requiredCrew || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to={`/ships/${id}/edit`}
                className="w-full btn-primary flex items-center justify-center"
              >
                <Edit className="h-4 w-4 mr-2" />
                Update Status
              </Link>
              <button className="w-full btn-outline flex items-center justify-center">
                <Wrench className="h-4 w-4 mr-2" />
                Schedule Maintenance
              </button>
              <button className="w-full btn-outline flex items-center justify-center">
                <Eye className="h-4 w-4 mr-2" />
                View Route
              </button>
              <button className="w-full btn-outline flex items-center justify-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                Export Data
              </button>
            </div>
          </div>

          {/* Alerts */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Alerts</h3>
            <div className="space-y-3">
              {ship.efficiency < 60 && (
                <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Low Efficiency</p>
                    <p className="text-xs text-red-700">Efficiency is below 60%</p>
                  </div>
                </div>
              )}
              
              {ship.maintenance?.nextMaintenance && new Date(ship.maintenance.nextMaintenance) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && (
                <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Maintenance Due</p>
                    <p className="text-xs text-yellow-700">Next maintenance in less than 30 days</p>
                  </div>
                </div>
              )}

              {ship.crew?.totalCrew < ship.crew?.requiredCrew && (
                <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium text-orange-800">Crew Shortage</p>
                    <p className="text-xs text-orange-700">Current crew below required level</p>
                  </div>
                </div>
              )}

              {!ship.efficiency && !ship.maintenance?.nextMaintenance && ship.crew?.totalCrew >= ship.crew?.requiredCrew && (
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="h-5 w-5 bg-green-600 rounded-full flex items-center justify-center">
                    <div className="h-2 w-2 bg-white rounded-full"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-800">All Systems Normal</p>
                    <p className="text-xs text-green-700">Ship is operating optimally</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Ship</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{ship.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn-outline"
                disabled={deleteMutation.isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isLoading}
                className="btn-primary bg-red-600 hover:bg-red-700 border-red-600"
              >
                {deleteMutation.isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Ship
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ShipDetail 
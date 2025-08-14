import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Plus, Filter, Ship, MapPin, Users, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { shipsAPI } from '../services/api'
import toast from 'react-hot-toast'

const Ships = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(9)
  const [filtersApplied, setFiltersApplied] = useState(false)

  // Build query parameters
  const queryParams = {
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    type: typeFilter !== 'all' ? typeFilter : undefined,
    sortBy,
    sortOrder
  }

  // Only apply filters if they have been explicitly applied
  if (!filtersApplied) {
    delete queryParams.status
    delete queryParams.type
  }

  // Remove undefined values and log for debugging
  const cleanParams = {}
  Object.keys(queryParams).forEach(key => {
    if (queryParams[key] !== undefined && queryParams[key] !== null && queryParams[key] !== '') {
      cleanParams[key] = queryParams[key]
    }
  })

  // Debug logging
  console.log('🔍 Ships query params:', cleanParams)
  console.log('🔍 Current filters:', { statusFilter, typeFilter, searchTerm, filtersApplied })

  // Fetch ships data
  const { data: shipsData, isLoading, error, refetch } = useQuery({
    queryKey: ['ships', cleanParams],
    queryFn: async () => {
      console.log('🌐 Making API call with params:', cleanParams)
      const response = await shipsAPI.getAllShips(cleanParams)
      console.log('🌐 API call result data:', response.data)
      return response.data
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    keepPreviousData: true
  })

  const ships = shipsData?.ships || []
  const totalShips = shipsData?.pagination?.totalItems || 0
  const totalPages = Math.ceil(totalShips / itemsPerPage)

  // Debug logging for API response
  console.log('📡 API Response:', shipsData)
  console.log('🚢 Ships array:', ships)
  console.log('📊 Total ships:', totalShips)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter, typeFilter, sortBy, sortOrder])

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setFiltersApplied(false) // Reset filter status when search changes
      refetch()
    }, 500)

    return () => clearTimeout(timer)
  }, [searchTerm, refetch])

  // Force refetch when filters are applied
  useEffect(() => {
    if (filtersApplied) {
      console.log('🔄 Filters applied, refetching data...')
      refetch()
    }
  }, [filtersApplied, refetch])

  // Remove automatic filter application - now filters only apply when button is clicked
  // useEffect(() => {
  //   refetch()
  // }, [statusFilter, typeFilter, sortBy, sortOrder, refetch])

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

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleApplyFilters = () => {
    console.log('🚀 Applying filters:', { statusFilter, typeFilter, searchTerm })
    setCurrentPage(1)
    setFiltersApplied(true)
    // Force a refetch with current filter values
    setTimeout(() => {
      refetch()
    }, 100)
  }

  if (error) {
    toast.error('Failed to load ships')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fleet Management</h1>
          <p className="text-gray-600 mt-2">
            Manage and monitor your fleet of vessels ({totalShips} ships)
          </p>
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
        <div className="mb-4 p-2 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2 text-blue-800">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filter Instructions:</span>
            <span className="text-sm">Set your filters below and click "Apply Filters" to see results. Search works automatically.</span>
          </div>
        </div>
        
        {isLoading && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2 text-blue-800">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-sm">Applying filters...</span>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
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
            <Filter className={`h-5 w-5 ${statusFilter !== 'all' ? 'text-green-600' : 'text-gray-400'}`} />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setFiltersApplied(false) // Reset applied status when filter changes
              }}
              className={`input ${statusFilter !== 'all' ? 'border-green-500 bg-green-50' : ''}`}
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Docked">Docked</option>
              <option value="Out of Service">Out of Service</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Filter className={`h-5 w-5 ${typeFilter !== 'all' ? 'text-purple-600' : 'text-gray-400'}`} />
            <select
              value={typeFilter}
              onChange={(e) => {
                setTypeFilter(e.target.value)
                setFiltersApplied(false) // Reset applied status when filter changes
              }}
              className={`input ${typeFilter !== 'all' ? 'border-purple-500 bg-purple-50' : ''}`}
            >
              <option value="all">All Types</option>
              <option value="Container Ship">Container Ship</option>
              <option value="Bulk Carrier">Bulk Carrier</option>
              <option value="Tanker">Tanker</option>
              <option value="Passenger Ship">Passenger Ship</option>
              <option value="Fishing Vessel">Fishing Vessel</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex items-center">
            <button
              onClick={handleApplyFilters}
              className={`w-full py-2 px-4 flex items-center justify-center space-x-2 ${
                filtersApplied 
                  ? 'btn-outline text-green-600 border-green-300' 
                  : 'btn-primary'
              }`}
            >
              <Filter className="h-4 w-4" />
              <span>{filtersApplied ? 'Filters Applied' : 'Apply Filters'}</span>
            </button>
          </div>
        </div>

        {/* Filter Status Display */}
        {(searchTerm || statusFilter !== 'all' || typeFilter !== 'all') && (
          <div className={`mt-4 p-3 rounded-lg ${
            filtersApplied 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm">
                <span className={`font-medium ${
                  filtersApplied ? 'text-green-800' : 'text-yellow-800'
                }`}>
                  {filtersApplied ? '✅ Filters Applied:' : '⚠️ Filters Pending:'}
                </span>
                {searchTerm && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                    Search: "{searchTerm}"
                  </span>
                )}
                {statusFilter !== 'all' && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                    Status: {statusFilter}
                  </span>
                )}
                {typeFilter !== 'all' && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                    Type: {typeFilter}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setSearchTerm('')
                    setStatusFilter('all')
                    setTypeFilter('all')
                    setCurrentPage(1)
                    setFiltersApplied(false)
                  }}
                  className="text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Reset Filters
                </button>
                                 {!filtersApplied && (
                   <button
                     onClick={handleApplyFilters}
                     className="btn-primary text-sm py-1 px-3"
                   >
                     Apply Now
                   </button>
                 )}
              </div>
            </div>
          </div>
        )}

        {/* Sorting and Pagination Controls */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input text-sm"
              >
                <option value="name">Name</option>
                <option value="type">Type</option>
                <option value="status">Status</option>
                <option value="efficiency">Efficiency</option>
                <option value="createdAt">Date Added</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="p-1 hover:bg-gray-100 rounded"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="input text-sm"
              >
                <option value={6}>6</option>
                <option value={9}>9</option>
                <option value={12}>12</option>
              </select>
              <span className="text-sm text-gray-600">per page</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ships Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: itemsPerPage }).map((_, index) => (
            <div key={index} className="card animate-pulse">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-200 rounded-lg">
                    <div className="h-6 w-6 bg-gray-300 rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
                <div className="h-6 w-16 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-3 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ships.map((ship) => (
              <div key={ship._id} className="card hover:shadow-md transition-shadow duration-200">
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
                    <span>{ship.location?.currentPort || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="h-4 w-4 mr-2" />
                    <span>Crew: {ship.crew?.totalCrew || 0}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Capacity: </span>
                    <span className="font-medium text-gray-900">{ship.capacity}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Captain: </span>
                    <span className="font-medium text-gray-900">{ship.crew?.captain || 'N/A'}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Efficiency: </span>
                    <span className={`font-medium ${
                      ship.efficiency >= 80 ? 'text-green-600' :
                      ship.efficiency >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {ship.efficiency}%
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Link
                    to={`/ships/${ship._id}`}
                    className="btn-outline w-full text-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalShips)} of {totalShips} results
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="btn-outline px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        currentPage === pageNum
                          ? 'bg-primary-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="btn-outline px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {ships.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <Ship className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No ships found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default Ships 
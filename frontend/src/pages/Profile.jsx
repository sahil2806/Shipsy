import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { usersAPI } from '../services/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { User, Mail, Phone, MapPin, Lock, Save, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user, updateUser } = useAuth()
  const queryClient = useQueryClient()
  
  const [activeTab, setActiveTab] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    profile: {
      firstName: user?.profile?.firstName || '',
      lastName: user?.profile?.lastName || '',
      phone: user?.profile?.phone || '',
      address: user?.profile?.address || ''
    }
  })
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: usersAPI.updateProfile,
    onSuccess: (response) => {
      toast.success('Profile updated successfully!')
      updateUser(response.data.user)
      queryClient.invalidateQueries(['user'])
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    }
  })

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: usersAPI.changePassword,
    onSuccess: () => {
      toast.success('Password changed successfully!')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to change password')
    }
  })

  const handleProfileChange = (e, section = null) => {
    const { name, value } = e.target
    
    if (section) {
      setProfileData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: value
        }
      }))
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    updateProfileMutation.mutate(profileData)
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long')
      return
    }
    
    changePasswordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
        <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'profile'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'password'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Change Password
          </button>
        </nav>
      </div>

      {/* Profile Information Tab */}
      {activeTab === 'profile' && (
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-primary-100 rounded-lg">
              <User className="h-6 w-6 text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  name="username"
                  value={profileData.username}
                  onChange={handleProfileChange}
                  required
                  className="input"
                  placeholder="Enter username"
                  disabled={updateProfileMutation.isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900">{user?.email}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={profileData.profile.firstName}
                  onChange={(e) => handleProfileChange(e, 'profile')}
                  className="input"
                  placeholder="Enter first name"
                  disabled={updateProfileMutation.isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={profileData.profile.lastName}
                  onChange={(e) => handleProfileChange(e, 'profile')}
                  className="input"
                  placeholder="Enter last name"
                  disabled={updateProfileMutation.isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={profileData.profile.phone}
                    onChange={(e) => handleProfileChange(e, 'profile')}
                    className="input pl-10"
                    placeholder="Enter phone number"
                    disabled={updateProfileMutation.isLoading}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="address"
                    value={profileData.profile.address}
                    onChange={(e) => handleProfileChange(e, 'profile')}
                    className="input pl-10"
                    placeholder="Enter address"
                    disabled={updateProfileMutation.isLoading}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={updateProfileMutation.isLoading}
                className="btn-primary"
              >
                {updateProfileMutation.isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Update Profile
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Change Password Tab */}
      {activeTab === 'password' && (
        <div className="card">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Lock className="h-6 w-6 text-yellow-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    className="input pl-10 pr-10"
                    placeholder="Enter current password"
                    disabled={changePasswordMutation.isLoading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={changePasswordMutation.isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    className="input pl-10 pr-10"
                    placeholder="Enter new password"
                    disabled={changePasswordMutation.isLoading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    disabled={changePasswordMutation.isLoading}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    className="input pl-10 pr-10"
                    placeholder="Confirm new password"
                    disabled={changePasswordMutation.isLoading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={changePasswordMutation.isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Lock className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Password Requirements</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>At least 6 characters long</li>
                      <li>Should be different from your current password</li>
                      <li>Consider using a mix of letters, numbers, and symbols</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={changePasswordMutation.isLoading}
                className="btn-primary"
              >
                {changePasswordMutation.isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Changing Password...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Change Password
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Account Information */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">User ID</label>
            <p className="mt-1 text-gray-900 font-mono text-sm">{user?._id}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Role</label>
            <p className="mt-1 text-gray-900 capitalize">{user?.role}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Account Status</label>
            <p className="mt-1 text-gray-900">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                user?.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {user?.isActive ? 'Active' : 'Inactive'}
              </span>
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Member Since</label>
            <p className="mt-1 text-gray-900">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile

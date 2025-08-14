import React from 'react'
import { Link } from 'react-router-dom'
import { Ship, MapPin, Users, BarChart3, ArrowRight } from 'lucide-react'

const Home = () => {
  const features = [
    {
      icon: Ship,
      title: 'Ship Management',
      description: 'Comprehensive tracking and management of your entire fleet of vessels.'
    },
    {
      icon: MapPin,
      title: 'Real-time Tracking',
      description: 'Monitor ship locations and routes with live GPS tracking and updates.'
    },
    {
      icon: Users,
      title: 'Crew Management',
      description: 'Manage crew assignments, schedules, and certifications efficiently.'
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      description: 'Get detailed insights into fleet performance and operational metrics.'
    }
  ]

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Modern Shipping
            <span className="text-primary-600"> Management</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Streamline your maritime operations with our comprehensive shipping management platform. 
            Track vessels, manage crew, and optimize your fleet performance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="btn-primary text-lg px-8 py-3"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/ships"
              className="btn-outline text-lg px-8 py-3"
            >
              View Ships
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need to manage your fleet
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform provides all the tools and insights you need to operate your shipping business efficiently.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <feature.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-16 rounded-2xl">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to transform your shipping operations?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join hundreds of shipping companies already using Shipsy to manage their fleets.
          </p>
          <Link
            to="/register"
            className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold text-lg transition-colors duration-200"
          >
            Start Free Trial
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home 
import { useState } from 'react'
import { AuthProvider, useAuth } from './hooks/useAuth.jsx'
import { AuthModal } from './components/auth/AuthModal'
import { UserMenu } from './components/UserMenu'
import { Button } from './components/ui/button'
import { finalRogersListings, finalListingStats } from './data/final_rogers_listings_with_images'
import './App.css'

function AppContent() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')

  const { isAuthenticated, loading } = useAuth()

  // Filter listings based on search and category
  const filteredListings = finalRogersListings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || listing.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Get categories with counts
  const categories = [
    { name: 'All', count: finalListingStats.totalItems },
    ...Object.entries(finalListingStats.categories).map(([name, count]) => ({ name, count }))
  ]

  const openAuthModal = (mode = 'login') => {
    setAuthMode(mode)
    setAuthModalOpen(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-black shadow-sm border-b border-yellow-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img 
                src="/poundtrades-logo.png" 
                alt="PoundTrades Logo"
                className="h-10 w-auto mr-2"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-yellow-400">
                {finalListingStats.totalItems} items • £{finalListingStats.totalValue} total value
              </div>
              
              {!loading && (
                isAuthenticated ? (
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                    >
                      Add Listing
                    </Button>
                    <UserMenu />
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-yellow-400 hover:bg-yellow-400 hover:text-black"
                      onClick={() => openAuthModal('login')}
                    >
                      Sign In
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black"
                      onClick={() => openAuthModal('signup')}
                    >
                      Sign Up
                    </Button>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Find Quality Construction Materials for <span className="text-yellow-500">Cash</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Browse {finalListingStats.totalItems} items from trusted sellers across the UK
          </p>
          
          {!isAuthenticated && (
            <div className="flex justify-center space-x-4 mb-8">
              <Button 
                size="lg"
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                onClick={() => openAuthModal('signup')}
              >
                Start Selling Today
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => openAuthModal('login')}
              >
                Browse Listings
              </Button>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <input
              type="text"
              placeholder="Search listings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            >
              {categories.map(category => (
                <option key={category.name} value={category.name}>
                  {category.name} ({category.count})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
          <p className="text-gray-600">
            Showing {filteredListings.length} of {finalListingStats.totalItems} listings
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>

        {/* Listings Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings.map(listing => (
              <div key={listing.id} className="bg-white rounded-lg shadow-md border overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  <img 
                    src={listing.image} 
                    alt={listing.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='
                    }}
                  />
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      {listing.title}
                    </h3>
                    <span className="text-lg font-bold text-green-600 ml-2">
                      £{listing.price}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {listing.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {listing.category}
                    </span>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        if (!isAuthenticated) {
                          openAuthModal('login')
                        } else {
                          // Handle view listing
                          console.log('View listing:', listing.id)
                        }
                      }}
                    >
                      {isAuthenticated ? 'View Details' : 'Sign in to View'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <img 
                src="/poundtrades-logo.png" 
                alt="PoundTrades Logo"
                className="h-8 w-auto mb-4"
              />
              <p className="text-gray-400 text-sm">
                The UK's leading marketplace for construction materials and trade supplies.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">For Buyers</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Browse Listings</a></li>
                <li><a href="#" className="hover:text-white">Search by Location</a></li>
                <li><a href="#" className="hover:text-white">Saved Items</a></li>
                <li><a href="#" className="hover:text-white">Buyer Protection</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">For Sellers</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Add Listing</a></li>
                <li><a href="#" className="hover:text-white">Seller Dashboard</a></li>
                <li><a href="#" className="hover:text-white">Pricing Guide</a></li>
                <li><a href="#" className="hover:text-white">Seller Tips</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 PoundTrades. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App


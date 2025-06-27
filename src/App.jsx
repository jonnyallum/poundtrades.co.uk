import { useState } from 'react'
import { actualRogersListings, actualListingStats } from './data/actual_rogers_listings.js'
import './App.css'

// Simple Card Component
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-md border ${className}`}>
    {children}
  </div>
)

const CardHeader = ({ children }) => (
  <div className="p-4 border-b">
    {children}
  </div>
)

const CardContent = ({ children }) => (
  <div className="p-4">
    {children}
  </div>
)

const CardFooter = ({ children }) => (
  <div className="p-4 border-t">
    {children}
  </div>
)

const CardTitle = ({ children }) => (
  <h3 className="text-lg font-semibold">
    {children}
  </h3>
)

const CardDescription = ({ children }) => (
  <p className="text-gray-600 text-sm">
    {children}
  </p>
)

// Simple Badge Component
const Badge = ({ children, className = "" }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 ${className}`}>
    {children}
  </span>
)

// Listing Card Component
const ListingCard = ({ listing }) => (
  <Card className="hover:shadow-lg transition-shadow">
    <CardHeader>
      <div className="aspect-square bg-gray-100 rounded-md mb-3 overflow-hidden">
        <img 
          src={listing.image} 
          alt={listing.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='
          }}
        />
      </div>
      <CardTitle>{listing.title}</CardTitle>
      <CardDescription>{listing.description}</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex justify-between items-center">
        <span className="text-2xl font-bold text-green-600">£{listing.price}</span>
        <Badge>{listing.category}</Badge>
      </div>
      <div className="mt-2 text-sm text-gray-500">
        <p>📍 {listing.location}</p>
        <p>👤 {listing.seller}</p>
        <p>✨ {listing.condition}</p>
      </div>
    </CardContent>
    <CardFooter>
      <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-md transition-colors">
        View Details
      </button>
    </CardFooter>
  </Card>
)

// Main App Component
function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Filter listings based on search and category
  const filteredListings = actualRogersListings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || listing.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ['All', ...Object.keys(actualListingStats.categories)]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img 
                src="/poundtrades-logo.png" 
                alt="PoundTrades Logo" 
                className="h-10 w-auto mr-2"
              />
            </div>
            <div className="text-sm text-gray-600">
              {actualListingStats.totalItems} items • £{actualListingStats.totalValue} total value
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Find Quality Construction Materials for <span className="text-yellow-500">Cash</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Browse {actualListingStats.totalItems} items from trusted sellers across the UK
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
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
                <option key={category} value={category}>
                  {category} {category !== 'All' ? `(${actualListingStats.categories[category]})` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredListings.length} of {actualListingStats.totalItems} listings
            {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredListings.map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>

        {/* No Results */}
        {filteredListings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No listings found matching your criteria.</p>
            <button 
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('All')
              }}
              className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">
              <span className="text-yellow-500">£</span>Trades
            </h3>
            <p className="text-gray-400">
              UK's Premier Construction Materials Marketplace
            </p>
            <p className="text-gray-400 mt-2">
              All listings from Roger Holman, Edinburgh
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App


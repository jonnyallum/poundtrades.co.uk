import { useState } from 'react'
import { finalRogersListings, finalListingStats } from './data/final_rogers_listings_with_images'
import './App.css'

function App() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

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
            <div className="text-sm text-yellow-400">
              {finalListingStats.totalItems} items • £{finalListingStats.totalValue} total value
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
              <div key={listing.id} className="bg-white rounded-lg shadow-md border overflow-hidden">
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
                  {listing.featured && (
                    <span className="inline-block bg-yellow-400 text-black text-xs font-semibold px-2 py-1 rounded mb-2">
                      Featured
                    </span>
                  )}
                  <h3 className="font-semibold text-lg mb-2">{listing.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{listing.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-yellow-600">£{listing.price}</span>
                    <span className="text-sm text-gray-500">{listing.location}</span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Seller: {listing.seller} • {listing.condition}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App


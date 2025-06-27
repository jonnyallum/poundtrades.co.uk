import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Search, MapPin, User, Plus, Heart, ShoppingCart, Menu, X } from 'lucide-react'
import Map from './components/Map.jsx'
import { listings, categories, getFeaturedListings, getListingsByCategory, getTotalValue } from './data/listings.js'
import './App.css'

// Import PoundTrades logo
import poundtradesLogo from './assets/1000013748.png'

// Mock user authentication
const useAuth = () => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const login = async (email, password) => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      if (email === 'roger@poundtrades.co.uk') {
        setUser({ 
          id: 1, 
          name: 'Roger Holman', 
          email: 'roger@poundtrades.co.uk', 
          isAdmin: true,
          avatar: 'RH'
        })
      } else {
        setUser({ 
          id: 2, 
          name: 'Demo User', 
          email: email, 
          isAdmin: false,
          avatar: email.charAt(0).toUpperCase()
        })
      }
      setIsLoading(false)
    }, 1000)
  }

  const logout = () => {
    setUser(null)
  }

  return { user, login, logout, isLoading }
}

// Header Component
const Header = ({ user, onLogin, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-black text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img src={poundtradesLogo} alt="PoundTrades" className="h-10 w-10 rounded" />
            <span className="text-2xl font-bold text-yellow-400">PoundTrades</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-yellow-400 transition-colors">Home</Link>
            <Link to="/listings" className="hover:text-yellow-400 transition-colors">Browse</Link>
            <Link to="/categories" className="hover:text-yellow-400 transition-colors">Categories</Link>
            {user && (
              <Link to="/create" className="hover:text-yellow-400 transition-colors">
                <Plus className="h-4 w-4 inline mr-1" />
                Sell
              </Link>
            )}
          </nav>

          {/* User Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-yellow-400 text-black rounded-full flex items-center justify-center font-bold">
                    {user.avatar}
                  </div>
                  <span className="text-sm">{user.name}</span>
                  {user.isAdmin && <Badge variant="secondary">Admin</Badge>}
                </div>
                <Button variant="outline" size="sm" onClick={onLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <Button onClick={onLogin} className="bg-yellow-400 text-black hover:bg-yellow-400">
                Login
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-700">
            <nav className="flex flex-col space-y-2 mt-4">
              <Link to="/" className="hover:text-yellow-400 transition-colors">Home</Link>
              <Link to="/listings" className="hover:text-yellow-400 transition-colors">Browse</Link>
              <Link to="/categories" className="hover:text-yellow-400 transition-colors">Categories</Link>
              {user && (
                <Link to="/create" className="hover:text-yellow-400 transition-colors">
                  <Plus className="h-4 w-4 inline mr-1" />
                  Sell
                </Link>
              )}
              {user ? (
                <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-yellow-400 text-black rounded-full flex items-center justify-center font-bold">
                      {user.avatar}
                    </div>
                    <span className="text-sm">{user.name}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={onLogout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <Button onClick={onLogin} className="bg-yellow-400 text-black hover:bg-yellow-400 mt-2">
                  Login
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

// Home Page Component
const HomePage = ({ listings }) => {
  const featuredListings = listings.filter(listing => listing.featured)
  const [showMap, setShowMap] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [locationText, setLocationText] = useState('Near me')

  const handleLocationSelect = (location) => {
    setSelectedLocation(location)
    setLocationText(`${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black to-gray-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Turn Your Surplus Into <span className="text-yellow-400">Cash</span>
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            List, connect, and sell your leftover building materials quickly and easily. 
            Join the UK's premier marketplace for construction materials.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-yellow-400 text-black hover:bg-yellow-400">
              <Search className="h-5 w-5 mr-2" />
              Browse Listings
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
              <Plus className="h-5 w-5 mr-2" />
              Start Selling
            </Button>
          </div>
          <p className="text-sm mt-4 text-gray-300">Only £1 to connect with sellers</p>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input 
                placeholder="Search for materials, tools, equipment..." 
                className="pl-10 h-12"
              />
            </div>
            <Button 
              onClick={() => setShowMap(true)}
              variant="outline"
              className="flex items-center gap-2 h-12 px-4 hover:bg-yellow-50 border-#FFD700"
            >
              <MapPin className="h-5 w-5 text-yellow-400" />
              <span className="text-sm">{locationText}</span>
            </Button>
            <Button className="bg-yellow-400 text-black hover:bg-yellow-400 h-12 px-8">
              Search
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Listings</h2>
            <Link to="/listings">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredListings.map(listing => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.filter(cat => cat !== 'All').map(category => (
              <Card key={category} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold text-lg">{category}</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    {getListingsByCategory(category).length} items
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Browse & Search</h3>
              <p className="text-gray-600">Find exactly what you need from local sellers</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Connect & Buy</h3>
              <p className="text-gray-600">Pay just £1 to unlock seller contact details</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8 text-black" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. List & Sell</h3>
              <p className="text-gray-600">Turn your surplus materials into cash</p>
            </div>
          </div>
        </div>
      </section>

      {/* Map Component */}
      <Map 
        isOpen={showMap}
        onClose={() => setShowMap(false)}
        onLocationSelect={handleLocationSelect}
      />
    </div>
  )
}

// Listing Card Component
const ListingCard = ({ listing }) => {
  const [isFavorited, setIsFavorited] = useState(false)

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="relative">
        {listing.image ? (
          <img 
            src={listing.image} 
            alt={listing.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}
        <button 
          onClick={() => setIsFavorited(!isFavorited)}
          className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
        >
          <Heart className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>
        {listing.featured && (
          <Badge className="absolute top-2 left-2 bg-yellow-400 text-black">
            Featured
          </Badge>
        )}
      </div>
      <CardHeader>
        <CardTitle className="text-lg">{listing.title}</CardTitle>
        <CardDescription className="text-sm text-gray-600">
          {listing.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-yellow-600">£{listing.price}</span>
          <Badge variant="outline">{listing.condition}</Badge>
        </div>
        <div className="flex items-center mt-2 text-sm text-gray-500">
          <User className="h-4 w-4 mr-1" />
          <span>{listing.seller}</span>
        </div>
        <div className="flex items-center mt-1 text-sm text-gray-500">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{listing.location}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-yellow-400 text-black hover:bg-yellow-400">
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}

// Listings Page Component
const ListingsPage = ({ listings }) => {
  const [filteredListings, setFilteredListings] = useState(listings)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = ['All', ...new Set(listings.map(l => l.category))]

  useEffect(() => {
    let filtered = listings

    if (searchTerm) {
      filtered = filtered.filter(listing => 
        listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        listing.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(listing => listing.category === selectedCategory)
    }

    setFilteredListings(filtered)
  }, [listings, searchTerm, selectedCategory])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">All Listings</h1>
        
        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input 
                placeholder="Search listings..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10"
              />
            </div>
            <select 
              className="px-3 py-2 border border-gray-300 rounded-md"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredListings.map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>

        {filteredListings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No listings found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Login Modal Component
const LoginModal = ({ isOpen, onClose, onLogin, isLoading }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onLogin(email, password)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Login to PoundTrades</h2>
          <button onClick={onClose}>
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <Input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-yellow-400 text-black hover:bg-yellow-400"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
        
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="text-sm text-gray-600 mb-2">Demo Accounts:</p>
          <p className="text-xs text-gray-500">
            Admin: roger@poundtrades.co.uk (any password)<br/>
            User: any email (any password)
          </p>
        </div>
      </div>
    </div>
  )
}

// Main App Component
function App() {
  const { user, login, logout, isLoading } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)

  const handleLogin = () => {
    setShowLoginModal(true)
  }

  const handleLoginSubmit = async (email, password) => {
    await login(email, password)
    setShowLoginModal(false)
  }

  return (
    <Router>
      <div className="App">
        <Header 
          user={user} 
          onLogin={handleLogin} 
          onLogout={logout} 
        />
        
        <Routes>
          <Route path="/" element={<HomePage listings={listings} />} />
          <Route path="/listings" element={<ListingsPage listings={listings} />} />
          <Route path="/categories" element={<ListingsPage listings={listings} />} />
        </Routes>

        <LoginModal 
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLoginSubmit}
          isLoading={isLoading}
        />

        {/* Footer */}
        <footer className="bg-black text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <img src={poundtradesLogo} alt="PoundTrades" className="h-8 w-8 rounded" />
                  <span className="text-xl font-bold text-yellow-400">PoundTrades</span>
                </div>
                <p className="text-gray-400 text-sm">
                  The UK's premier marketplace for construction materials and building supplies.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Marketplace</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><Link to="/listings" className="hover:text-white">Browse Listings</Link></li>
                  <li><Link to="/categories" className="hover:text-white">Categories</Link></li>
                  <li><a href="#" className="hover:text-white">Sell Items</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Support</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white">Help Center</a></li>
                  <li><a href="#" className="hover:text-white">Contact Us</a></li>
                  <li><a href="#" className="hover:text-white">Safety Tips</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Company</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-white">About Us</a></li>
                  <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
              <p>&copy; 2024 PoundTrades. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App


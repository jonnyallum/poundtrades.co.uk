import React, { useState, useEffect } from 'react'
import { supabase, listingsService, categoriesService, authService } from './lib/supabase'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { Search, MapPin, Heart, User, Home, List, Star, MoreHorizontal } from 'lucide-react'
import './App.css'

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [listings, setListings] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Load data on component mount
  useEffect(() => {
    loadCategories()
    loadListings()
    checkUser()
  }, [])

  // Check current user
  const checkUser = async () => {
    const { user } = await authService.getCurrentUser()
    setUser(user)
  }

  // Load categories
  const loadCategories = async () => {
    const { data } = await categoriesService.getCategories()
    setCategories([{ id: 'all', name: 'All', description: 'All categories' }, ...data])
  }

  // Load listings
  const loadListings = async () => {
    setLoading(true)
    const filters = {
      category: selectedCategory !== 'All' ? selectedCategory : null,
      search: searchTerm || null
    }
    const { data } = await listingsService.getListings(filters)
    setListings(data)
    setLoading(false)
  }

  // Handle authentication
  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (authMode === 'login') {
        const { user, error } = await authService.signIn(email, password)
        if (error) {
          alert('Login failed: ' + error.message)
        } else {
          setUser(user)
          setAuthModalOpen(false)
          setEmail('')
          setPassword('')
        }
      } else {
        const { user, error } = await authService.signUp(email, password)
        if (error) {
          alert('Sign up failed: ' + error.message)
        } else {
          alert('Check your email for verification link!')
          setAuthModalOpen(false)
          setEmail('')
          setPassword('')
        }
      }
    } catch (error) {
      alert('Authentication error: ' + error.message)
    }

    setLoading(false)
  }

  // Handle sign out
  const handleSignOut = async () => {
    await authService.signOut()
    setUser(null)
  }

  // Search handler
  const handleSearch = () => {
    loadListings()
  }

  // Category filter handler
  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    setTimeout(loadListings, 100)
  }

  // Render home page
  const renderHomePage = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12 bg-gradient-to-r from-black to-gray-900 text-white rounded-lg">
        <h1 className="text-4xl font-bold mb-4">Turn your surplus into cash</h1>
        <p className="text-xl mb-6">List, connect, and sell your leftover building materials quickly and easily.</p>
        <Button 
          onClick={() => setCurrentPage('listings')}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-3"
        >
          Browse Listings →
        </Button>
        <p className="mt-4 text-yellow-400 font-semibold">Only £1 to connect</p>
      </div>

      {/* Search Section */}
      <div className="flex gap-4 max-w-4xl mx-auto">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search for materials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button 
          onClick={handleSearch}
          className="bg-yellow-500 hover:bg-yellow-600 text-black"
        >
          <MapPin className="h-4 w-4 mr-2" />
          Near me
        </Button>
      </div>

      {/* Categories */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Categories</h2>
          <Button 
            variant="outline" 
            onClick={() => setCurrentPage('listings')}
            className="text-yellow-600 border-yellow-600 hover:bg-yellow-50"
          >
            View all →
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories.slice(1, 4).map((category) => (
            <Card 
              key={category.id} 
              className="cursor-pointer hover:shadow-lg transition-shadow bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200"
              onClick={() => {
                setSelectedCategory(category.name)
                setCurrentPage('listings')
              }}
            >
              <CardHeader>
                <CardTitle className="text-lg">{category.name}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )

  // Render listings page
  const renderListingsPage = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Browse Listings</h1>
        <div className="flex gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.name ? "default" : "outline"}
              onClick={() => handleCategoryChange(category.name)}
              className={selectedCategory === category.name ? 
                "bg-yellow-500 hover:bg-yellow-600 text-black" : 
                "border-yellow-500 text-yellow-600 hover:bg-yellow-50"
              }
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading listings...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Card key={listing.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{listing.title}</CardTitle>
                    <CardDescription className="mt-2">{listing.description}</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Badge className="bg-yellow-500 text-black">
                      £{listing.price}
                    </Badge>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      Available
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    {listing.location}
                  </div>
                  <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">
                    View Details - £1
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )

  // Render wanted page
  const renderWantedPage = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Wanted Items</h1>
        <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
          Post a Wanted Ad
        </Button>
      </div>

      <div className="flex gap-4">
        <Input
          placeholder="What are you looking for?"
          className="flex-1"
        />
        <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
          Search
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {['£0-50', '£50-100', '£100-250', '£250-500', '£500-1000', '£1000+'].map((budget) => (
          <Button key={budget} variant="outline" className="border-yellow-500 text-yellow-600 hover:bg-yellow-50">
            {budget}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {['Timber', 'Bricks', 'Steel', 'Insulation', 'Tools', 'Paint'].map((category) => (
          <Button key={category} variant="outline" className="border-yellow-500 text-yellow-600 hover:bg-yellow-50">
            {category}
          </Button>
        ))}
      </div>

      <div className="text-center py-12 text-gray-500">
        <p>No wanted items to display yet.</p>
        <p className="mt-2">Be the first to post what you're looking for!</p>
      </div>
    </div>
  )

  // Render profile page
  const renderProfilePage = () => (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Profile</h1>
      
      {user ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Welcome back!</CardTitle>
              <CardDescription>Email: {user.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleSignOut} variant="outline">
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center py-12">
          <User className="h-16 w-16 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Sign in to view your profile</h2>
          <p className="text-gray-600 mb-6">Access your listings, favorites, and account settings</p>
          <Button 
            onClick={() => setAuthModalOpen(true)}
            className="bg-yellow-500 hover:bg-yellow-600 text-black"
          >
            Sign In
          </Button>
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-black shadow-sm border-b border-yellow-400 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center cursor-pointer" onClick={() => setCurrentPage('home')}>
              <img 
                src="/poundtrades-logo.png" 
                alt="PoundTrades Logo"
                className="h-12 w-auto object-contain mr-3"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-white">Welcome, {user.email}</span>
                  <Button onClick={handleSignOut} variant="outline" size="sm">
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={() => setAuthModalOpen(true)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black"
                >
                  Sign In / Sign Up
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === 'home' && renderHomePage()}
        {currentPage === 'listings' && renderListingsPage()}
        {currentPage === 'wanted' && renderWantedPage()}
        {currentPage === 'profile' && renderProfilePage()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black border-t border-yellow-400 px-4 py-2">
        <div className="flex justify-around items-center max-w-md mx-auto">
          {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'discover', icon: Search, label: 'Discover' },
            { id: 'listings', icon: List, label: 'Listings' },
            { id: 'wanted', icon: Star, label: 'Wanted' },
            { id: 'profile', icon: User, label: 'Profile' },
            { id: 'more', icon: MoreHorizontal, label: 'More' }
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setCurrentPage(id === 'discover' || id === 'more' ? currentPage : id)}
              className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
                currentPage === id 
                  ? 'text-yellow-400 bg-gray-800' 
                  : 'text-gray-400 hover:text-yellow-400'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Authentication Modal */}
      <Dialog open={authModalOpen} onOpenChange={setAuthModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              {authMode === 'login' ? 'Sign In' : 'Create Account'}
            </DialogTitle>
            <DialogDescription className="text-center">
              {authMode === 'login' 
                ? 'Welcome back to PoundTrades' 
                : 'Join the PoundTrades community'
              }
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
              disabled={loading}
            >
              {loading ? 'Please wait...' : (authMode === 'login' ? 'Sign In' : 'Create Account')}
            </Button>
          </form>
          
          <div className="text-center">
            <button
              type="button"
              onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
              className="text-sm text-yellow-600 hover:text-yellow-700"
            >
              {authMode === 'login' 
                ? "Don't have an account? Sign up" 
                : 'Already have an account? Sign in'
              }
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Spacer for bottom navigation */}
      <div className="h-20"></div>
    </div>
  )
}

export default App


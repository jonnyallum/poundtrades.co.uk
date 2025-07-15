import React, { useState, useEffect } from 'react'
import { supabase, listingsService, categoriesService, authService } from './lib/supabase'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { Textarea } from './components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select'
import { Search, MapPin, Heart, User, Home, List, Star, MoreHorizontal, Plus, Upload, X } from 'lucide-react'
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
  
  // Create Listing Modal State
  const [createListingModalOpen, setCreateListingModalOpen] = useState(false)
  const [listingForm, setListingForm] = useState({
    title: '',
    description: '',
    price: '',
    category_id: '',
    location: '',
    images: []
  })
  const [uploadedImages, setUploadedImages] = useState([])
  const [createListingLoading, setCreateListingLoading] = useState(false)

  // Load data on component mount
  useEffect(() => {
    loadCategories()
    loadListings()
    checkUser()
  }, [])

  // Set up real-time subscription for listings
  useEffect(() => {
    console.log('🔄 Setting up real-time subscription for listings...')
    
    const subscription = supabase
      .channel('listings-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'listings' },
        (payload) => {
          console.log('🔄 Real-time listing change detected:', payload)
          // Force cache busting by reloading listings
          loadListings()
        }
      )
      .subscribe()

    return () => {
      console.log('🔄 Cleaning up real-time subscription')
      supabase.removeChannel(subscription)
    }
  }, [selectedCategory, searchTerm]) // Re-subscribe when filters change

  // Load listings when filters change
  useEffect(() => {
    console.log('🔄 Filter changed, reloading listings...', { selectedCategory, searchTerm })
    loadListings()
  }, [selectedCategory, searchTerm])

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

  // Load listings with cache busting
  const loadListings = async () => {
    console.log('🔍 Loading listings...', { selectedCategory, searchTerm })
    setLoading(true)
    
    // Clear existing listings for cache busting
    setListings([])
    
    const filters = {
      category: selectedCategory !== 'All' ? selectedCategory : null,
      search: searchTerm || null
    }
    console.log('📋 Filters:', filters)
    
    const { data, error } = await listingsService.getListings(filters)
    console.log('📊 Listings response:', { data, error, count: data?.length })
    
    if (error) {
      console.error('❌ Error loading listings:', error)
      setListings([])
    } else {
      console.log('✅ Fetched listings:', data)
      setListings(data || [])
    }
    
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

  // Handle image upload
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files)
    const newImages = []
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const imageData = {
            file: file,
            preview: e.target.result,
            name: file.name
          }
          newImages.push(imageData)
          setUploadedImages(prev => [...prev, imageData])
        }
        reader.readAsDataURL(file)
      }
    })
  }

  // Remove uploaded image
  const removeImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  // Handle create listing
  const handleCreateListing = async (e) => {
    e.preventDefault()
    if (!user) {
      alert('Please sign in to create a listing')
      return
    }

    setCreateListingLoading(true)
    
    try {
      // Prepare listing data
      const listingData = {
        title: listingForm.title,
        description: listingForm.description,
        price: parseFloat(listingForm.price),
        category_id: listingForm.category_id,
        location: listingForm.location,
        user_id: user.id,
        status: 'available',
        images: uploadedImages.map(img => img.preview) // For now, store base64 images
      }

      // Create listing in Supabase
      const { data, error } = await listingsService.createListing(listingData)
      
      if (error) {
        throw error
      }

      alert('Listing created successfully!')
      
      // Reset form
      setListingForm({
        title: '',
        description: '',
        price: '',
        category_id: '',
        location: '',
        images: []
      })
      setUploadedImages([])
      setCreateListingModalOpen(false)
      
      // Reload listings
      loadListings()
      
    } catch (error) {
      alert('Failed to create listing: ' + error.message)
    }
    
    setCreateListingLoading(false)
  }

  // Reset create listing form
  const resetCreateListingForm = () => {
    setListingForm({
      title: '',
      description: '',
      price: '',
      category_id: '',
      location: '',
      images: []
    })
    setUploadedImages([])
  }

  // Search handler
  const handleSearch = () => {
    loadListings()
  }

  // Category filter handler
  const handleCategoryChange = (category) => {
    console.log('🎯 Category changed to:', category)
    setSelectedCategory(category)
    // loadListings will be triggered by useEffect when selectedCategory changes
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
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
          <span className="ml-2 text-gray-600">Loading listings...</span>
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No listings found</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or check back later</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <Card key={listing.id} className="hover:shadow-lg transition-shadow">
              {/* Display image if available */}
              {listing.images && listing.images.length > 0 && (
                <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                  <img 
                    src={listing.images[0]} 
                    alt={listing.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04NS4zMzMzIDUwSDExNC42NjdWNjBIODUuMzMzM1Y1MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHA+CjwvcGF0aD4KPC9zdmc+';
                      e.target.onerror = null;
                    }}
                  />
                </div>
              )}
              
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{listing.title}</CardTitle>
                    <CardDescription className="mt-2">{listing.description}</CardDescription>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      // Toggle favorite functionality
                      console.log('Favorited listing:', listing.id);
                      // TODO: Implement favorite functionality
                    }}
                    className="hover:text-red-500"
                  >
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
                  <Button 
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
                    onClick={() => {
                      // View details functionality
                      console.log('Viewing details for listing:', listing.id);
                      // TODO: Implement view details modal or navigation
                    }}
                  >
                    View Details - £{listing.price}
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
                  <Button 
                    onClick={() => setCreateListingModalOpen(true)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Create Listing
                  </Button>
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

      {/* Create Listing Modal */}
      <Dialog open={createListingModalOpen} onOpenChange={(open) => {
        setCreateListingModalOpen(open)
        if (!open) resetCreateListingForm()
      }}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="relative">
            <button
              onClick={() => setCreateListingModalOpen(false)}
              className="absolute right-0 top-0 p-2 hover:bg-gray-100 rounded-full transition-colors"
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
            <DialogTitle className="text-center">Create New Listing</DialogTitle>
            <DialogDescription className="text-center">
              List your construction materials for sale
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleCreateListing} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">Title *</label>
              <Input
                placeholder="e.g., Reclaimed Oak Beams"
                value={listingForm.title}
                onChange={(e) => setListingForm({...listingForm, title: e.target.value})}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Description *</label>
              <Textarea
                placeholder="Describe your materials, condition, dimensions, etc."
                value={listingForm.description}
                onChange={(e) => setListingForm({...listingForm, description: e.target.value})}
                rows={4}
                required
              />
            </div>

            {/* Price and Category Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Price (£) *</label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={listingForm.price}
                  onChange={(e) => setListingForm({...listingForm, price: e.target.value})}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <Select 
                  value={listingForm.category_id} 
                  onValueChange={(value) => setListingForm({...listingForm, category_id: value})}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(cat => cat.id !== 'all').map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium mb-2">Location *</label>
              <Input
                placeholder="e.g., Manchester, UK"
                value={listingForm.location}
                onChange={(e) => setListingForm({...listingForm, location: e.target.value})}
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">Photos</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">Upload photos of your materials</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('image-upload').click()}
                >
                  Choose Files
                </Button>
              </div>

              {/* Image Previews */}
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image.preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
              disabled={createListingLoading}
            >
              {createListingLoading ? 'Creating Listing...' : 'Create Listing'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Spacer for bottom navigation */}
      <div className="h-20"></div>
    </div>
  )
}

export default App


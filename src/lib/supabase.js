import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://otwslrepaneebmlttkwu.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90d3NscmVwYW5lZWJtbHR0a3d1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNTI1NDMsImV4cCI6MjA2NzkyODU0M30.Rm5fzbSt9H7Vl0f00eiFEzP252IS5lQ_MmmxjaGYsvA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database service functions
export const listingsService = {
  // Get all listings with category and seller details
  async getListings(filters = {}) {
    try {
      let query = supabase
        .from('listings')
        .select(`
          *,
          categories(name, description)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (filters.category && filters.category !== 'All') {
        const { data: categoryData } = await supabase
          .from('categories')
          .select('id')
          .eq('name', filters.category)
          .single()
        
        if (categoryData) {
          query = query.eq('category_id', categoryData.id)
        }
      }

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`)
      }

      if (filters.minPrice) {
        query = query.gte('price', filters.minPrice)
      }

      if (filters.maxPrice) {
        query = query.lte('price', filters.maxPrice)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching listings:', error)
        return { data: [], error }
      }

      return { data: data || [], error: null }
    } catch (error) {
      console.error('Error in getListings:', error)
      return { data: [], error }
    }
  },

  // Create a new listing
  async createListing(listingData) {
    try {
      const { data, error } = await supabase
        .from('listings')
        .insert([listingData])
        .select()

      if (error) {
        console.error('Error creating listing:', error)
        return { data: null, error }
      }

      return { data: data[0], error: null }
    } catch (error) {
      console.error('Error in createListing:', error)
      return { data: null, error }
    }
  },

  // Update a listing
  async updateListing(id, updates) {
    try {
      const { data, error } = await supabase
        .from('listings')
        .update(updates)
        .eq('id', id)
        .select()

      if (error) {
        console.error('Error updating listing:', error)
        return { data: null, error }
      }

      return { data: data[0], error: null }
    } catch (error) {
      console.error('Error in updateListing:', error)
      return { data: null, error }
    }
  },

  // Delete a listing
  async deleteListing(id) {
    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting listing:', error)
        return { error }
      }

      return { error: null }
    } catch (error) {
      console.error('Error in deleteListing:', error)
      return { error }
    }
  }
}

export const categoriesService = {
  // Get all categories
  async getCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name')

      if (error) {
        console.error('Error fetching categories:', error)
        return { data: [], error }
      }

      return { data: data || [], error: null }
    } catch (error) {
      console.error('Error in getCategories:', error)
      return { data: [], error }
    }
  }
}

// Authentication helpers
export const authService = {
  // Sign up with email and password
  async signUp(email, password, userData = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })

      if (error) {
        console.error('Error signing up:', error)
        return { user: null, error }
      }

      return { user: data.user, error: null }
    } catch (error) {
      console.error('Error in signUp:', error)
      return { user: null, error }
    }
  },

  // Sign in with email and password
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('Error signing in:', error)
        return { user: null, error }
      }

      return { user: data.user, error: null }
    } catch (error) {
      console.error('Error in signIn:', error)
      return { user: null, error }
    }
  },

  // Sign out
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Error signing out:', error)
        return { error }
      }

      return { error: null }
    } catch (error) {
      console.error('Error in signOut:', error)
      return { error }
    }
  },

  // Get current user
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) {
        console.error('Error getting current user:', error)
        return { user: null, error }
      }

      return { user, error: null }
    } catch (error) {
      console.error('Error in getCurrentUser:', error)
      return { user: null, error }
    }
  },

  // Listen to auth changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

export default supabase


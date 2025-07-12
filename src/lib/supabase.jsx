import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Auth helper functions
export const signUp = async (email, password, userData = {}) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  })
  return { data, error }
}

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

export const getCurrentSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}

// Listings functions
export const getListings = async (filters = {}) => {
  let query = supabase
    .from('listings')
    .select(`
      *,
      users:user_id (
        id,
        name,
        avatar_url
      ),
      categories:category (
        name,
        slug
      )
    `)
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (filters.category && filters.category !== 'All') {
    query = query.eq('category', filters.category)
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
  return { data, error }
}

export const getListing = async (id) => {
  const { data, error } = await supabase
    .from('listings')
    .select(`
      *,
      users:user_id (
        id,
        name,
        avatar_url,
        phone,
        location
      ),
      categories:category (
        name,
        slug
      )
    `)
    .eq('id', id)
    .single()

  return { data, error }
}

export const createListing = async (listingData) => {
  const { data, error } = await supabase
    .from('listings')
    .insert([listingData])
    .select()
    .single()

  return { data, error }
}

export const updateListing = async (id, updates) => {
  const { data, error } = await supabase
    .from('listings')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  return { data, error }
}

export const deleteListing = async (id) => {
  const { error } = await supabase
    .from('listings')
    .delete()
    .eq('id', id)

  return { error }
}

// Categories functions
export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  return { data, error }
}

// Contact purchase functions
export const purchaseContactDetails = async (listingId, sellerId) => {
  const { data, error } = await supabase
    .from('contact_purchases')
    .insert([{
      listing_id: listingId,
      seller_id: sellerId,
      buyer_id: (await getCurrentUser()).user?.id
    }])
    .select()
    .single()

  return { data, error }
}

export const getContactPurchase = async (listingId, buyerId) => {
  const { data, error } = await supabase
    .from('contact_purchases')
    .select('*')
    .eq('listing_id', listingId)
    .eq('buyer_id', buyerId)
    .eq('payment_status', 'succeeded')
    .single()

  return { data, error }
}

// User profile functions
export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  return { data, error }
}

export const updateUserProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  return { data, error }
}

// Advertising functions
export const getActiveAdvertisements = async (position = null) => {
  let query = supabase
    .from('advertisements')
    .select(`
      *,
      advertising_spaces (
        name,
        position,
        dimensions
      )
    `)
    .eq('is_active', true)
    .lte('start_date', new Date().toISOString().split('T')[0])
    .gte('end_date', new Date().toISOString().split('T')[0])

  if (position) {
    query = query.eq('advertising_spaces.position', position)
  }

  const { data, error } = await query
  return { data, error }
}

export const trackAdImpression = async (adId) => {
  const { error } = await supabase.rpc('track_ad_impression', { ad_id: adId })
  return { error }
}

export const trackAdClick = async (adId) => {
  const { error } = await supabase.rpc('track_ad_click', { ad_id: adId })
  return { error }
}


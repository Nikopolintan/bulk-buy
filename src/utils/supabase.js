import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
)

//Form action utils
export const formActionDefault = {
  formProcess: false,
  formStatus: 200,
  formErrorMessage: '',
  formSuccessMessage: ''
}

//check if the session exist and is valid; return false if there's an error
export const isAuthenticated = async () => {
  const { data, error } = await supabase.auth.getSession()

  if (error) {
    console.error('Error getting session:', error.message)
    return false
  }

  return !!data.session
}

export const getUserRole = async () => {
  const { data: { user } } = await supabase.auth.getSession()

  // Assuming role is in user metadata
  return user?.user_metadata?.role || null

  // OR fetch from profile table if stored there:
  // const { data, error } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  // return data?.role || null
}


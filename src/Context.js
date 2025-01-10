import React, { useContext, useState, useEffect } from "react"
import { supabase } from "./supabaseConfig"

const Context = React.createContext()

export function useAuthenticate() {
  return useContext(Context)
}

export function AuthenticationProvider({ children }) {
  const [currentUser, setCurrentUser] = useState()
  const [loading, setLoading] = useState(true)

  async function signup(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })
    if (error) throw error
    return data
  }

  async function login(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) {
        console.error('Supabase auth error:', error)
        throw error
      }
      return data
    } catch (error) {
      console.error('Login function error:', error)
      throw error
    }
  }

  async function logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  async function resetPassword(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    })
    if (error) throw error
  }

  async function updateEmail(email) {
    const { data, error } = await supabase.auth.updateUser({ email })
    if (error) throw error
    return data
  }

  async function updatePassword(password) {
    const { data, error } = await supabase.auth.updateUser({ password })
    if (error) throw error
    return data
  }

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription?.unsubscribe()
  }, [])

  const value = {
    currentUser,
    login,
    signup,
    logout,
    resetPassword,
    updateEmail,
    updatePassword
  }

  return (
    <Context.Provider value={value}>
      {!loading && children}
    </Context.Provider>
  )
}
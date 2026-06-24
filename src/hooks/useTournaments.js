import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export function useTournaments() {
  const [tournaments, setTournaments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTournaments = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .select('*')
        .order('created_at', { ascending: true })
      if (error) throw error
      setTournaments(data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTournaments()
  }, [])

  return { tournaments, loading, error, refetch: fetchTournaments }
}

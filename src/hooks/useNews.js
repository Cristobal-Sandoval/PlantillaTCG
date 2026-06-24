import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export function useNews() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchNews = async () => {
    setLoading(true)
    setError(null)
    console.log("useNews: fetching news from Supabase...");
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) {
        console.error("useNews: Supabase query error:", error);
        throw error;
      }
      console.log("useNews: fetched successfully, count =", data?.length, data);
      setNews(data || [])
    } catch (err) {
      console.error("useNews: error in fetchNews:", err);
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [])

  return { news, loading, error, refetch: fetchNews }
}

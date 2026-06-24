import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export function useCards() {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCards = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        // Get all visible cards
        .eq('in_stock', true)
      
      if (error) throw error

      let sortedData = []
      if (data && data.length > 0) {
        // Group cards by exact name
        const groups = {}
        data.forEach(card => {
          if (!groups[card.name]) groups[card.name] = []
          groups[card.name].push(card)
        })

        // Find max price for each group and sort groups by max price descending
        const sortedGroups = Object.values(groups).sort((groupA, groupB) => {
          const maxPriceA = Math.max(...groupA.map(c => c.price || 0))
          const maxPriceB = Math.max(...groupB.map(c => c.price || 0))
          return maxPriceB - maxPriceA
        })

        // Flatten the groups. Within each group, we can also sort by price descending.
        sortedGroups.forEach(group => {
          group.sort((a, b) => (b.price || 0) - (a.price || 0))
          sortedData.push(...group)
        })
      }

      setCards(sortedData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCards()
  }, [])

  return { cards, loading, error, refetch: fetchCards }
}

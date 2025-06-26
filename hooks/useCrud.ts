'use client'

import { useState, useEffect, useCallback } from 'react'

// Simples função de fetch para o cliente
async function fetcher(url: string, options: RequestInit = {}) {
  const res = await fetch(url, options)
  const data = await res.json()
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'Ocorreu um erro na requisição.')
  }
  return data.data
}

export function useCrud<T extends { id: string }>(apiPath: string) {
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(true)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetcher(apiPath)
      setItems(data)
    } catch (error: any) {
      alert(`Erro ao buscar dados: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }, [apiPath])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const createItem = async (newItemData: Record<string, any>): Promise<T | null> => {
    try {
      const newItem = await fetcher(apiPath, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItemData),
      })
      setItems(prev => [newItem, ...prev])
      return newItem
    } catch (error: any) {
      alert(`Erro ao criar item: ${error.message}`)
      return null
    }
  }

  const deleteItem = async (id: string): Promise<boolean> => {
    if (!confirm('Tem certeza que deseja deletar este item?')) return false
    
    try {
      await fetcher(`${apiPath}/${id}`, { method: 'DELETE' })
      setItems(prev => prev.filter(item => item.id !== id))
      return true
    } catch (error: any) {
      alert(`Erro ao deletar item: ${error.message}`)
      return false
    }
  }

  return { items, loading, createItem, deleteItem }
} 
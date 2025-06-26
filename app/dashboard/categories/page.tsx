'use client'

import { useCrud } from '@/hooks/useCrud'
import AddCategoryForm from './components/AddCategoryForm'
import CategoryList from './components/CategoryList'
import { Category } from '@/lib/types'

export default function CategoriesPage() {
  const { items: categories, loading, createItem, deleteItem } = useCrud<Category>('/api/expense-categories')

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Carregando categorias...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Gerenciar Categorias
              </h1>
              <p className="text-gray-600">
                Organize suas despesas criando e gerenciando categorias personalizadas
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
                <div className="text-sm text-gray-500">Total de Categorias</div>
                <div className="text-2xl font-bold text-blue-600">{categories.length}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Add Category Form */}
          <div className="lg:col-span-1">
            <AddCategoryForm createCategory={createItem} />
          </div>

          {/* Categories List */}
          <div className="lg:col-span-1">
            <CategoryList categories={categories} onDelete={deleteItem} />
          </div>
        </div>
      </div>
    </div>
  )
} 
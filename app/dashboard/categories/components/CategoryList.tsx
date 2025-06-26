'use client'

import { Category } from '@/lib/types'
import ListWrapper from '@/app/components/ListWrapper'

interface CategoryListProps {
  categories: Category[];
  onDelete: (id: string) => Promise<boolean>;
}

const categoryIcon = (
    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
);

const emptyCategoryIcon = (
    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
);

export default function CategoryList({ categories, onDelete }: CategoryListProps) {
  return (
    <ListWrapper
        title="Categorias Existentes"
        itemCount={categories.length}
        itemNoun={{ singular: 'categoria', plural: 'categorias' }}
        icon={categoryIcon}
        emptyState={{
            icon: emptyCategoryIcon,
            title: 'Nenhuma categoria encontrada',
            message: 'Comece criando sua primeira categoria de despesa.'
        }}
    >
        {categories.map(category => (
        <div 
            key={category.id} 
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 bg-gray-50 hover:bg-white"
        >
            <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
                <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                </div>
                <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{category.nome}</h3>
                {category.descricao && (
                    <p className="text-sm text-gray-600 mt-1">{category.descricao}</p>
                )}
                </div>
            </div>
            <button
                onClick={() => onDelete(category.id)}
                className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200"
                title="Deletar categoria"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
            </div>
        </div>
        ))}
    </ListWrapper>
  )
} 
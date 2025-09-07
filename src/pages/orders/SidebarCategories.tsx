import React from 'react'

type Category = {
  id: string | number
  name: string
  icon?: string
}

type SidebarCategoriesProps = {
  categories: Category[]
  selectedCategory: string
  handleCategoryChange: (categoryId: string) => void
}

export const SidebarCategories: React.FC<SidebarCategoriesProps> = ({
  categories,
  selectedCategory,
  handleCategoryChange,
}) => (
  <div className="w-[240px] rounded-lg flex flex-col h-[calc(100vh-80px)]">
    <ul className="flex flex-col space-y-2 overflow-y-auto flex-1">
      <li className="flex">
        <button
          className={`w-full h-24 flex flex-col items-center justify-center p-2 rounded-lg border ${
            selectedCategory === 'all'
              ? 'bg-orange-700 text-white border-orange-800'
              : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50 hover:cursor-pointer'
          }`}
          onClick={() => handleCategoryChange('all')}
        >
          <div className="text-lg mb-1">📦</div>
          <span className="text-sm font-medium">Todos los productos</span>
        </button>
      </li>
      {categories.map((category) => (
        <li key={category.id} className="flex">
          <button
            className={`w-full h-24 flex flex-col items-center justify-center p-2 rounded-lg border hover:cursor-pointer ${
              selectedCategory === category.id.toString()
                ? 'bg-orange-800 text-white border-orange-900'
                : 'bg-white text-gray-800 border-gray-200 hover:bg-gray-50'
            }`}
            onClick={() => handleCategoryChange(category.id.toString())}
          >
            <div className="text-lg mb-1">{category.icon || '📋'}</div>
            <span className="text-sm font-medium text-center">
              {category.name}
            </span>
          </button>
        </li>
      ))}
    </ul>
  </div>
)

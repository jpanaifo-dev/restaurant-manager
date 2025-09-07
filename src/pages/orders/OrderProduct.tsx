import React from 'react'
import { Minus, Plus, Edit, Trash } from 'tabler-icons-react'
import type { OrderItem } from './OrderCreatePage'

export interface OrderProductOption {
  id: string
  name: string
  additional_price: number
}

interface OrderProductProps {
  item: OrderItem
  updateItemQuantity: (id: string, quantity: number) => void
  openEditModal: (item: OrderItem) => void
  removeItem: (id: string) => void
}

export const OrderProduct: React.FC<OrderProductProps> = ({
  item,
  updateItemQuantity,
  openEditModal,
  removeItem,
}) => (
  <div key={item.id} className="flex w-full gap-3">
    <div>
      {item.product?.url_image ? (
        <img
          src={item.product.url_image}
          alt={item.product.name}
          className="w-16 h-16 object-cover rounded mr-3"
        />
      ) : (
        <div className="w-16 h-16 bg-gray-200 rounded mr-3 flex items-center justify-center text-gray-400">
          Sin imagen
        </div>
      )}
    </div>
    <div className="flex justify-between items-start w-full">
      <div className="flex-1">
        <h4 className="font-medium">{item.product?.name}</h4>
        <p className="text-sm text-gray-600">
          {new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
          }).format(
            (item.product?.base_price || 0) * item.quantity +
              item.options.reduce(
                (sum, opt) => sum + opt.additional_price * item.quantity,
                0
              )
          )}
        </p>
        {item.notes && (
          <p className="text-xs text-gray-500">Nota: {item.notes}</p>
        )}
        {item.options.length > 0 && (
          <div className="text-xs text-gray-500">
            Acomp: {item.options.map((opt) => opt.name).join(', ')}
          </div>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          className="p-1 text-gray-500 hover:text-red-500"
          onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
        >
          <Minus size={16} />
        </button>

        <span className="mx-1">{item.quantity}</span>

        <button
          className="p-1 text-gray-500 hover:text-green-500"
          onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
        >
          <Plus size={16} />
        </button>

        <button
          className="p-1 text-gray-500 hover:text-blue-500 ml-1"
          onClick={() => openEditModal(item)}
        >
          <Edit size={16} />
        </button>

        <button
          className="p-1 text-gray-500 hover:text-red-500"
          onClick={() => removeItem(item.id)}
        >
          <Trash size={16} />
        </button>
      </div>
    </div>
  </div>
)

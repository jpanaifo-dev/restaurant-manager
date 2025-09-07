import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import supabase from '../../utils/supabase'
import { Button } from 'flowbite-react'
import { Plus, Minus, Trash, Edit, X } from 'tabler-icons-react'

interface Category {
  id: number
  name: string
  status: string
  color: string
  icon: string
}

interface Product {
  id: number
  name: string
  description: string
  base_price: number
  status: string
  category_id: number
  stock: number
  url_image: string
  category?: Category
}

interface ProductOption {
  id: number
  name: string
  additional_price: number
  product_id: number
  is_available: boolean
}

interface OrderItem {
  id: string // ID único temporal para cada ítem
  product_id: number
  quantity: number
  notes: string
  options: ProductOption[]
  product?: Product
}

interface Table {
  id: number
  name: string
  capacity: number
  status: string
  code: string
  shape: string
}

const OrderCreatePage: React.FC = () => {
  const { tableId, orderId } = useParams<{ tableId: string; orderId: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [table, setTable] = useState<Table | null>(null)
  const [editingItem, setEditingItem] = useState<OrderItem | null>(null)
  const [isOptionModalOpen, setIsOptionModalOpen] = useState(false)
  const [discount, setDiscount] = useState(0)
  const [loading, setLoading] = useState(true)

  const selectedCategory = searchParams.get('category') || 'all'

  // Generar ID único para cada ítem
  const generateUniqueId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substring(2)
  }

  // Cargar categorías y productos
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)

      // Cargar categorías
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .eq('status', 'activa')
        .order('name')

      if (categoriesError) {
        console.error('Error loading categories:', categoriesError)
      } else {
        setCategories(categoriesData || [])
      }

      // Cargar productos
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('status', 'activo')
        .order('name')

      if (productsError) {
        console.error('Error loading products:', productsError)
      } else {
        setProducts(productsData || [])
        setFilteredProducts(productsData || [])
      }

      // Cargar información de la mesa si tableId está presente
      if (tableId) {
        const { data: tableData, error: tableError } = await supabase
          .from('tables')
          .select('*')
          .eq('id', tableId)
          .single()

        if (tableError) {
          console.error('Error loading table:', tableError)
        } else {
          setTable(tableData)
        }
      }

      // Cargar orden existente si orderId está presente
      if (orderId) {
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*, order_items(*, product:products(*))')
          .eq('id', orderId)
          .single()

        if (orderError) {
          console.error('Error loading order:', orderError)
        } else if (orderData && orderData.order_items) {
          // Transformar los items de la orden al formato que usamos
          const items: OrderItem[] = orderData.order_items.map(
            (item: OrderItem) => ({
            //   id: generateUniqueId(), // Generar ID único para cada ítem
              product_id: item.product_id,
              quantity: item.quantity,
              notes: item.notes || '',
              options: [], // Esto se cargaría por separado si es necesario
              product: item.product,
            })
          )
          setOrderItems(items)
        }
      }

      setLoading(false)
    }

    fetchData()
  }, [tableId, orderId])

  // Filtrar productos por categoría
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products)
    } else {
      const categoryId = parseInt(selectedCategory)
      setFilteredProducts(
        products.filter((product) => product.category_id === categoryId)
      )
    }
  }, [selectedCategory, products])

  // Agregar producto a la orden (siempre como nuevo ítem)
  const addProductToOrder = (product: Product) => {
    const newItem: OrderItem = {
      id: generateUniqueId(), // ID único para este ítem específico
      product_id: product.id,
      quantity: 1,
      notes: '',
      options: [],
      product: product,
    }

    setOrderItems([...orderItems, newItem])
  }

  // Actualizar cantidad de un item
  const updateItemQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      // Si la cantidad es menor a 1, eliminar el item
      removeItem(itemId)
      return
    }

    const updatedItems = orderItems.map((item) =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    )
    setOrderItems(updatedItems)
  }

  // Eliminar item de la orden
  const removeItem = (itemId: string) => {
    const updatedItems = orderItems.filter((item) => item.id !== itemId)
    setOrderItems(updatedItems)
  }

  // Abrir modal para editar opciones y notas
  const openEditModal = (item: OrderItem) => {
    setEditingItem({ ...item, options: [...item.options] })
    setIsOptionModalOpen(true)
  }

  // Guardar cambios en opciones y notas
  const saveItemOptions = () => {
    if (!editingItem) return

    const updatedItems = orderItems.map((item) =>
      item.id === editingItem.id ? { ...editingItem } : item
    )

    setOrderItems(updatedItems)
    setIsOptionModalOpen(false)
    setEditingItem(null)
  }

  // Calcular subtotal
  const calculateSubtotal = () => {
    return orderItems.reduce((total, item) => {
      const basePrice = item.product?.base_price || 0
      const optionsPrice = item.options.reduce(
        (optTotal, opt) => optTotal + opt.additional_price,
        0
      )
      return total + (basePrice + optionsPrice) * item.quantity
    }, 0)
  }

  // Calcular IGV (18%)
  const calculateIGV = () => {
    return calculateSubtotal() * 0.18
  }

  // Calcular total
  const calculateTotal = () => {
    const subtotal = calculateSubtotal()
    const igv = calculateIGV()
    return subtotal + igv - discount
  }

  // Confirmar pedido
  const confirmOrder = async () => {
    if (orderItems.length === 0) {
      alert('Debe agregar al menos un producto a la orden')
      return
    }

    try {
      let orderData = {
        table_id: tableId ? parseInt(tableId) : null,
        status: 'pending',
      }

      // Si estamos editando una orden existente
      if (orderId) {
        const { error } = await supabase
          .from('orders')
          .update(orderData)
          .eq('id', orderId)

        if (error) throw error

        // Eliminar items existentes
        const { error: deleteError } = await supabase
          .from('order_items')
          .delete()
          .eq('order_id', orderId)

        if (deleteError) throw deleteError
      } else {
        // Crear nueva orden
        const { data, error } = await supabase
          .from('orders')
          .insert([orderData])
          .select()
          .single()

        if (error) throw error
        orderData = data
      }

      // Insertar items de la orden
      const orderItemsToInsert = orderItems.map((item) => ({
        order_id: orderId,
        product_id: item.product_id,
        quantity: item.quantity,
        notes: item.notes,
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItemsToInsert)

      if (itemsError) throw itemsError

      alert(`Orden ${orderId ? 'actualizada' : 'creada'} correctamente`)
      navigate('/orders-history')
    } catch (error) {
      console.error('Error saving order:', error)
      alert('Error al procesar la orden')
    }
  }

  const handleCategoryChange = (categoryId: string) => {
    if (categoryId === 'all') {
      searchParams.delete('category')
      setSearchParams(searchParams)
    } else {
      searchParams.set('category', categoryId)
      setSearchParams(searchParams)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="flex gap-6">
            <div className="w-1/4">
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
            <div className="w-1/2">
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
            <div className="w-1/4">
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {orderId ? 'Editar' : 'Crear'} Pedido{' '}
          {table && `- Mesa: ${table.name} (${table.code})`}
        </h1>
        <Button color="gray" onClick={() => navigate('/orders-history')}>
          Volver al Historial
        </Button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar de categorías */}
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

        {/* Lista de productos */}
        <div className="bg-white rounded-lg shadow p-4 w-full">
          <h2 className="text-lg font-semibold mb-4">Productos</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="border rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => addProductToOrder(product)}
              >
                <div className="h-32 bg-gray-200 rounded-md mb-2 flex items-center justify-center">
                  {product.url_image ? (
                    <img
                      src={product.url_image}
                      alt={product.name}
                      className="h-full w-full object-cover rounded-md"
                    />
                  ) : (
                    <span className="text-gray-400">Sin imagen</span>
                  )}
                </div>
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-1">
                  {product.description}
                </p>
                <p className="font-semibold">
                  S/ {product.base_price.toFixed(2)}
                </p>
                {product.stock < 10 && (
                  <p className="text-xs text-orange-600">
                    Solo {product.stock} disponibles
                  </p>
                )}
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No hay productos en esta categoría
            </div>
          )}
        </div>

        {/* Boleta de pedido */}
        <div className="w-1/4 bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">Boleta</h2>

          <div className="mb-4 max-h-96 overflow-y-auto">
            {orderItems.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No hay productos en la orden
              </p>
            ) : (
              orderItems.map((item) => (
                <div key={item.id} className="border-b py-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-medium">{item.product?.name}</h4>
                      <p className="text-sm text-gray-600">
                        S/{' '}
                        {(
                          (item.product?.base_price || 0) * item.quantity
                        ).toFixed(2)}
                        {item.options.length > 0 &&
                          ` + S/ ${item.options
                            .reduce((sum, opt) => sum + opt.additional_price, 0)
                            .toFixed(2)}`}
                      </p>
                      {item.notes && (
                        <p className="text-xs text-gray-500">
                          Nota: {item.notes}
                        </p>
                      )}
                      {item.options.length > 0 && (
                        <div className="text-xs text-gray-500">
                          Acomp:{' '}
                          {item.options.map((opt) => opt.name).join(', ')}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        className="p-1 text-gray-500 hover:text-red-500"
                        onClick={() =>
                          updateItemQuantity(item.id, item.quantity - 1)
                        }
                      >
                        <Minus size={16} />
                      </button>

                      <span className="mx-1">{item.quantity}</span>

                      <button
                        className="p-1 text-gray-500 hover:text-green-500"
                        onClick={() =>
                          updateItemQuantity(item.id, item.quantity + 1)
                        }
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
              ))
            )}
          </div>

          {/* Resumen de la orden */}
          <div className="border-t pt-4">
            <div className="flex justify-between mb-1">
              <span>Subtotal:</span>
              <span>S/ {calculateSubtotal().toFixed(2)}</span>
            </div>

            <div className="flex justify-between mb-1">
              <span>IGV (18%):</span>
              <span>S/ {calculateIGV().toFixed(2)}</span>
            </div>

            <div className="flex justify-between mb-3">
              <span>Descuento:</span>
              <div className="flex items-center">
                <span className="mr-2">S/</span>
                <input
                  type="number"
                  min="0"
                  max={calculateSubtotal() + calculateIGV()}
                  step="0.01"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  className="w-16 border rounded px-1 text-right"
                />
              </div>
            </div>

            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total:</span>
              <span>S/ {calculateTotal().toFixed(2)}</span>
            </div>

            <Button className="w-full mt-4" onClick={confirmOrder}>
              {orderId ? 'Actualizar' : 'Confirmar'} Pedido
            </Button>
          </div>
        </div>
      </div>

      {/* Modal para editar opciones y notas */}
      {isOptionModalOpen && editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">
                Editar {editingItem.product?.name}
              </h3>
              <button
                onClick={() => setIsOptionModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Notas:</label>
                <textarea
                  value={editingItem.notes}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, notes: e.target.value })
                  }
                  className="w-full border rounded p-2"
                  rows={3}
                  placeholder="Especificaciones especiales para este producto"
                />
              </div>

              {/* Aquí iría la selección de opciones/acompañamientos */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Acompañamientos:
                </label>
                <p className="text-sm text-gray-500 mb-2">
                  Funcionalidad en desarrollo
                </p>
                {/* En una implementación completa, aquí se listarían las opciones disponibles para este producto */}
              </div>
            </div>

            <div className="flex justify-end p-4 border-t">
              <Button
                color="gray"
                className="mr-2"
                onClick={() => setIsOptionModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button onClick={saveItemOptions}>Guardar Cambios</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderCreatePage

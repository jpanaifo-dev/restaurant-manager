'use client'
import type React from 'react'
import { useState } from 'react'
import { Button, TextInput, Label, Card } from 'flowbite-react'

interface RestaurantLoginProps {
  appName?: string
  title?: string
  subtitle?: string
  backgroundImage?: string
  formTitle?: string
  formDescription?: string
  onLogin?: (email: string, password: string) => Promise<{ error?: string }>
  onNavigate?: () => void
}

const RestaurantLogin = ({
  appName = 'Restaurante Delicioso',
  title = 'Bienvenido a nuestro restaurante',
  subtitle = 'Disfruta de la mejor experiencia gastronómica',
  backgroundImage = '/placeholder.svg?height=1080&width=1920',
  formTitle = 'Iniciar Sesión',
  formDescription = 'Accede a tu cuenta para gestionar tu restaurante',
  onLogin,
  onNavigate,
}: RestaurantLoginProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (onLogin) {
      const result = await onLogin(email, password)
      setLoading(false)
      if (result?.error) {
        setError(result.error)
      } else {
        onNavigate?.()
      }
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="text-white space-y-6 text-center lg:text-left">
          <div className="space-y-2">
            <h1 className="text-4xl lg:text-6xl font-bold text-balance">
              {appName}
            </h1>
            <div className="w-20 h-1 bg-orange-500 mx-auto lg:mx-0"></div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl lg:text-3xl font-light text-balance">
              {title}
            </h2>
            <p className="text-lg text-gray-200 text-pretty max-w-md mx-auto lg:mx-0">
              {subtitle}
            </p>
          </div>

          {/* Features */}
          <div className="hidden lg:block space-y-4 pt-8">
            <div className="flex items-center gap-3 text-gray-200">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>Gestión completa de pedidos</span>
            </div>
            <div className="flex items-center gap-3 text-gray-200">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>Control de inventario en tiempo real</span>
            </div>
            <div className="flex items-center gap-3 text-gray-200">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>Reportes y análisis detallados</span>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex justify-center lg:justify-end">
          <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1 text-center">
                {formTitle}
              </h2>
              <p className="text-gray-600 mb-6 text-center">
                {formDescription}
              </p>
            </div>

            <div className="px-2 sm:px-6 pb-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Correo Electrónico
                  </Label>
                  <TextInput
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                    className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-gray-700 font-medium"
                  >
                    Contraseña
                  </Label>
                  <TextInput
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  />
                </div>

                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 transition-colors"
                  disabled={loading}
                >
                  {loading ? 'Ingresando...' : 'Ingresar'}
                </Button>

                <div className="text-center pt-4">
                  <a
                    href="#"
                    className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default RestaurantLogin

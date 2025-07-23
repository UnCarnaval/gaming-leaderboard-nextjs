'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { registrarUsuario, obtenerLeaderboard, formatearFecha, Usuario } from '@/lib/utils'

export default function AdminPage() {
  const [nombre, setNombre] = useState('')
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string, codigo?: string } | null>(null)

  const cargarUsuarios = async () => {
    try {
      const data = await obtenerLeaderboard()
      setUsuarios(data)
    } catch (error) {
      console.error('Error al cargar usuarios:', error)
      setUsuarios([])
    }
  }

  useEffect(() => {
    cargarUsuarios()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!nombre.trim()) {
      setMessage({ type: 'error', text: 'El nombre no puede estar vacío' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const resultado = await registrarUsuario(nombre.trim())
      
      if (resultado.success) {
        setMessage({ 
          type: 'success', 
          text: resultado.message, 
          codigo: resultado.codigo_usuario 
        })
        setNombre('')
        await cargarUsuarios() // Recargar lista
      } else {
        setMessage({ type: 'error', text: resultado.message })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error inesperado al registrar usuario' })
    } finally {
      setLoading(false)
    }
  }

  const generarLinkUsuario = (codigo: string) => {
    return `${window.location.origin}/user/${codigo}`
  }

  const copiarLink = async (codigo: string) => {
    const link = generarLinkUsuario(codigo)
    
    try {
      await navigator.clipboard.writeText(link)
      // Mostrar notificación temporal
      const notification = document.createElement('div')
      notification.innerHTML = '✅ ¡Link copiado al portapapeles!'
      notification.className = 'fixed top-4 right-4 bg-green-900 border border-green-500 text-green-300 px-6 py-3 rounded-lg z-50 glow-effect'
      document.body.appendChild(notification)
      
      setTimeout(() => {
        notification.remove()
      }, 3000)
    } catch (error) {
      console.error('Error al copiar:', error)
      alert('Error al copiar el link. Usa Ctrl+C manualmente.')
    }
  }

  const totalPuntos = usuarios.reduce((total, u) => total + u.puntos, 0)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Gaming */}
      <div className="text-center mb-8">
        <h1 className="gaming-header text-5xl font-black mb-4">⚙️ ADMIN PANEL</h1>
        <p className="text-xl text-gray-300">Gestión avanzada del sistema gaming</p>
      </div>

      {/* Navigation */}
      <div className="flex justify-center space-x-4 mb-8">
        <Link href="/" className="btn-secondary">🏠 Ver Leaderboard</Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="leaderboard-card text-center">
          <div className="text-3xl font-bold text-cyan-400">{usuarios.length}</div>
          <div className="text-gray-400 mt-2">Usuarios Totales</div>
        </div>
        <div className="leaderboard-card text-center">
          <div className="text-3xl font-bold text-purple-400">{totalPuntos}</div>
          <div className="text-gray-400 mt-2">Puntos Acumulados</div>
        </div>
        <div className="leaderboard-card text-center">
          <div className="text-3xl font-bold text-green-400">
            {usuarios.length > 0 ? Math.round(totalPuntos / usuarios.length) : 0}
          </div>
          <div className="text-gray-400 mt-2">Promedio por Usuario</div>
        </div>
      </div>

      {/* Registro de usuarios */}
      <div className="leaderboard-card mb-8">
        <h2 className="text-2xl font-bold mb-6 text-cyan-400">👤 Registrar Nuevo Usuario</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-300 mb-2">
              Nombre del usuario
            </label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
              placeholder="Escribe el nombre..."
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '🔄 Registrando...' : '✨ Registrar Usuario'}
          </button>
        </form>

        {/* Mensaje de resultado */}
        {message && (
          <div className={`mt-4 p-4 rounded-lg border ${
            message.type === 'success' 
              ? 'bg-green-900/50 border-green-500 text-green-300' 
              : 'bg-red-900/50 border-red-500 text-red-300'
          }`}>
            <p className="font-medium">{message.text}</p>
            {message.type === 'success' && message.codigo && (
              <div className="mt-3 p-3 bg-gray-800 rounded border border-gray-600">
                <p className="text-sm text-gray-400 mb-2">🔗 Link personal del usuario:</p>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={generarLinkUsuario(message.codigo)}
                    readOnly
                    className="flex-1 px-3 py-2 bg-gray-700 border border-gray-500 rounded text-white text-sm font-mono"
                  />
                  <button
                    onClick={() => copiarLink(message.codigo!)}
                    className="btn-secondary text-sm px-4 py-2"
                  >
                    📋 Copiar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lista de usuarios */}
      <div className="leaderboard-card">
        <h2 className="text-2xl font-bold mb-6 text-cyan-400">👥 Usuarios Registrados ({usuarios.length})</h2>
        
        {usuarios.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p className="text-lg">No hay usuarios registrados</p>
            <p className="text-sm mt-2">Registra el primer usuario usando el formulario anterior</p>
          </div>
        ) : (
          <div className="space-y-4">
            {usuarios.map((usuario, index) => (
              <div key={usuario.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg border border-gray-600 hover:border-gray-500 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full font-bold text-white">
                    #{index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{usuario.nombre}</h3>
                    <p className="text-sm text-gray-400">
                      Código: {usuario.codigo_usuario} | Registrado: {formatearFecha(usuario.fecha_registro)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-lg font-bold text-cyan-400">{usuario.puntos} pts</div>
                    <div className="text-xs text-gray-400">Total acumulado</div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link 
                      href={`/user/${usuario.codigo_usuario}`}
                      className="btn-secondary text-sm px-3 py-1"
                    >
                      👁️ Ver Panel
                    </Link>
                    <button
                      onClick={() => copiarLink(usuario.codigo_usuario)}
                      className="btn-primary text-sm px-3 py-1"
                    >
                      📋 Copiar Link
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-center mt-8 text-gray-500">
        <p className="text-sm">
          🎮 Gaming Leaderboard System v2.0 | 
          Desarrollado para competencias épicas
        </p>
      </div>
    </div>
  )
} 
'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  obtenerUsuarioPorCodigo, 
  obtenerEstadisticasUsuario, 
  actualizarPuntosPorCodigo, 
  formatearFecha,
  Usuario,
  EstadisticasUsuario 
} from '@/lib/utils'

export default function UserPage() {
  const params = useParams()
  const codigo = params.codigo as string
  
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [estadisticas, setEstadisticas] = useState<EstadisticasUsuario | null>(null)
  const [operacionEnCurso, setOperacionEnCurso] = useState(false)
  const [mensaje, setMensaje] = useState<{ tipo: 'exito' | 'error', texto: string } | null>(null)
  const [cargando, setCargando] = useState(true)

  const cargarDatosUsuario = async () => {
    if (!codigo) return
    
    setCargando(true)
    try {
      const [userData, statsData] = await Promise.all([
        obtenerUsuarioPorCodigo(codigo),
        obtenerEstadisticasUsuario(codigo)
      ])
      
      setUsuario(userData)
      setEstadisticas(statsData)
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error)
      setMensaje({ tipo: 'error', texto: 'Error al cargar los datos del usuario' })
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarDatosUsuario()
  }, [codigo])

  const handleOperacion = async (operacion: 'suma' | 'resta') => {
    if (!codigo || operacionEnCurso) return

    setOperacionEnCurso(true)
    setMensaje(null)

    try {
      const resultado = await actualizarPuntosPorCodigo(codigo, operacion)
      
      if (resultado.success) {
        setMensaje({ 
          tipo: 'exito', 
          texto: `¡${operacion === 'suma' ? 'Punto sumado' : 'Punto restado'} correctamente!` 
        })
        
        // Recargar datos del usuario
        await cargarDatosUsuario()
        
        // Limpiar mensaje después de 3 segundos
        setTimeout(() => setMensaje(null), 3000)
      } else {
        setMensaje({ tipo: 'error', texto: resultado.message })
      }
    } catch (error) {
      console.error('Error en operación:', error)
      setMensaje({ tipo: 'error', texto: 'Error de conexión' })
    } finally {
      setOperacionEnCurso(false)
    }
  }

  const copiarLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setMensaje({ tipo: 'exito', texto: '¡Link copiado al portapapeles!' })
      setTimeout(() => setMensaje(null), 3000)
    } catch (error) {
      console.error('Error al copiar:', error)
      setMensaje({ tipo: 'error', texto: 'Error al copiar el link' })
    }
  }

  // Loading state
  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🎮</div>
          <div className="text-xl text-cyan-400">Cargando panel de usuario...</div>
        </div>
      </div>
    )
  }

  // Error state
  if (!usuario || !estadisticas) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="leaderboard-card text-center max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-red-400 mb-4">Usuario No Encontrado</h1>
          <p className="text-gray-400 mb-6">
            No se encontró un usuario con el código: <code className="text-yellow-400">{codigo}</code>
          </p>
          <Link href="/" className="btn-primary">
            🏠 Volver al Leaderboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header con info del usuario */}
      <div className="text-center mb-8">
        <div className="leaderboard-card">
          <div className="flex items-center justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center text-4xl font-black text-white">
              {usuario.nombre.charAt(0).toUpperCase()}
            </div>
          </div>
          
          <h1 className="gaming-header text-4xl font-black mb-2">{usuario.nombre}</h1>
          <p className="text-gray-400 mb-4">Panel de Control Personal</p>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
            <span>🆔 {usuario.codigo_usuario}</span>
            <span>📅 Registrado: {formatearFecha(usuario.fecha_registro)}</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-center space-x-4 mb-8">
        <Link href="/" className="btn-secondary">🏠 Ver Leaderboard</Link>
        <button onClick={copiarLink} className="btn-secondary">📋 Copiar Link</button>
      </div>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="stat-card text-center">
          <div className="text-4xl font-black text-cyan-400">{estadisticas.puntos}</div>
          <div className="text-gray-400 mt-2">Puntos Totales</div>
        </div>
        <div className="stat-card text-center">
          <div className="text-4xl font-black text-green-400">{estadisticas.ordenes_hoy}</div>
          <div className="text-gray-400 mt-2">Hoy</div>
        </div>
        <div className="stat-card text-center">
          <div className="text-4xl font-black text-blue-400">{estadisticas.ordenes_semana}</div>
          <div className="text-gray-400 mt-2">Esta Semana</div>
        </div>
        <div className="stat-card text-center">
          <div className="text-4xl font-black text-purple-400">{estadisticas.ordenes_mes}</div>
          <div className="text-gray-400 mt-2">Este Mes</div>
        </div>
      </div>

      {/* Panel de acciones */}
      <div className="max-w-2xl mx-auto">
        <div className="leaderboard-card">
          <h2 className="text-2xl font-bold text-cyan-400 mb-6 text-center">⚡ Acciones Rápidas</h2>
          
          {/* Mensaje de estado */}
          {mensaje && (
            <div className={`mb-6 p-4 rounded-lg border text-center ${
              mensaje.tipo === 'exito' 
                ? 'bg-green-900/50 border-green-500 text-green-300' 
                : 'bg-red-900/50 border-red-500 text-red-300'
            }`}>
              {mensaje.texto}
            </div>
          )}
          
          {/* Botones de acción */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sumar punto */}
            <button
              onClick={() => handleOperacion('suma')}
              disabled={operacionEnCurso}
              className="btn-success text-xl py-6 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              <div className="flex items-center justify-center space-x-3">
                <span className="text-3xl">🔼</span>
                <div>
                  <div className="font-bold">Sumar Orden</div>
                  <div className="text-sm opacity-80">Completaste una orden</div>
                </div>
              </div>
              {operacionEnCurso && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="text-white">⏳</div>
                </div>
              )}
            </button>

            {/* Restar punto */}
            <button
              onClick={() => handleOperacion('resta')}
              disabled={operacionEnCurso || usuario.puntos <= 0}
              className="btn-danger text-xl py-6 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              <div className="flex items-center justify-center space-x-3">
                <span className="text-3xl">🔽</span>
                <div>
                  <div className="font-bold">Restar Orden</div>
                  <div className="text-sm opacity-80">Corregir error</div>
                </div>
              </div>
              {operacionEnCurso && (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="text-white">⏳</div>
                </div>
              )}
            </button>
          </div>

          {/* Instrucciones */}
          <div className="mt-8 p-4 bg-gray-800/50 rounded-lg border border-gray-600">
            <h3 className="text-lg font-bold text-yellow-400 mb-3">📖 Instrucciones:</h3>
            <ul className="text-gray-300 space-y-2 text-sm">
              <li>🔼 <strong>Sumar:</strong> Usa este botón cada vez que completes una orden</li>
              <li>🔽 <strong>Restar:</strong> Úsalo solo para corregir errores (si te equivocaste)</li>
              <li>📊 Tus estadísticas se actualizan automáticamente</li>
              <li>🏆 Compite con otros usuarios en el leaderboard general</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-8 text-gray-500">
        <p className="text-sm">
          🎮 Gaming Leaderboard System v2.0 | Panel Personal de {usuario.nombre}
        </p>
      </div>
    </div>
  )
} 
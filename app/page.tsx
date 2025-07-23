'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { obtenerLeaderboard, obtenerLeaderboardPorPeriodo, formatearFecha, Usuario } from '@/lib/utils'

export default function HomePage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [periodoActivo, setPeriodoActivo] = useState<'dia' | 'semana' | 'mes' | 'total'>('total')
  const [cargando, setCargando] = useState(true)

  const cargarLeaderboard = async () => {
    setCargando(true)
    try {
      const data = await obtenerLeaderboardPorPeriodo(periodoActivo)
      setUsuarios(data)
    } catch (error) {
      console.error('Error al cargar leaderboard:', error)
      setUsuarios([])
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarLeaderboard()
  }, [periodoActivo])

  const handlePeriodoChange = (nuevoPeriodo: 'dia' | 'semana' | 'mes' | 'total') => {
    setPeriodoActivo(nuevoPeriodo)
  }

  if (cargando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎮</div>
          <div className="text-xl text-cyan-400">Cargando leaderboard...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Gaming */}
      <div className="text-center mb-8">
        <h1 className="gaming-header text-6xl font-black mb-4">🏆 GAMING LEADERBOARD</h1>
        <p className="text-xl text-gray-300">Ranking épico de órdenes completadas</p>
      </div>

      {/* Navigation */}
      <div className="flex justify-center space-x-4 mb-8">
        <Link href="/admin" className="btn-primary">⚙️ Admin Panel</Link>
      </div>

      {/* Period Selector */}
      <div className="flex justify-center mb-8">
        <div className="flex space-x-2 bg-gray-800 rounded-lg p-2">
          {[
            { key: 'dia', label: '📅 Hoy', emoji: '🌅' },
            { key: 'semana', label: '📊 Semana', emoji: '⚡' },
            { key: 'mes', label: '📈 Mes', emoji: '🚀' },
            { key: 'total', label: '🏆 Total', emoji: '👑' }
          ].map(periodo => (
            <button
              key={periodo.key}
              onClick={() => handlePeriodoChange(periodo.key as any)}
              className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 ${
                periodoActivo === periodo.key
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white glow-effect'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <span className="text-lg mr-2">{periodo.emoji}</span>
              {periodo.label}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="max-w-4xl mx-auto">
        {usuarios.length === 0 ? (
          <div className="leaderboard-card text-center py-12">
            <div className="text-6xl mb-4">🎭</div>
            <h2 className="text-2xl font-bold text-gray-300 mb-4">No hay usuarios registrados</h2>
            <p className="text-gray-500 mb-6">¡Sé el primero en unirte a la competencia!</p>
            <Link href="/admin" className="btn-primary">
              🚀 Registrar Primer Usuario
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {usuarios.map((usuario, index) => {
              const posicion = index + 1
              let medallaEmoji = ''
              let colorPosicion = ''
              
              if (posicion === 1) {
                medallaEmoji = '🥇'
                colorPosicion = 'text-yellow-400'
              } else if (posicion === 2) {
                medallaEmoji = '🥈'
                colorPosicion = 'text-gray-300'
              } else if (posicion === 3) {
                medallaEmoji = '🥉'
                colorPosicion = 'text-amber-600'
              } else {
                medallaEmoji = '🏅'
                colorPosicion = 'text-cyan-400'
              }

              return (
                <div key={usuario.id} className="leaderboard-item">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      {/* Posición y Medalla */}
                      <div className="text-center min-w-[80px]">
                        <div className="text-4xl mb-1">{medallaEmoji}</div>
                        <div className={`text-2xl font-black ${colorPosicion}`}>
                          #{posicion}
                        </div>
                      </div>

                      {/* Info Usuario */}
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-2">
                          {usuario.nombre}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                          <span>🆔 {usuario.codigo_usuario}</span>
                          <span>📅 {formatearFecha(usuario.fecha_registro)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Puntos y Acciones */}
                    <div className="text-right">
                      <div className="text-4xl font-black text-cyan-400 mb-2">
                        {usuario.puntos.toLocaleString()}
                      </div>
                      <div className="text-gray-400 text-sm mb-3">órdenes</div>
                      
                      <Link 
                        href={`/user/${usuario.codigo_usuario}`}
                        className="btn-secondary text-sm"
                      >
                        👁️ Ver Panel
                      </Link>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Stats Footer */}
      {usuarios.length > 0 && (
        <div className="max-w-4xl mx-auto mt-12 grid md:grid-cols-3 gap-6">
          <div className="stat-card text-center">
            <div className="text-3xl font-bold text-green-400">
              {usuarios.length}
            </div>
            <div className="text-gray-400">Competidores Activos</div>
          </div>
          <div className="stat-card text-center">
            <div className="text-3xl font-bold text-blue-400">
              {usuarios.reduce((total, u) => total + u.puntos, 0).toLocaleString()}
            </div>
            <div className="text-gray-400">Órdenes Totales</div>
          </div>
          <div className="stat-card text-center">
            <div className="text-3xl font-bold text-purple-400">
              {usuarios.length > 0 ? Math.round(usuarios.reduce((total, u) => total + u.puntos, 0) / usuarios.length) : 0}
            </div>
            <div className="text-gray-400">Promedio por Usuario</div>
          </div>
        </div>
      )}

      {/* Footer Gaming */}
      <div className="text-center mt-12 text-gray-500">
        <p className="text-lg">🎮 Gaming Leaderboard System v2.0</p>
        <p>&copy; {new Date().getFullYear()} Powered by Next.js & Vercel</p>
      </div>
    </div>
  )
} 
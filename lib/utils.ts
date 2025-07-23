import { nanoid } from 'nanoid';

export interface Usuario {
  id: string;
  nombre: string;
  codigo_usuario: string;
  puntos: number;
  fecha_registro: string;
  fecha_actualizacion: string;
}

export interface Orden {
  id: string;
  usuario_id: string;
  codigo_usuario: string;
  tipo: 'suma' | 'resta';
  fecha: string;
}

export interface DataStructure {
  usuarios: Usuario[];
  ordenes: Orden[];
  configuracion: {
    version: string;
    creado: string;
    ultima_actualizacion: string;
  };
}

export interface EstadisticasUsuario {
  nombre: string;
  puntos: number;
  ordenes_hoy: number;
  ordenes_semana: number;
  ordenes_mes: number;
  ordenes_total: number;
}

/**
 * Genera un código único para el usuario
 */
export function generarCodigoUsuario(): string {
  return nanoid(10).toLowerCase();
}

/**
 * Genera un ID único
 */
export function generarId(): string {
  return nanoid();
}

/**
 * Obtiene el leaderboard general ordenado por puntos
 */
export async function obtenerLeaderboard(): Promise<Usuario[]> {
  try {
    const response = await fetch('/api/leaderboard');
    if (!response.ok) throw new Error('Error al cargar leaderboard');
    return await response.json();
  } catch (error) {
    console.error('Error al obtener leaderboard:', error);
    return [];
  }
}

/**
 * Obtiene leaderboard por período
 */
export async function obtenerLeaderboardPorPeriodo(periodo: 'dia' | 'semana' | 'mes' | 'total'): Promise<Usuario[]> {
  try {
    const response = await fetch(`/api/leaderboard?periodo=${periodo}`);
    if (!response.ok) throw new Error('Error al cargar leaderboard por período');
    return await response.json();
  } catch (error) {
    console.error('Error al obtener leaderboard por período:', error);
    return [];
  }
}

/**
 * Registra un nuevo usuario
 */
export async function registrarUsuario(nombre: string): Promise<{ success: boolean; message: string; codigo_usuario?: string }> {
  try {
    const response = await fetch('/api/usuarios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre: nombre.trim() }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return { success: false, message: 'Error de conexión' };
  }
}

/**
 * Actualiza puntos de un usuario por su código
 */
export async function actualizarPuntosPorCodigo(codigoUsuario: string, operacion: 'suma' | 'resta'): Promise<{ success: boolean; message: string; puntos?: number }> {
  try {
    const response = await fetch('/api/puntos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ codigo_usuario: codigoUsuario, operacion }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error al actualizar puntos:', error);
    return { success: false, message: 'Error de conexión' };
  }
}

/**
 * Obtiene un usuario por su código
 */
export async function obtenerUsuarioPorCodigo(codigoUsuario: string): Promise<Usuario | null> {
  try {
    const response = await fetch(`/api/usuarios/${codigoUsuario}`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Error al cargar usuario');
    }
    return await response.json();
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return null;
  }
}

/**
 * Obtiene estadísticas de un usuario
 */
export async function obtenerEstadisticasUsuario(codigoUsuario: string): Promise<EstadisticasUsuario | null> {
  try {
    const response = await fetch(`/api/usuarios/${codigoUsuario}/estadisticas`);
    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error('Error al cargar estadísticas');
    }
    return await response.json();
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return null;
  }
}

/**
 * Formatea una fecha para mostrar
 */
export function formatearFecha(fechaISO: string): string {
  try {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return 'Fecha inválida';
  }
}

/**
 * Sanitiza entrada de texto
 */
export function sanitizar(texto: string): string {
  return texto.trim().replace(/[<>"'&]/g, '');
} 
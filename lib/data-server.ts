import { createClient } from 'redis';
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

// Claves para Redis
const USERS_KEY = 'gaming:usuarios';
const ORDERS_KEY = 'gaming:ordenes';
const CONFIG_KEY = 'gaming:config';

// Cliente Redis global para reutilizar conexiones
let redis: any = null;

/**
 * Conecta a Redis si no está conectado
 */
async function getRedisClient() {
  if (!redis) {
    try {
      redis = createClient({
        url: process.env.REDIS_URL || process.env.KV_URL
      });
      
      redis.on('error', (err: any) => {
        console.error('Redis Client Error:', err);
      });
      
      await redis.connect();
      console.log('✅ Redis conectado exitosamente');
    } catch (error) {
      console.error('❌ Error conectando a Redis:', error);
      throw error;
    }
  }
  return redis;
}

/**
 * Inicializa la configuración si no existe
 */
async function inicializarConfiguracion() {
  const client = await getRedisClient();
  const config = await client.get(CONFIG_KEY);
  
  if (!config) {
    const nuevaConfig = {
      version: '2.0',
      creado: new Date().toISOString(),
      ultima_actualizacion: new Date().toISOString()
    };
    await client.set(CONFIG_KEY, JSON.stringify(nuevaConfig));
    return nuevaConfig;
  }
  return JSON.parse(config);
}

/**
 * Actualiza el timestamp de última actualización
 */
async function actualizarConfiguracion() {
  const client = await getRedisClient();
  const configStr = await client.get(CONFIG_KEY);
  const config = configStr ? JSON.parse(configStr) : {};
  
  const nuevaConfig = {
    ...config,
    ultima_actualizacion: new Date().toISOString()
  };
  
  await client.set(CONFIG_KEY, JSON.stringify(nuevaConfig));
  return nuevaConfig;
}

/**
 * Carga todos los usuarios desde Redis
 */
async function cargarUsuarios(): Promise<Usuario[]> {
  try {
    const client = await getRedisClient();
    const usuarios = await client.get(USERS_KEY);
    return usuarios ? JSON.parse(usuarios) : [];
  } catch (error) {
    console.error('Error al cargar usuarios:', error);
    return [];
  }
}

/**
 * Guarda todos los usuarios en Redis
 */
async function guardarUsuarios(usuarios: Usuario[]): Promise<boolean> {
  try {
    const client = await getRedisClient();
    await client.set(USERS_KEY, JSON.stringify(usuarios));
    await actualizarConfiguracion();
    return true;
  } catch (error) {
    console.error('Error al guardar usuarios:', error);
    return false;
  }
}

/**
 * Carga todas las órdenes desde Redis
 */
async function cargarOrdenes(): Promise<Orden[]> {
  try {
    const client = await getRedisClient();
    const ordenes = await client.get(ORDERS_KEY);
    return ordenes ? JSON.parse(ordenes) : [];
  } catch (error) {
    console.error('Error al cargar órdenes:', error);
    return [];
  }
}

/**
 * Guarda todas las órdenes en Redis
 */
async function guardarOrdenes(ordenes: Orden[]): Promise<boolean> {
  try {
    const client = await getRedisClient();
    await client.set(ORDERS_KEY, JSON.stringify(ordenes));
    await actualizarConfiguracion();
    return true;
  } catch (error) {
    console.error('Error al guardar órdenes:', error);
    return false;
  }
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
function generarId(): string {
  return nanoid();
}

/**
 * Obtiene el leaderboard general ordenado por puntos
 */
export async function obtenerLeaderboard(): Promise<Usuario[]> {
  try {
    const usuarios = await cargarUsuarios();
    return usuarios.sort((a, b) => b.puntos - a.puntos);
  } catch (error) {
    console.error('Error al obtener leaderboard:', error);
    return [];
  }
}

/**
 * Obtiene leaderboard por período (simplificado para demo)
 */
export async function obtenerLeaderboardPorPeriodo(periodo: 'dia' | 'semana' | 'mes' | 'total'): Promise<Usuario[]> {
  try {
    const usuarios = await cargarUsuarios();
    
    // Para esta demo, retornamos el mismo ranking total
    // En producción, aquí filtrarías por fechas según el período
    return usuarios.sort((a, b) => b.puntos - a.puntos);
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
    await inicializarConfiguracion();
    const usuarios = await cargarUsuarios();
    
    // Validar que no exista usuario con el mismo nombre
    const usuarioExistente = usuarios.find(u => u.nombre.toLowerCase() === nombre.toLowerCase());
    if (usuarioExistente) {
      return { success: false, message: 'Ya existe un usuario con ese nombre' };
    }

    // Crear nuevo usuario
    const codigoUsuario = generarCodigoUsuario();
    const nuevoUsuario: Usuario = {
      id: generarId(),
      nombre: nombre.trim(),
      codigo_usuario: codigoUsuario,
      puntos: 0,
      fecha_registro: new Date().toISOString(),
      fecha_actualizacion: new Date().toISOString()
    };

    // Agregar usuario
    usuarios.push(nuevoUsuario);
    
    // Guardar cambios
    const guardado = await guardarUsuarios(usuarios);
    if (!guardado) {
      return { success: false, message: 'Error al guardar el usuario en la base de datos' };
    }

    return { 
      success: true, 
      message: `Usuario ${nombre} registrado exitosamente`, 
      codigo_usuario: codigoUsuario 
    };

  } catch (error) {
    console.error('Error al registrar usuario:', error);
    return { success: false, message: 'Error interno del servidor' };
  }
}

/**
 * Actualiza puntos de un usuario por su código
 */
export async function actualizarPuntosPorCodigo(codigoUsuario: string, operacion: 'suma' | 'resta'): Promise<{ success: boolean; message: string; puntos?: number }> {
  try {
    const usuarios = await cargarUsuarios();
    const ordenes = await cargarOrdenes();
    
    // Buscar usuario
    const usuarioIndex = usuarios.findIndex(u => u.codigo_usuario === codigoUsuario);
    if (usuarioIndex === -1) {
      return { success: false, message: 'Usuario no encontrado' };
    }

    const usuario = usuarios[usuarioIndex];

    // Actualizar puntos
    if (operacion === 'suma') {
      usuario.puntos += 1;
    } else if (operacion === 'resta' && usuario.puntos > 0) {
      usuario.puntos -= 1;
    }

    // Actualizar fecha de modificación
    usuario.fecha_actualizacion = new Date().toISOString();

    // Registrar la orden
    const nuevaOrden: Orden = {
      id: generarId(),
      usuario_id: usuario.id,
      codigo_usuario: codigoUsuario,
      tipo: operacion,
      fecha: new Date().toISOString()
    };

    ordenes.push(nuevaOrden);

    // Guardar cambios
    const usuarioGuardado = await guardarUsuarios(usuarios);
    const ordenGuardada = await guardarOrdenes(ordenes);
    
    if (!usuarioGuardado || !ordenGuardada) {
      return { success: false, message: 'Error al guardar los cambios en la base de datos' };
    }

    return { 
      success: true, 
      message: `Puntos ${operacion === 'suma' ? 'sumados' : 'restados'} correctamente`, 
      puntos: usuario.puntos 
    };

  } catch (error) {
    console.error('Error al actualizar puntos:', error);
    return { success: false, message: 'Error interno del servidor' };
  }
}

/**
 * Obtiene un usuario por su código
 */
export async function obtenerUsuarioPorCodigo(codigoUsuario: string): Promise<Usuario | null> {
  try {
    const usuarios = await cargarUsuarios();
    return usuarios.find(u => u.codigo_usuario === codigoUsuario) || null;
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
    const usuario = await obtenerUsuarioPorCodigo(codigoUsuario);
    if (!usuario) return null;

    const ordenes = await cargarOrdenes();
    const ordenesUsuario = ordenes.filter(o => o.codigo_usuario === codigoUsuario);

    // Para esta demo, simplificamos las estadísticas
    return {
      nombre: usuario.nombre,
      puntos: usuario.puntos,
      ordenes_hoy: usuario.puntos,
      ordenes_semana: usuario.puntos,
      ordenes_mes: usuario.puntos,
      ordenes_total: ordenesUsuario.length
    };

  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return null;
  }
} 
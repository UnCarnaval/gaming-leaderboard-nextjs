import fs from 'fs';
import path from 'path';
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

// Ruta del archivo de datos
const DATA_FILE = path.join(process.cwd(), 'data', 'leaderboard.json');

/**
 * Inicializa la estructura de datos si no existe
 */
function inicializarDatos(): DataStructure {
  return {
    usuarios: [],
    ordenes: [],
    configuracion: {
      version: '2.0',
      creado: new Date().toISOString(),
      ultima_actualizacion: new Date().toISOString()
    }
  };
}

/**
 * Carga los datos desde el archivo JSON
 */
export function cargarDatos(): DataStructure {
  try {
    // Crear directorio si no existe
    const dataDir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Si no existe el archivo, crear uno nuevo
    if (!fs.existsSync(DATA_FILE)) {
      const datosIniciales = inicializarDatos();
      guardarDatos(datosIniciales);
      return datosIniciales;
    }

    // Leer y parsear el archivo
    const contenido = fs.readFileSync(DATA_FILE, 'utf8');
    const datos = JSON.parse(contenido) as DataStructure;
    
    // Validar estructura básica
    if (!datos.usuarios || !datos.ordenes || !datos.configuracion) {
      console.warn('Estructura de datos inválida, reinicializando...');
      return inicializarDatos();
    }

    return datos;
  } catch (error) {
    console.error('Error al cargar datos:', error);
    return inicializarDatos();
  }
}

/**
 * Guarda los datos en el archivo JSON
 */
export function guardarDatos(datos: DataStructure): boolean {
  try {
    // Actualizar timestamp
    datos.configuracion.ultima_actualizacion = new Date().toISOString();
    
    // Crear directorio si no existe
    const dataDir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Escribir archivo con formato bonito
    const contenido = JSON.stringify(datos, null, 2);
    fs.writeFileSync(DATA_FILE, contenido, 'utf8');
    
    return true;
  } catch (error) {
    console.error('Error al guardar datos:', error);
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
export function obtenerLeaderboard(): Usuario[] {
  const datos = cargarDatos();
  return datos.usuarios.sort((a, b) => b.puntos - a.puntos);
}

/**
 * Obtiene leaderboard por período (simplificado para demo)
 */
export function obtenerLeaderboardPorPeriodo(periodo: 'dia' | 'semana' | 'mes' | 'total'): Usuario[] {
  const datos = cargarDatos();
  
  // Para esta demo, retornamos el mismo ranking total
  // En producción, aquí filtrarías por fechas según el período
  return datos.usuarios.sort((a, b) => b.puntos - a.puntos);
}

/**
 * Registra un nuevo usuario
 */
export function registrarUsuario(nombre: string): { success: boolean; message: string; codigo_usuario?: string } {
  try {
    const datos = cargarDatos();
    
    // Validar que no exista usuario con el mismo nombre
    const usuarioExistente = datos.usuarios.find(u => u.nombre.toLowerCase() === nombre.toLowerCase());
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
    datos.usuarios.push(nuevoUsuario);
    
    // Guardar cambios
    if (!guardarDatos(datos)) {
      return { success: false, message: 'Error al guardar el usuario' };
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
export function actualizarPuntosPorCodigo(codigoUsuario: string, operacion: 'suma' | 'resta'): { success: boolean; message: string; puntos?: number } {
  try {
    const datos = cargarDatos();
    
    // Buscar usuario
    const usuario = datos.usuarios.find(u => u.codigo_usuario === codigoUsuario);
    if (!usuario) {
      return { success: false, message: 'Usuario no encontrado' };
    }

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

    datos.ordenes.push(nuevaOrden);

    // Guardar cambios
    if (!guardarDatos(datos)) {
      return { success: false, message: 'Error al guardar los cambios' };
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
export function obtenerUsuarioPorCodigo(codigoUsuario: string): Usuario | null {
  try {
    const datos = cargarDatos();
    return datos.usuarios.find(u => u.codigo_usuario === codigoUsuario) || null;
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return null;
  }
}

/**
 * Obtiene estadísticas de un usuario
 */
export function obtenerEstadisticasUsuario(codigoUsuario: string): EstadisticasUsuario | null {
  try {
    const usuario = obtenerUsuarioPorCodigo(codigoUsuario);
    if (!usuario) return null;

    const datos = cargarDatos();
    const ordenesUsuario = datos.ordenes.filter(o => o.codigo_usuario === codigoUsuario);

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
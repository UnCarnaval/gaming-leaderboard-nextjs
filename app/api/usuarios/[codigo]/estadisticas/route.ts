import { NextRequest, NextResponse } from 'next/server';
import { obtenerEstadisticasUsuario } from '@/lib/data-server';

export async function GET(
  request: NextRequest,
  { params }: { params: { codigo: string } }
) {
  try {
    const { codigo } = params;
    
    if (!codigo) {
      return NextResponse.json(
        { error: 'Código de usuario requerido' },
        { status: 400 }
      );
    }

    const estadisticas = await obtenerEstadisticasUsuario(codigo);
    
    if (!estadisticas) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(estadisticas);
  } catch (error) {
    console.error('Error en API estadísticas GET:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 
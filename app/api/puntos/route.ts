import { NextRequest, NextResponse } from 'next/server';
import { actualizarPuntosPorCodigo } from '@/lib/data-server';

export async function POST(request: NextRequest) {
  try {
    const { codigo_usuario, operacion } = await request.json();
    
    if (!codigo_usuario || typeof codigo_usuario !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Código de usuario es requerido' },
        { status: 400 }
      );
    }

    if (!operacion || !['suma', 'resta'].includes(operacion)) {
      return NextResponse.json(
        { success: false, message: 'Operación debe ser "suma" o "resta"' },
        { status: 400 }
      );
    }

    const resultado = actualizarPuntosPorCodigo(codigo_usuario, operacion);
    
    if (resultado.success) {
      return NextResponse.json(resultado);
    } else {
      return NextResponse.json(resultado, { status: 400 });
    }
  } catch (error) {
    console.error('Error en API puntos POST:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import { obtenerUsuarioPorCodigo } from '@/lib/data-server';

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

    const usuario = await obtenerUsuarioPorCodigo(codigo);
    
    if (!usuario) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(usuario);
  } catch (error) {
    console.error('Error en API usuario GET:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 
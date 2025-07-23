import { NextRequest, NextResponse } from 'next/server';
import { registrarUsuario, obtenerLeaderboard } from '@/lib/data-server';

export async function GET() {
  try {
    const usuarios = obtenerLeaderboard();
    return NextResponse.json(usuarios);
  } catch (error) {
    console.error('Error en API usuarios GET:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { nombre } = await request.json();
    
    if (!nombre || typeof nombre !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Nombre es requerido' },
        { status: 400 }
      );
    }

    const resultado = registrarUsuario(nombre);
    
    if (resultado.success) {
      return NextResponse.json(resultado, { status: 201 });
    } else {
      return NextResponse.json(resultado, { status: 400 });
    }
  } catch (error) {
    console.error('Error en API usuarios POST:', error);
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 
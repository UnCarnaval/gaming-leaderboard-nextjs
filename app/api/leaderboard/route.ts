import { NextRequest, NextResponse } from 'next/server';
import { obtenerLeaderboard, obtenerLeaderboardPorPeriodo } from '@/lib/data-server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const periodo = searchParams.get('periodo') as 'dia' | 'semana' | 'mes' | 'total' || 'total';
    
    const leaderboard = await obtenerLeaderboardPorPeriodo(periodo);
    
    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error('Error en API leaderboard:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
} 
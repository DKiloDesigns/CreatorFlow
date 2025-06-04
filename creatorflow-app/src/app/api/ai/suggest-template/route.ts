import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { prompt, useCase, type } = await req.json();
  // Mock suggestions
  let suggestions: string[] = [];
  if (type === 'captions') {
    suggestions = [
      `🔥 ${prompt || useCase || 'Your brand'} is on fire! #StayTuned`,
      `Don't miss out on ${prompt || useCase || 'our latest'}! 🚀`,
      `Ready for something special? ${prompt || useCase || 'Let\'s go!'} ✨`,
    ];
  } else {
    suggestions = [
      '#inspiration #growth #success',
      '#trending #now #viral',
      '#motivation #daily #goals',
    ];
    if (prompt) suggestions[0] = `#${prompt.replace(/\s+/g, '').toLowerCase()} #${useCase || 'ai'}`;
  }
  return NextResponse.json({ suggestions });
} 
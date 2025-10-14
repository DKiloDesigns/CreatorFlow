import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Here you would typically process the ingested data, e.g., save to a database
    // For now, we'll just log it and return a success response.
    console.log('Contexx Ingestion Data:', data);

    return NextResponse.json({ status: 'ok', message: 'Data ingested successfully' }, { status: 200 });
  } catch (error) {
    console.error('Contexx Ingestion Error:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to ingest data' }, { status: 500 });
  }
}

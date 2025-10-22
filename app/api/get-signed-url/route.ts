import { NextResponse } from 'next/server';

export async function GET() {
  try {

    let agent_id = process.env.NEXT_PUBLIC_AGENT_ID;
    let api_key = process.env.ELEVENLABS_API_KEY;
    
    
    console.log(agent_id)
    console.log(api_key)
    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${process.env.NEXT_PUBLIC_AGENT_ID}`,
      {
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY!,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        agent_id,
        hasApiKey: !!api_key
      });
      throw new Error(`Failed to get signed URL: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return NextResponse.json({ signedUrl: data.signed_url });
  } catch (error) {
    console.error('Error getting signed URL:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
      response: error instanceof Error && 'response' in error ? error.response : undefined,
      status: error instanceof Error && 'status' in error ? error.status : undefined,
    });
    return NextResponse.json(
      { error: 'Failed to generate signed URL' },
      { status: 500 }
    );
  }
}

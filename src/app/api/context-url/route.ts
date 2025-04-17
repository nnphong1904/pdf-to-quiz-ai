import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Get URL parameter from the request
    const url = new URL(request.url);
    const contextUrl = url.searchParams.get('url') || '';
    
    // Create a prompt based on the URL
    const prompt = `You are analyzing the webpage at ${contextUrl}. 
Please provide a concise summary of the main content, key points, and any important information present on this page. 
If this appears to be a document or article, focus on extracting the core message and significant details.`;
    
    // Return the prompt as plain text
    return new NextResponse(prompt, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    console.error('Error generating context prompt:', error);
    return new NextResponse('Error generating context prompt', { status: 500 });
  }
}

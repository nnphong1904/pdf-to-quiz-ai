import { createCanvas } from 'canvas';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Get parameters from the URL
    const url = new URL(request.url);
    const width = parseInt(url.searchParams.get('width') || '400');
    const height = parseInt(url.searchParams.get('height') || '300');
    const text = url.searchParams.get('text') || 'Hello, Canvas!';
    const bgColor = url.searchParams.get('bgColor') || '#ffffff';
    const textColor = url.searchParams.get('textColor') || '#000000';
    
    // Create a canvas with the specified dimensions
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Draw background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
    
    // Draw a colorful pattern
    for (let i = 0; i < 5; i++) {
      const gradient = ctx.createLinearGradient(0, i * height / 5, width, i * height / 5);
      gradient.addColorStop(0, `hsl(${i * 60}, 100%, 50%)`);
      gradient.addColorStop(1, `hsl(${i * 60 + 60}, 100%, 50%)`);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, i * height / 5, width, height / 5);
    }
    
    // Add border
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 5;
    ctx.strokeRect(10, 10, width - 20, height - 20);
    
    // Add text
    const fontSize = Math.min(width, height) / 10;
    ctx.font = `bold ${fontSize}px`;
    ctx.fillStyle = textColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, width / 2, height / 2);
    
    // Add timestamp
    ctx.font = '14px Arial, sans-serif';
    ctx.fillStyle = '#333333';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.fillText(`Generated: ${new Date().toISOString()}`, width - 20, height - 20);
    
    // Convert the canvas to a buffer
    const buffer = canvas.toBuffer('image/png');
    
    // Return the image as a response
    return new Response(buffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'max-age=60',
      },
    });
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
} 
import { createCanvas } from 'canvas';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Get parameters from the URL
    const url = new URL(request.url);
    const width = parseInt(url.searchParams.get('width') || '400');
    const height = parseInt(url.searchParams.get('height') || '300');
    const textColor = url.searchParams.get('textColor') || '#000000';
    
    // Create a canvas with the specified dimensions
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Draw colorful background bands
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
    
    // Draw a symbol in the center instead of text
    const centerX = width / 2;
    const centerY = height / 2;
    const symbolSize = Math.min(width, height) / 4;
    
    // Draw a star shape
    ctx.fillStyle = textColor;
    ctx.beginPath();
    
    for (let i = 0; i < 5; i++) {
      const startAngle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
      const endAngle = (Math.PI * 2 * (i + 0.5)) / 5 - Math.PI / 2;
      
      const outerX = centerX + symbolSize * Math.cos(startAngle);
      const outerY = centerY + symbolSize * Math.sin(startAngle);
      
      const innerX = centerX + (symbolSize / 2) * Math.cos(endAngle);
      const innerY = centerY + (symbolSize / 2) * Math.sin(endAngle);
      
      if (i === 0) {
        ctx.moveTo(outerX, outerY);
      } else {
        ctx.lineTo(outerX, outerY);
      }
      
      ctx.lineTo(innerX, innerY);
    }
    
    ctx.closePath();
    ctx.fill();
    
    // Draw decorative circles
    const circleRadius = symbolSize / 6;
    const circleDistance = symbolSize * 1.3;
    
    for (let i = 0; i < 4; i++) {
      const angle = (Math.PI * 2 * i) / 4;
      const circleX = centerX + circleDistance * Math.cos(angle);
      const circleY = centerY + circleDistance * Math.sin(angle);
      
      ctx.beginPath();
      ctx.arc(circleX, circleY, circleRadius, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${i * 90}, 100%, 50%)`;
      ctx.fill();
    }
    
    // Add timestamp indicator as a horizontal line with varying thickness
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    
    const lineY = height - 20;
    const lineLength = width - 40;
    
    // Hour indicator (thicker)
    ctx.fillStyle = '#333333';
    ctx.fillRect(20, lineY - 6, lineLength * (hours / 24), 6);
    
    // Minute indicator (thinner)
    ctx.fillStyle = '#666666';
    ctx.fillRect(20, lineY, lineLength * (minutes / 60), 3);
    
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
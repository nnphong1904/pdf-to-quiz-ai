"use client";

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ImageTestPage() {
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(300);
  const [text, setText] = useState('Hello, Canvas!');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#000000');
  
  // Generate the image URL with all parameters
  const imageUrl = `/api/generate-image?width=${width}&height=${height}&text=${encodeURIComponent(text)}&bgColor=${encodeURIComponent(bgColor)}&textColor=${encodeURIComponent(textColor)}`;
  
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Canvas Image Generator Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Generated Image</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            {/* Use a key to force re-render when parameters change */}
            <div key={imageUrl} className="border border-gray-200 rounded-md overflow-hidden">
              <img 
                src={imageUrl} 
                alt="Generated Canvas Image" 
                width={width} 
                height={height}
                className="max-w-full h-auto"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Link href={imageUrl} target="_blank" className="w-full">
              <Button className="w-full">Open Image in New Tab</Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Image Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Width ({width}px)</label>
                <input 
                  type="range" 
                  min="100" 
                  max="1200" 
                  value={width} 
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Height ({height}px)</label>
                <input 
                  type="range" 
                  min="100" 
                  max="1200" 
                  value={height} 
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Text</label>
                <input 
                  type="text" 
                  value={text} 
                  onChange={(e) => setText(e.target.value)}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Background Color</label>
                <div className="flex gap-2">
                  <input 
                    type="color" 
                    value={bgColor} 
                    onChange={(e) => setBgColor(e.target.value)}
                    className="h-10 w-10"
                  />
                  <input 
                    type="text" 
                    value={bgColor} 
                    onChange={(e) => setBgColor(e.target.value)}
                    className="flex-1 p-2 border rounded-md"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Text Color</label>
                <div className="flex gap-2">
                  <input 
                    type="color" 
                    value={textColor} 
                    onChange={(e) => setTextColor(e.target.value)}
                    className="h-10 w-10"
                  />
                  <input 
                    type="text" 
                    value={textColor} 
                    onChange={(e) => setTextColor(e.target.value)}
                    className="flex-1 p-2 border rounded-md"
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="text-sm text-gray-500">
              Change parameters to update the image in real-time.
            </div>
          </CardFooter>
        </Card>
      </div>
      
      <div className="mt-8 text-sm text-gray-500">
        <p>This demonstration uses the Node.js Canvas library on Vercel serverless functions.</p>
        <p>API Route: <code className="bg-gray-100 p-1 rounded">/api/generate-image</code></p>
      </div>
    </div>
  );
} 
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { execSync } = require("child_process");
    const output = execSync(
      'ldconfig -p | grep cairo || echo "Not found"'
    ).toString();
    console.log(`aaaaaaaaaaaaaaaaaa ------------------ <pre>${output}</pre> ------------------ aaaaaaaaaaaaaaaaa` );

    // Get URL parameter from the request
    const url = new URL(request.url);
    const contextUrl = url.searchParams.get("url") || "";

    // Create a prompt based on the URL
    const prompt = `You are analyzing the webpage at ${contextUrl}. 
Please provide a concise summary of the main content, key points, and any important information present on this page. 
If this appears to be a document or article, focus on extracting the core message and significant details.`;

    // Return the prompt as plain text
    return new NextResponse(prompt, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error) {
    console.error("Error generating context prompt:", error);
    return new NextResponse("Error generating context prompt", {
      status: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

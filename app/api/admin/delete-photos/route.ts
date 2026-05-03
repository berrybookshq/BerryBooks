import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: 'Missing url parameter' }, { status: 400 });
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({ error: 'Cloudinary credentials not configured' }, { status: 500 });
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret
    });

    // Extract tag from URL
    // URL format: ...tags%5B%5D=ord_123456... or tags[]=ord_123456
    let tag = '';
    try {
      const parsedUrl = new URL(url);
      const searchParams = new URLSearchParams(parsedUrl.search);
      // Depending on url encoding, check different variants
      tag = searchParams.get('tags[]') || searchParams.get('tags%5B%5D') || '';
    } catch (e) {
      // Fallback if they pasted just the tag text instead of a full URL
      tag = url;
    }

    if (!tag) {
       return NextResponse.json({ error: 'Could not extract session tag from the provided URL' }, { status: 400 });
    }

    // Use Cloudinary Admin API to delete all resources with this tag
    const result = await cloudinary.api.delete_resources_by_tag(tag);
    
    return NextResponse.json({ 
      success: true, 
      message: `Successfully permanently deleted photos for session tag: ${tag}`,
      details: result
    });

  } catch (error: any) {
    console.error('Error deleting photos:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ tag: string }> }
) {
  try {
    const { tag } = await params;
    
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

    // Use Search API for faster real-time results and to bypass Admin API caching
    const result = await cloudinary.search
      .expression(`tags:${tag}`)
      .sort_by('created_at', 'desc')
      .max_results(500)
      .execute();

    return NextResponse.json({ photos: result.resources });

  } catch (error: any) {
    console.error('Error fetching photos by tag:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

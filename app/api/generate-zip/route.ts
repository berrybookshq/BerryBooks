import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

export async function POST(request: Request) {
  try {
    const { tag } = await request.json();
    if (!tag) {
      return NextResponse.json({ error: 'Missing tag parameter' }, { status: 400 });
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json({ error: 'Cloudinary credentials are not configured on the server.' }, { status: 500 });
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret
    });

    const secure_url = cloudinary.utils.download_zip_url({
      tags: [tag]
    });

    return NextResponse.json({ secure_url });

  } catch (error: any) {
    console.error('Error generating ZIP:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

export async function DELETE(request: Request) {
  try {
    const { publicId } = await request.json();
    if (!publicId) {
      return NextResponse.json({ error: 'Missing publicId' }, { status: 400 });
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

    // Delete a specific resource
    // Use resource_type: 'image' (default)
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok' || result.result === 'not found') {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: result.result }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Error deleting photo:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

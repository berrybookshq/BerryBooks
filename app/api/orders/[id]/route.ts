import { NextResponse } from 'next/server';
import { getOrder } from '@/services/orderService';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await getOrder(id);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Return only necessary privacy flags
    return NextResponse.json({ 
      order_id: order.id,
      photos_deleted: order.photos_deleted 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

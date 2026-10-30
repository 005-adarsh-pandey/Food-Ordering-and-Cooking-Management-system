import { NextResponse } from 'next/server';
import { getServerOrders, saveServerOrders } from '@/lib/serverStorage';
import { getCurrentDateTime } from '@/lib/utils';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const orders = await getServerOrders();

    const orderIndex = orders.findIndex((o) => o.id === id);
    if (orderIndex === -1) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const updatedOrder = {
      ...orders[orderIndex],
      ...body,
      updatedAt: getCurrentDateTime(),
    };

    orders[orderIndex] = updatedOrder;
    await saveServerOrders(orders);

    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error('Failed to update order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getServerOrders, saveServerOrders } from '@/lib/serverStorage';
import { Order } from '@/lib/types';
import { generateId, getCurrentDateTime } from '@/lib/utils';

export async function GET() {
  try {
    const orders = await getServerOrders();
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const orders = await getServerOrders();

    const newOrder: Order = {
      id: body.id || generateId(),
      userId: body.userId || 'guest',
      customerName: body.customerName || 'Guest',
      items: body.items || [],
      status: body.status || 'pending',
      totalAmount: body.totalAmount || 0,
      createdAt: body.createdAt || getCurrentDateTime(),
      updatedAt: body.updatedAt || getCurrentDateTime(),
      estimatedDeliveryTime: body.estimatedDeliveryTime,
    };

    const updatedOrders = [...orders, newOrder];
    await saveServerOrders(updatedOrders);

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('Failed to create order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    const orders = await getServerOrders();

    const orderIndex = orders.findIndex((o) => o.id === id);
    if (orderIndex === -1) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const updatedOrder = {
      ...orders[orderIndex],
      ...updates,
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

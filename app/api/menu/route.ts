import { NextResponse } from 'next/server';
import { getServerMenuItems, saveServerMenuItems } from '@/lib/serverStorage';
import { MenuItem } from '@/lib/types';
import { generateId, getCurrentDateTime } from '@/lib/utils';

export async function GET() {
  try {
    const items = await getServerMenuItems();
    return NextResponse.json(items);
  } catch (error) {
    console.error('Failed to fetch menu items:', error);
    return NextResponse.json({ error: 'Failed to fetch menu items' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const items = await getServerMenuItems();

    const newItem: MenuItem = {
      ...body,
      id: body.id || generateId(),
      createdAt: body.createdAt || getCurrentDateTime(),
      updatedAt: body.updatedAt || getCurrentDateTime(),
    };

    const updated = [...items, newItem];
    await saveServerMenuItems(updated);

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error('Failed to create menu item:', error);
    return NextResponse.json({ error: 'Failed to create menu item' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;
    const items = await getServerMenuItems();

    const index = items.findIndex((i) => i.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'Menu item not found' }, { status: 404 });
    }

    const updatedItem: MenuItem = {
      ...items[index],
      ...updates,
      updatedAt: getCurrentDateTime(),
    };

    items[index] = updatedItem;
    await saveServerMenuItems(items);

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error('Failed to update menu item:', error);
    return NextResponse.json({ error: 'Failed to update menu item' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const items = await getServerMenuItems();
    const updated = items.filter((i) => i.id !== id);
    await saveServerMenuItems(updated);

    return NextResponse.json({ success: true, message: 'Item deleted' });
  } catch (error) {
    console.error('Failed to delete menu item:', error);
    return NextResponse.json({ error: 'Failed to delete menu item' }, { status: 500 });
  }
}

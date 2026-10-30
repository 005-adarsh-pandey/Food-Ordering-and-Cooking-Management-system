'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { usePermission } from '@/hooks/usePermission';
import { useOrders } from '@/contexts/OrderContext';
import { formatCurrency, calculateDashboardStats } from '@/lib/utils';
import { StatCard } from '@/components/ui/stat-card';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OrderList } from '@/components/orders/OrderList';
import { BarChart3, Users, UtensilsCrossed, DollarSign, ShoppingCart } from 'lucide-react';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const { checkPermission } = usePermission();
  const { orders } = useOrders();
  const router = useRouter();
  
  useEffect(() => {
    // Check if user is admin
    if (user && user.role !== 'admin') {
      router.push('/');
    }
  }, [user, router]);
  
  // Get all pending and preparing orders
  const activeOrders = orders.filter(
    order => order.status === 'pending' || order.status === 'preparing'
  );
  
  const stats = calculateDashboardStats(user, orders);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => router.push('/admin/menu')}>
            <UtensilsCrossed className="mr-2 h-4 w-4" />
            Manage Menu
          </Button>
          <Button variant="outline" onClick={() => router.push('/admin/financial')}>
            <BarChart3 className="mr-2 h-4 w-4" />
            Financial Reports
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Today's Orders"
          value={stats.totalOrders}
          icon={<ShoppingCart className="h-4 w-4" />}
          description="Total orders placed today"
        />
        <StatCard
          title="Today's Revenue"
          value={formatCurrency(stats.totalRevenue)}
          icon={<DollarSign className="h-4 w-4" />}
          description="Total revenue generated today"
        />
        <StatCard
          title="Pending Orders"
          value={stats.pendingOrders}
          icon={<ShoppingCart className="h-4 w-4" />}
          description="Orders waiting to be processed"
        />
        <StatCard
          title="Active Users"
          value="32"
          icon={<Users className="h-4 w-4" />}
          description="Users active in the last 24 hours"
          trend={{ value: 12, isPositive: true }}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Active Orders</CardTitle>
              <CardDescription>
                Orders that need attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OrderList orders={activeOrders} showCustomerName />
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Popular Items</CardTitle>
              <CardDescription>
                Most ordered items
              </CardDescription>
            </CardHeader>
            <CardContent>
              {stats.popularItems.length > 0 ? (
                <div className="space-y-4">
                  {stats.popularItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                          {index + 1}
                        </div>
                        <span>{item.name}</span>
                      </div>
                      <span className="text-muted-foreground">
                        {item.count} orders
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No data available</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
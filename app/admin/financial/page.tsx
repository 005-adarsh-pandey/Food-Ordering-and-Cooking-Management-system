'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, ShoppingBag } from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';

export default function FinancialReportsPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/');
    }
  }, [user, router]);

  // Sample data - In a real app, this would come from your backend
  const weeklyData = [
    { name: 'Mon', revenue: 99600 },
    { name: 'Tue', revenue: 124500 },
    { name: 'Wed', revenue: 149400 },
    { name: 'Thu', revenue: 132800 },
    { name: 'Fri', revenue: 182600 },
    { name: 'Sat', revenue: 207500 },
    { name: 'Sun', revenue: 174300 },
  ];

  const categoryData = [
    { name: 'Main Dishes', revenue: 431600 },
    { name: 'Starters', revenue: 174300 },
    { name: 'Desserts', revenue: 149400 },
    { name: 'Beverages', revenue: 124500 },
    { name: 'Sides', revenue: 74700 },
  ];

  const totalRevenue = weeklyData.reduce((sum, day) => sum + day.revenue, 0);
  const averageOrderValue = 2697.50;
  const totalOrders = 324;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Financial Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Weekly Revenue"
          value={formatCurrency(totalRevenue)}
          icon={<DollarSign className="h-4 w-4" />}
          description="Total revenue this week"
          trend={{ value: 12.5, isPositive: true }}
        />
        <StatCard
          title="Average Order Value"
          value={formatCurrency(averageOrderValue)}
          icon={<TrendingUp className="h-4 w-4" />}
          description="Average order value this week"
          trend={{ value: 5.2, isPositive: true }}
        />
        <StatCard
          title="Total Orders"
          value={totalOrders.toString()}
          icon={<ShoppingBag className="h-4 w-4" />}
          description="Orders this week"
          trend={{ value: 8.1, isPositive: true }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => formatCurrency(value as number)}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => formatCurrency(value as number)}
                  />
                  <Bar
                    dataKey="revenue"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
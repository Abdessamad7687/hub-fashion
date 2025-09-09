'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  Eye, Package, Search, Filter, Download, Trash2, Edit, RefreshCw, Calendar, 
  DollarSign, Users, ShoppingCart, TrendingUp, Clock, CheckCircle, XCircle,
  ArrowUpDown, MoreHorizontal, FilterX, BarChart3, Grid3X3, List
} from 'lucide-react';
import { AdminOrderDetailsModal } from '@/components/admin/admin-order-details-modal';

interface Order {
  id: string;
  total: number;
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
  user: {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
  };
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    size?: string;
    color?: string;
    product: {
      id: string;
      name: string;
    };
  }>;
}

export default function OrdersPage() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // UI states
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const fetchOrders = async () => {
    try {
      console.log('Fetching admin orders...');
      
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No auth token found');
        return;
      }
      
      const response = await fetch('http://localhost:4000/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Admin orders data:', data);
        setOrders(data);
        setFilteredOrders(data);
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch admin orders:', response.status, errorText);
        toast({
          title: "Error",
          description: "Failed to fetch orders. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching admin orders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch orders. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter and sort orders
  useEffect(() => {
    let filtered = [...orders];

    // Tab filter
    switch (activeTab) {
      case 'pending':
        filtered = filtered.filter(order => order.status === 'PENDING');
        break;
      case 'processing':
        filtered = filtered.filter(order => order.status === 'PROCESSING' || order.status === 'SHIPPED');
        break;
      case 'completed':
        filtered = filtered.filter(order => order.status === 'DELIVERED');
        break;
      case 'all':
      default:
        // No additional filtering for 'all' tab
        break;
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${order.user.firstName} ${order.user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter (additional to tab filter)
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== 'ALL') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'TODAY':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(order => new Date(order.createdAt) >= filterDate);
          break;
        case 'WEEK':
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(order => new Date(order.createdAt) >= filterDate);
          break;
        case 'MONTH':
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(order => new Date(order.createdAt) >= filterDate);
          break;
      }
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'total':
          aValue = a.total;
          bValue = b.total;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'createdAt':
        default:
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, dateFilter, sortBy, sortOrder, activeTab]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'PROCESSING': return 'bg-purple-100 text-purple-800';
      case 'SHIPPED': return 'bg-indigo-100 text-indigo-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`http://localhost:4000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status: newStatus as any } : order
        ));
        toast({
          title: "Status updated",
          description: "Order status has been updated successfully.",
        });
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Update failed",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateOrder = async (orderId: string, updatedData: Partial<Order>) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`http://localhost:4000/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrders(orders.map(order => 
          order.id === orderId ? updatedOrder : order
        ));
        toast({
          title: "Order updated",
          description: "Order has been updated successfully.",
        });
      } else {
        throw new Error('Failed to update order');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      toast({
        title: "Update failed",
        description: "Failed to update order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`http://localhost:4000/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        setOrders(orders.filter(order => order.id !== orderId));
        toast({
          title: "Order deleted",
          description: "Order has been deleted successfully.",
        });
      } else {
        throw new Error('Failed to delete order');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      toast({
        title: "Delete failed",
        description: "Failed to delete order. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteSelectedOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const deletePromises = selectedOrders.map(orderId => 
        fetch(`http://localhost:4000/api/orders/${orderId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        })
      );

      await Promise.all(deletePromises);
      
      setOrders(orders.filter(order => !selectedOrders.includes(order.id)));
      setSelectedOrders([]);
      setIsBulkDeleteOpen(false);
      
      toast({
        title: "Orders deleted",
        description: `${selectedOrders.length} orders have been deleted successfully.`,
      });
    } catch (error) {
      console.error('Error deleting orders:', error);
      toast({
        title: "Delete failed",
        description: "Failed to delete selected orders. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(order => order.id));
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const exportOrders = () => {
    const csvContent = [
      ['Order ID', 'Customer', 'Email', 'Total', 'Status', 'Date', 'Items'],
      ...filteredOrders.map(order => [
        order.id,
        `${order.user.firstName} ${order.user.lastName}`,
        order.user.email,
        order.total.toFixed(2),
        order.status,
        new Date(order.createdAt).toLocaleDateString(),
        order.items.reduce((sum, item) => sum + item.quantity, 0)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Calculate statistics
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === 'PENDING').length;
  const completedOrders = orders.filter(order => order.status === 'DELIVERED').length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600">Manage customer orders</p>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-6 bg-gray-200 rounded w-20"></div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
          <p className="text-gray-600">View and manage all customer orders</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={exportOrders} variant="outline" size="sm" className="border-gray-300 hover:bg-gray-50">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={fetchOrders} variant="outline" size="sm" className="border-gray-300 hover:bg-gray-50">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border border-blue-200 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100/50 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 mb-2">Total Revenue</p>
                <p className="text-3xl font-bold text-blue-900 mb-1">${totalRevenue.toFixed(2)}</p>
                <p className="text-xs text-blue-600">+12% from last month</p>
              </div>
              <div className="p-3 rounded-full bg-blue-500/10 border border-blue-200/50">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-green-200 shadow-sm bg-gradient-to-br from-green-50 to-green-100/50 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 mb-2">Total Orders</p>
                <p className="text-3xl font-bold text-green-900 mb-1">{totalOrders}</p>
                <p className="text-xs text-green-600">+8% from last month</p>
              </div>
              <div className="p-3 rounded-full bg-green-500/10 border border-green-200/50">
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-amber-200 shadow-sm bg-gradient-to-br from-amber-50 to-amber-100/50 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600 mb-2">Pending</p>
                <p className="text-3xl font-bold text-amber-900 mb-1">{pendingOrders}</p>
                <p className="text-xs text-amber-600">Needs attention</p>
              </div>
              <div className="p-3 rounded-full bg-amber-500/10 border border-amber-200/50">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-purple-200 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100/50 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 mb-2">Completed</p>
                <p className="text-3xl font-bold text-purple-900 mb-1">{completedOrders}</p>
                <p className="text-xs text-purple-600">+15% from last month</p>
              </div>
              <div className="p-3 rounded-full bg-purple-500/10 border border-purple-200/50">
                <CheckCircle className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs and Filters */}
      <div className="space-y-6">
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <TabsList className="grid w-full sm:w-auto grid-cols-4 bg-gray-100 border border-gray-200">
                  <TabsTrigger value="all" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    <Package className="h-4 w-4" />
                    All ({totalOrders})
                  </TabsTrigger>
                  <TabsTrigger value="pending" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    <Clock className="h-4 w-4" />
                    Pending ({pendingOrders})
                  </TabsTrigger>
                  <TabsTrigger value="processing" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    <TrendingUp className="h-4 w-4" />
                    Processing ({orders.filter(o => o.status === 'PROCESSING' || o.status === 'SHIPPED').length})
                  </TabsTrigger>
                  <TabsTrigger value="completed" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                    <CheckCircle className="h-4 w-4" />
                    Completed ({completedOrders})
                  </TabsTrigger>
                </TabsList>
                
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 border-gray-300 hover:bg-gray-50"
                  >
                    <Filter className="h-4 w-4" />
                    Filters
                    {showFilters && <FilterX className="h-4 w-4" />}
                  </Button>
                  
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className="rounded-none border-r border-gray-300"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className="rounded-none"
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        {/* Advanced Filters */}
        {showFilters && (
          <Card className="border border-gray-200 shadow-sm bg-gray-50/50">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Order ID, customer, email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">Status</Label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Status</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                      <SelectItem value="PROCESSING">Processing</SelectItem>
                      <SelectItem value="SHIPPED">Shipped</SelectItem>
                      <SelectItem value="DELIVERED">Delivered</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">Date Range</Label>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue placeholder="All Time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ALL">All Time</SelectItem>
                      <SelectItem value="TODAY">Today</SelectItem>
                      <SelectItem value="WEEK">This Week</SelectItem>
                      <SelectItem value="MONTH">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-gray-700">Sort By</Label>
                  <div className="flex gap-2">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="createdAt">Date</SelectItem>
                        <SelectItem value="total">Total</SelectItem>
                        <SelectItem value="status">Status</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      className="px-3 border-gray-300 hover:bg-gray-50"
                    >
                      <ArrowUpDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <Card className="border border-orange-200 bg-orange-50 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-orange-100 border border-orange-200">
                  <Package className="h-5 w-5 text-orange-600" />
                </div>
                <span className="text-sm font-medium text-orange-800">
                  {selectedOrders.length} order{selectedOrders.length > 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Dialog open={isBulkDeleteOpen} onOpenChange={setIsBulkDeleteOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" size="sm" className="border-red-300 hover:bg-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Selected
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Delete Orders</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete {selectedOrders.length} order{selectedOrders.length > 1 ? 's' : ''}? 
                        This action cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsBulkDeleteOpen(false)} className="border-gray-300">
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={deleteSelectedOrders}>
                        Delete Orders
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" size="sm" onClick={() => setSelectedOrders([])} className="border-gray-300 hover:bg-gray-50">
                  Clear Selection
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Orders List */}
      <div className="space-y-6">
        {filteredOrders.length === 0 ? (
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="p-4 rounded-full bg-gray-100 border border-gray-200 mb-6">
                <Package className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">No orders found</h3>
              <p className="text-gray-600 text-center max-w-md mb-6">
                {searchTerm || statusFilter !== 'ALL' || dateFilter !== 'ALL' 
                  ? 'No orders match your current filters. Try adjusting your search criteria.' 
                  : 'Orders will appear here when customers make purchases.'
                }
              </p>
              {(searchTerm || statusFilter !== 'ALL' || dateFilter !== 'ALL') && (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('ALL');
                    setDateFilter('ALL');
                  }}
                  className="border-gray-300 hover:bg-gray-50"
                >
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Select All and View Controls */}
            <Card className="border border-gray-200 shadow-sm bg-gray-50/50">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                    <Label className="text-sm font-medium text-gray-700">
                      Select All ({filteredOrders.length} orders)
                    </Label>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>Showing {filteredOrders.length} of {orders.length} orders</span>
                    <Separator orientation="vertical" className="h-4" />
                    <span className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4" />
                      {viewMode === 'list' ? 'List View' : 'Grid View'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Orders Grid/List */}
            <div className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" 
              : "space-y-4"
            }>
              {filteredOrders.map((order) => (
              <Card key={order.id} className={`group border border-gray-200 shadow-sm bg-white hover:shadow-md hover:border-gray-300 transition-all duration-200 ${
                viewMode === 'grid' ? 'h-full' : ''
              }`}>
                <CardHeader className="pb-6 border-b border-gray-100">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <Checkbox
                        checked={selectedOrders.includes(order.id)}
                        onCheckedChange={() => handleSelectOrder(order.id)}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg flex items-center gap-3 mb-3">
                          <div className="p-2 rounded-lg bg-blue-100 border border-blue-200">
                            <Package className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="font-mono text-sm text-gray-700">#{order.id.slice(-8).toUpperCase()}</span>
                        </CardTitle>
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {order.user.firstName} {order.user.lastName}
                          </p>
                          <p className="text-xs text-gray-600 truncate">
                            {order.user.email}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()} • {new Date(order.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-2">
                      <Badge 
                        className={`${getStatusColor(order.status)} px-3 py-1 text-xs font-medium rounded-full border`}
                        variant="secondary"
                      >
                        {order.status}
                      </Badge>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewOrder(order)}
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className={`grid gap-4 mb-6 ${
                    viewMode === 'grid' 
                      ? 'grid-cols-2' 
                      : 'grid-cols-2 sm:grid-cols-4'
                  }`}>
                    <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                      <p className="text-xs font-medium text-green-600 mb-2">Total Amount</p>
                      <p className="text-xl font-bold text-green-900">${order.total.toFixed(2)}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                      <p className="text-xs font-medium text-blue-600 mb-2">Items</p>
                      <p className="text-lg font-bold text-blue-900">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                      </p>
                    </div>
                    {viewMode === 'list' && (
                      <>
                        <div className="p-4 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
                          <p className="text-xs font-medium text-purple-600 mb-2">Date</p>
                          <p className="text-sm font-bold text-purple-900">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="p-4 rounded-lg bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200">
                          <p className="text-xs font-medium text-amber-600 mb-2">Status</p>
                          <p className="text-sm font-bold text-amber-900 capitalize">{order.status.toLowerCase()}</p>
                        </div>
                      </>
                    )}
                  </div>
                  
                  {viewMode === 'list' && (
                    <div className="mb-6">
                      <p className="text-sm font-medium text-gray-900 mb-4">Order Items:</p>
                      <div className="space-y-3 max-h-32 overflow-y-auto">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex-1 min-w-0">
                              <span className="font-medium text-sm text-gray-900">{item.product?.name || 'Product'}</span>
                              <div className="flex items-center gap-3 mt-2">
                                <span className="text-xs text-gray-600">x{item.quantity}</span>
                                {item.size && <span className="text-xs text-gray-500">Size: {item.size}</span>}
                                {item.color && <span className="text-xs text-gray-500">Color: {item.color}</span>}
                              </div>
                            </div>
                            <span className="font-semibold text-sm text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className={`flex items-center justify-between pt-6 border-t border-gray-100 ${
                    viewMode === 'grid' ? 'flex-col gap-4' : 'flex-row'
                  }`}>
                    <div className={`flex items-center gap-3 ${viewMode === 'grid' ? 'w-full' : ''}`}>
                      <span className="text-sm font-medium text-gray-700">Status:</span>
                      <Select
                        value={order.status}
                        onValueChange={(value) => updateOrderStatus(order.id, value)}
                      >
                        <SelectTrigger className={`${viewMode === 'grid' ? 'flex-1' : 'w-40'} border-gray-300 focus:border-blue-500 focus:ring-blue-500`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PENDING">Pending</SelectItem>
                          <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                          <SelectItem value="PROCESSING">Processing</SelectItem>
                          <SelectItem value="SHIPPED">Shipped</SelectItem>
                          <SelectItem value="DELIVERED">Delivered</SelectItem>
                          <SelectItem value="CANCELLED">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {viewMode === 'list' && (
                      <div className="text-right">
                        <p className="text-xs text-gray-500">ID: {order.id.slice(-8)}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            </div>
          </>
        )}
      </div>

      {/* Order Details Modal */}
      <AdminOrderDetailsModal
        order={selectedOrder}
        isOpen={isOrderModalOpen}
        onClose={() => {
          setIsOrderModalOpen(false);
          setSelectedOrder(null);
        }}
        onUpdate={updateOrder}
        onDelete={deleteOrder}
      />
    </div>
  );
}











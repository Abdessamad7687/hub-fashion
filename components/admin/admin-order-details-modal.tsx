"use client"

import { useState } from "react"
import { X, Package, Calendar, MapPin, CreditCard, Truck, User, Phone, Mail, Edit, Trash2, Save, X as Cancel } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

interface OrderItem {
  id: string
  quantity: number
  price: number
  size?: string
  color?: string
  product: {
    id: string
    name: string
  }
}

interface Order {
  id: string
  total: number
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  createdAt: string
  shippingFirstName?: string
  shippingLastName?: string
  shippingEmail?: string
  shippingPhone?: string
  shippingAddress?: string
  shippingCity?: string
  shippingState?: string
  shippingZipCode?: string
  shippingCountry?: string
  paymentMethod?: string
  user: {
    id: string
    firstName?: string
    lastName?: string
    email: string
  }
  items: OrderItem[]
}

interface AdminOrderDetailsModalProps {
  order: Order | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (orderId: string, updatedData: Partial<Order>) => Promise<void>
  onDelete: (orderId: string) => Promise<void>
}

export function AdminOrderDetailsModal({ 
  order, 
  isOpen, 
  onClose, 
  onUpdate, 
  onDelete 
}: AdminOrderDetailsModalProps) {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [editedOrder, setEditedOrder] = useState<Partial<Order>>({})

  if (!order) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-yellow-100 text-yellow-800"
      case "CONFIRMED": return "bg-blue-100 text-blue-800"
      case "PROCESSING": return "bg-purple-100 text-purple-800"
      case "SHIPPED": return "bg-indigo-100 text-indigo-800"
      case "DELIVERED": return "bg-green-100 text-green-800"
      case "CANCELLED": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const handleEdit = () => {
    setEditedOrder({
      status: order.status,
      shippingFirstName: order.shippingFirstName,
      shippingLastName: order.shippingLastName,
      shippingEmail: order.shippingEmail,
      shippingPhone: order.shippingPhone,
      shippingAddress: order.shippingAddress,
      shippingCity: order.shippingCity,
      shippingState: order.shippingState,
      shippingZipCode: order.shippingZipCode,
      shippingCountry: order.shippingCountry,
      paymentMethod: order.paymentMethod,
    })
    setIsEditing(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onUpdate(order.id, editedOrder)
      setIsEditing(false)
      toast({
        title: "Order updated",
        description: "Order has been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedOrder({})
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
      return
    }

    setIsDeleting(true)
    try {
      await onDelete(order.id)
      onClose()
      toast({
        title: "Order deleted",
        description: "Order has been deleted successfully.",
      })
    } catch (error) {
      toast({
        title: "Delete failed",
        description: "Failed to delete order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const currentOrder = isEditing ? { ...order, ...editedOrder } : order

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Package className="h-5 w-5" />
              Order #{order.id.slice(-8).toUpperCase()}
            </DialogTitle>
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <>
                  <Button variant="outline" size="sm" onClick={handleEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button variant="destructive" size="sm" onClick={handleDelete} disabled={isDeleting}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    {isDeleting ? "Deleting..." : "Delete"}
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="outline" size="sm" onClick={handleSave} disabled={isSaving}>
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    <Cancel className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </>
              )}
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Status and Date */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              {isEditing ? (
                <div className="space-y-2">
                  <Label htmlFor="status">Order Status</Label>
                  <Select
                    value={currentOrder.status}
                    onValueChange={(value) => setEditedOrder(prev => ({ ...prev, status: value as any }))}
                  >
                    <SelectTrigger className="w-40">
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
              ) : (
                <Badge className={`${getStatusColor(currentOrder.status)} px-3 py-1 text-sm font-medium`}>
                  {currentOrder.status}
                </Badge>
              )}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Placed on {new Date(currentOrder.createdAt).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">${currentOrder.total.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Total Amount</div>
            </div>
          </div>

          <Separator />

          {/* Customer Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <User className="h-5 w-5" />
              Customer Information
            </h3>
            <Card className="border">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Customer Name</Label>
                    <p className="font-medium">
                      {currentOrder.user.firstName} {currentOrder.user.lastName}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                    <p className="font-medium">{currentOrder.user.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">User ID</Label>
                    <p className="font-mono text-sm">{currentOrder.user.id}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Order Items</h3>
            <div className="space-y-3">
              {currentOrder.items.map((item, index) => (
                <Card key={index} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.product?.name || 'Product'}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span>Qty: {item.quantity}</span>
                          {item.size && <span>Size: {item.size}</span>}
                          {item.color && <span>Color: {item.color}</span>}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">${(item.price * item.quantity).toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">${item.price.toFixed(2)} each</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* Shipping Address */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Shipping Address
            </h3>
            <Card className="border">
              <CardContent className="p-4">
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="shippingFirstName">First Name</Label>
                      <Input
                        id="shippingFirstName"
                        value={currentOrder.shippingFirstName || ''}
                        onChange={(e) => setEditedOrder(prev => ({ ...prev, shippingFirstName: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shippingLastName">Last Name</Label>
                      <Input
                        id="shippingLastName"
                        value={currentOrder.shippingLastName || ''}
                        onChange={(e) => setEditedOrder(prev => ({ ...prev, shippingLastName: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shippingEmail">Email</Label>
                      <Input
                        id="shippingEmail"
                        type="email"
                        value={currentOrder.shippingEmail || ''}
                        onChange={(e) => setEditedOrder(prev => ({ ...prev, shippingEmail: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shippingPhone">Phone</Label>
                      <Input
                        id="shippingPhone"
                        value={currentOrder.shippingPhone || ''}
                        onChange={(e) => setEditedOrder(prev => ({ ...prev, shippingPhone: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="shippingAddress">Address</Label>
                      <Textarea
                        id="shippingAddress"
                        value={currentOrder.shippingAddress || ''}
                        onChange={(e) => setEditedOrder(prev => ({ ...prev, shippingAddress: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shippingCity">City</Label>
                      <Input
                        id="shippingCity"
                        value={currentOrder.shippingCity || ''}
                        onChange={(e) => setEditedOrder(prev => ({ ...prev, shippingCity: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shippingState">State</Label>
                      <Input
                        id="shippingState"
                        value={currentOrder.shippingState || ''}
                        onChange={(e) => setEditedOrder(prev => ({ ...prev, shippingState: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shippingZipCode">ZIP Code</Label>
                      <Input
                        id="shippingZipCode"
                        value={currentOrder.shippingZipCode || ''}
                        onChange={(e) => setEditedOrder(prev => ({ ...prev, shippingZipCode: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="shippingCountry">Country</Label>
                      <Input
                        id="shippingCountry"
                        value={currentOrder.shippingCountry || ''}
                        onChange={(e) => setEditedOrder(prev => ({ ...prev, shippingCountry: e.target.value }))}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="font-medium">
                      {currentOrder.shippingFirstName} {currentOrder.shippingLastName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {currentOrder.shippingAddress}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {currentOrder.shippingCity}, {currentOrder.shippingState} {currentOrder.shippingZipCode}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {currentOrder.shippingCountry}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                      <Phone className="h-3 w-3" />
                      <span>{currentOrder.shippingPhone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      <span>{currentOrder.shippingEmail}</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Payment Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Information
            </h3>
            <Card className="border">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Payment Method</Label>
                    {isEditing ? (
                      <Select
                        value={currentOrder.paymentMethod || ''}
                        onValueChange={(value) => setEditedOrder(prev => ({ ...prev, paymentMethod: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="card">Credit Card</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                          <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                          <SelectItem value="cash">Cash on Delivery</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="font-medium capitalize">{currentOrder.paymentMethod || 'Not specified'}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Total Amount</Label>
                    <p className="text-2xl font-bold">${currentOrder.total.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

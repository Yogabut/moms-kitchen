// src/components/Dashboard/OrderManagement.tsx
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { formatCurrency } from "@/utils/formatCurrency";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";

interface Order {
  id: number;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  total_amount: number;
  event_date: string;
  order_date: string;
  status: string | null;
  payment_status: string | null;
  notes?: string | null;
}

interface OrderItem {
  id: number;
  order_id: number;
  menus_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
  menus?: {
    name: string;
    category: string;
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function OrderManagement({ toast, fetchStats }: any) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<Order>>({});
  const [loadingItems, setLoadingItems] = useState(false);

  useEffect(() => {
    fetchOrders();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOrders = async () => {
    const { data, error } = await supabase.from("orders").select("*").order("order_date", { ascending: false });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else setOrders(data || []);
  };

  const fetchOrderItems = async (orderId: number) => {
    setLoadingItems(true);
    try {
      const { data, error } = await supabase
        .from("order_items")
        .select(`
          *,
          menus (
            name,
            category
          )
        `)
        .eq("order_id", orderId);
      
      setLoadingItems(false);
      
      if (error) {
        console.error("Error fetching order items:", error);
        
        // Check if it's a permission error
        if (error.code === '42501' || error.message.includes('permission')) {
          toast({ 
            title: "Permission Error", 
            description: "Unable to load order items. Please check RLS policies for order_items table.", 
            variant: "destructive" 
          });
        } else if (error.code === 'PGRST116') {
          // No rows found - this is ok
          setOrderItems([]);
        } else {
          toast({ 
            title: "Error", 
            description: `Failed to load order items: ${error.message}`, 
            variant: "destructive" 
          });
        }
        setOrderItems([]);
      } else {
        setOrderItems(data || []);
      }
    } catch (err) {
      console.error("Unexpected error fetching order items:", err);
      setLoadingItems(false);
      setOrderItems([]);
    }
  };

  const handleUpdateOrderStatus = async (orderId: number, status: string) => {
    const payment_status = status === "completed" ? "paid" : undefined;
    const { error } = await supabase.from("orders").update({ status, payment_status }).eq("id", orderId);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Success", description: "Order status updated" });
      fetchOrders();
      fetchStats();
    }
  };

  const handleViewDetails = async (order: Order) => {
    setSelectedOrder(order);
    setFormData(order);
    setEditMode(false);
    setShowDialog(true);
    await fetchOrderItems(order.id);
  };

  const handleUpdateOrder = async () => {
    if (!selectedOrder) return;
    const { error } = await supabase
      .from("orders")
      .update({
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        customer_address: formData.customer_address,
        event_date: formData.event_date,
        notes: formData.notes,
      })
      .eq("id", selectedOrder.id);

    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Success", description: "Order updated successfully" });
      fetchOrders();
      fetchStats();
      setShowDialog(false);
      setEditMode(false);
    }
  };

  const handleDeleteOrder = async (orderId: number) => {
    if (!confirm("Are you sure you want to delete this order? This action cannot be undone.")) return;
    
    try {
      const { data: orderCheck, error: checkError } = await supabase
        .from("orders")
        .select("id")
        .eq("id", orderId)
        .single();
      
      if (checkError || !orderCheck) {
        toast({ 
          title: "Error", 
          description: "Order not found", 
          variant: "destructive" 
        });
        return;
      }

      const { error: itemsError } = await supabase
        .from("order_items")
        .delete()
        .eq("order_id", orderId);
      
      if (itemsError && itemsError.code !== "PGRST116") {
        console.error("Error deleting order items:", itemsError);
        toast({ 
          title: "Error", 
          description: `Failed to delete order items: ${itemsError.message}`, 
          variant: "destructive" 
        });
        return;
      }

      const { error, data } = await supabase
        .from("orders")
        .delete()
        .eq("id", orderId)
        .select();
      
      if (error) {
        console.error("Delete error:", error);
        toast({ 
          title: "Error", 
          description: `Failed to delete order: ${error.message}`, 
          variant: "destructive" 
        });
      } else if (!data || data.length === 0) {
        toast({ 
          title: "Permission Denied", 
          description: "You don't have permission to delete this order.", 
          variant: "destructive" 
        });
      } else {
        toast({ title: "Success", description: "Order deleted successfully" });
        fetchOrders();
        fetchStats();
        if (showDialog && selectedOrder?.id === orderId) {
          setShowDialog(false);
        }
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast({ 
        title: "Error", 
        description: "An unexpected error occurred", 
        variant: "destructive" 
      });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Order Management</h2>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Event Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>#{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.customer_name}</div>
                      <div className="text-sm text-muted-foreground">{order.customer_phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(order.event_date).toLocaleDateString()}</TableCell>
                  <TableCell>{formatCurrency(order.total_amount)}</TableCell>
                  <TableCell>
                    <Select value={order.status || "pending"} onValueChange={(v) => handleUpdateOrderStatus(order.id, v)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        order.payment_status === "paid"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.payment_status || "unpaid"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleViewDetails(order)}>
                      View Details
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDeleteOrder(order.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details #{selectedOrder?.id}</DialogTitle>
            <DialogDescription>View and manage customer order details.</DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Customer Name</Label>
                    {editMode ? (
                      <Input
                        value={formData.customer_name || ""}
                        onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm mt-1">{selectedOrder.customer_name}</p>
                    )}
                  </div>
                  <div>
                    <Label>Phone</Label>
                    {editMode ? (
                      <Input
                        value={formData.customer_phone || ""}
                        onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm mt-1">{selectedOrder.customer_phone}</p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <Label>Address</Label>
                    {editMode ? (
                      <Textarea
                        value={formData.customer_address || ""}
                        onChange={(e) => setFormData({ ...formData, customer_address: e.target.value })}
                        rows={2}
                      />
                    ) : (
                      <p className="text-sm mt-1">{selectedOrder.customer_address}</p>
                    )}
                  </div>
                  <div>
                    <Label>Event Date</Label>
                    {editMode ? (
                      <Input
                        type="date"
                        value={formData.event_date || ""}
                        onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                      />
                    ) : (
                      <p className="text-sm mt-1">{new Date(selectedOrder.event_date).toLocaleDateString()}</p>
                    )}
                  </div>
                  <div>
                    <Label>Order Date</Label>
                    <p className="text-sm mt-1">{new Date(selectedOrder.order_date).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Order Items */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Order Items</h3>
                {loadingItems ? (
                  <p className="text-sm text-muted-foreground">Loading items...</p>
                ) : orderItems.length > 0 ? (
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-center">Qty</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                          <TableHead className="text-right">Subtotal</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orderItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">
                              {item.menus?.name || "Unknown Item"}
                            </TableCell>
                            <TableCell>
                              <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                                {item.menus?.category || "-"}
                              </span>
                            </TableCell>
                            <TableCell className="text-center">{item.quantity}</TableCell>
                            <TableCell className="text-right">{formatCurrency(item.unit_price)}</TableCell>
                            <TableCell className="text-right font-medium">{formatCurrency(item.subtotal)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No items found</p>
                )}
              </div>

              <Separator />

              {/* Order Summary */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="font-medium capitalize">{selectedOrder.status || "pending"}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Payment Status:</span>
                    <span className={`font-medium capitalize ${
                      selectedOrder.payment_status === "paid" ? "text-green-600" : "text-yellow-600"
                    }`}>
                      {selectedOrder.payment_status || "unpaid"}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount:</span>
                    <span>{formatCurrency(selectedOrder.total_amount)}</span>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label>Notes</Label>
                {editMode ? (
                  <Textarea
                    value={formData.notes || ""}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    placeholder="Add notes about this order..."
                  />
                ) : (
                  <p className="text-sm mt-1 text-muted-foreground">{selectedOrder.notes || "No notes"}</p>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="mt-4">
            {!editMode ? (
              <>
                <Button onClick={() => setEditMode(true)}>Edit</Button>
                <Button variant="outline" onClick={() => setShowDialog(false)}>
                  Close
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handleUpdateOrder}>Save</Button>
                <Button variant="outline" onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
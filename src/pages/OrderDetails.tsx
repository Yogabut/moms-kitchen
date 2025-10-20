import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/utils/formatCurrency";
import { useToast } from "@/hooks/use-toast";
import { Calendar, Package, Clock, CheckCircle, XCircle } from "lucide-react";

interface Order {
  id: number;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  total_amount: number;
  event_date: string;
  order_date: string;
  status: string;
  payment_status: string;
  notes: string | null;
}

interface OrderItem {
  id: number;
  menu_item_id: number;
  quantity: number;
  unit_price: number;
  subtotal: number;
  menus: {
    name: string;
    category: string;
  } | null;
}

export default function OrderList() {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [editFormData, setEditFormData] = useState({
    customer_name: "",
    customer_phone: "",
    customer_address: "",
    event_date: "",
    notes: "",
  });

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      toast({ 
        title: "Not authenticated", 
        description: "Please login to view your orders",
        variant: "destructive" 
      });
      return;
    }

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("order_date", { ascending: false });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setOrders(data || []);
    }
  };

  const fetchOrderDetails = async (orderId: number) => {
    setLoading(true);
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

    if (error) {
      console.error("Error fetching order items:", error);
      toast({ 
        title: "Error", 
        description: "Failed to load order details", 
        variant: "destructive" 
      });
      setOrderItems([]);
    } else {
      setOrderItems(data || []);
    }
    setLoading(false);
  };

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    fetchOrderDetails(order.id);
  };

  const handleEditOrder = (order: Order) => {
    setEditFormData({
      customer_name: order.customer_name,
      customer_phone: order.customer_phone,
      customer_address: order.customer_address,
      event_date: order.event_date,
      notes: order.notes || "",
    });
    setEditDialog(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedOrder) return;

    const { error } = await supabase
      .from("orders")
      .update({
        customer_name: editFormData.customer_name,
        customer_phone: editFormData.customer_phone,
        customer_address: editFormData.customer_address,
        event_date: editFormData.event_date,
        notes: editFormData.notes,
      })
      .eq("id", selectedOrder.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Order updated successfully" });
      setEditDialog(false);
      fetchOrders();
      // Update selected order
      setSelectedOrder({
        ...selectedOrder,
        ...editFormData,
      });
    }
  };

  const handleCancelOrder = async (orderId: number) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    const { error } = await supabase
      .from("orders")
      .update({ status: "cancelled" })
      .eq("id", orderId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Order cancelled successfully" });
      fetchOrders();
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: "cancelled" });
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      case "processing":
        return <Clock className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case "completed":
        return "default";
      case "cancelled":
        return "destructive";
      case "processing":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Grid - Order List */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order List
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No orders yet</p>
                  <p className="text-sm text-muted-foreground">Start ordering to see your orders here</p>
                </div>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className={`border rounded-lg p-4 flex flex-col gap-3 hover:shadow-md transition-all cursor-pointer ${
                      selectedOrder?.id === order.id ? "border-primary bg-accent/5" : "border-border"
                    }`}
                    onClick={() => handleViewDetails(order)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">Order {order.event_date}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3" />
                          {new Date(order.order_date).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Calendar className="h-3 w-3" />
                          Event: {new Date(order.event_date).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                      <Badge variant={getStatusVariant(order.status)} className="flex items-center gap-1">
                        {getStatusIcon(order.status)}
                        {order.status}
                      </Badge>
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-muted-foreground">Total Amount</p>
                        <p className="text-lg font-bold text-primary">{formatCurrency(order.total_amount)}</p>
                      </div>
                      <Badge variant={order.payment_status === "paid" ? "default" : "outline"}>
                        {order.payment_status || "unpaid"}
                      </Badge>
                    </div>

                    <div className="flex gap-2 mt-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(order);
                        }}
                      >
                        View Details
                      </Button>
                      {order.status !== "cancelled" && order.status !== "completed" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedOrder(order);
                              handleEditOrder(order);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCancelOrder(order.id);
                            }}
                          >
                            Cancel
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Right Grid - Order Details */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                {selectedOrder ? `Order Details #${selectedOrder.id}` : "Select an order to view details"}
              </CardTitle>
            </CardHeader>
            <CardContent className="max-h-[calc(100vh-200px)] overflow-y-auto">
              {!selectedOrder ? (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No order selected</p>
                  <p className="text-sm text-muted-foreground">Click on an order to view its details</p>
                </div>
              ) : loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-sm text-muted-foreground">Loading details...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Customer Information */}
                  <div>
                    <h3 className="font-semibold mb-3">Customer Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Name:</span>
                        <span className="font-medium">{selectedOrder.customer_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Phone:</span>
                        <span className="font-medium">{selectedOrder.customer_phone}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-muted-foreground">Address:</span>
                        <span className="font-medium text-right">{selectedOrder.customer_address}</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Order Items Table */}
                  <div>
                    <h3 className="font-semibold mb-3">Order Items</h3>
                    {orderItems.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No items found</p>
                    ) : (
                      <div className="border rounded-lg overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Item</TableHead>
                              <TableHead className="text-center">Qty</TableHead>
                              <TableHead className="text-right">Price</TableHead>
                              <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {orderItems.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell>
                                  <div>
                                    <p className="font-medium">{item.menus?.name || "Unknown Item"}</p>
                                    {item.menus?.category && (
                                      <span className="text-xs text-muted-foreground">{item.menus.category}</span>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="text-center">{item.quantity}</TableCell>
                                <TableCell className="text-right">{formatCurrency(item.unit_price)}</TableCell>
                                <TableCell className="text-right font-medium">{formatCurrency(item.subtotal)}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Order Summary */}
                  <div>
                    <h3 className="font-semibold mb-3">Order Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge variant={getStatusVariant(selectedOrder.status)} className="flex items-center gap-1">
                          {getStatusIcon(selectedOrder.status)}
                          {selectedOrder.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Payment Status:</span>
                        <Badge variant={selectedOrder.payment_status === "paid" ? "default" : "outline"}>
                          {selectedOrder.payment_status || "unpaid"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Notes:</span>
                        <span className="text-right max-w-[200px]">{selectedOrder.notes || "-"}</span>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total Amount:</span>
                        <span className="text-primary">{formatCurrency(selectedOrder.total_amount)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Order #{selectedOrder?.id}</DialogTitle>
            <DialogDescription>Update your order information</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Customer Name</Label>
              <Input
                id="edit-name"
                value={editFormData.customer_name}
                onChange={(e) => setEditFormData({ ...editFormData, customer_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                value={editFormData.customer_phone}
                onChange={(e) => setEditFormData({ ...editFormData, customer_phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-address">Address</Label>
              <Textarea
                id="edit-address"
                value={editFormData.customer_address}
                onChange={(e) => setEditFormData({ ...editFormData, customer_address: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-event-date">Event Date</Label>
              <Input
                id="edit-event-date"
                type="date"
                value={editFormData.event_date}
                onChange={(e) => setEditFormData({ ...editFormData, event_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                value={editFormData.notes}
                onChange={(e) => setEditFormData({ ...editFormData, notes: e.target.value })}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialog(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
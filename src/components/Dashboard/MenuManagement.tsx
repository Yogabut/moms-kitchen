// src/components/Dashboard/MenuManagement.tsx
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { formatCurrency } from "@/utils/formatCurrency";

interface Menu {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  image_url: string | null;
  available: boolean | null;
}

const CATEGORIES = [
  "Appetizer",
  "Main Course",
  "Dessert",
  "Beverage",
  "Snack",
  "Traditional",
  "Modern",
  "Other"
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function MenuManagement({ toast }: any) {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image_url: "",
    available: true,
  });

  useEffect(() => {
    fetchMenus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMenus = async () => {
    const { data, error } = await supabase.from("menus").select("*").order("id");
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else setMenus(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const menuData = {
      name: formData.name,
      description: formData.description || null,
      price: parseFloat(formData.price),
      category: formData.category || null,
      image_url: formData.image_url || null,
      available: formData.available,
    };

    const action = editingMenu
      ? supabase.from("menus").update(menuData).eq("id", editingMenu.id)
      : supabase.from("menus").insert([menuData]);

    const { error } = await action;
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({
        title: "Success",
        description: editingMenu ? "Menu updated successfully" : "Menu created successfully",
      });
      resetForm();
      fetchMenus();
    }
  };

  const handleEdit = (menu: Menu) => {
    setEditingMenu(menu);
    setFormData({
      name: menu.name,
      description: menu.description || "",
      price: menu.price.toString(),
      category: menu.category || "",
      image_url: menu.image_url || "",
      available: menu.available ?? true,
    });
    setIsCreating(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this menu item?")) return;
    const { error } = await supabase.from("menus").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Success", description: "Menu deleted successfully" });
      fetchMenus();
    }
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", price: "", category: "", image_url: "", available: true });
    setEditingMenu(null);
    setIsCreating(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Menu Management</h2>
        {!isCreating && (
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add New Menu
          </Button>
        )}
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>{editingMenu ? "Edit Menu Item" : "Create New Menu Item"}</CardTitle>
            <CardDescription>
              {editingMenu ? "Update the menu item details below" : "Fill in the details to add a new menu item"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Menu Name *</Label>
                  <Input 
                    id="name"
                    value={formData.name} 
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                    placeholder="e.g., Nasi Goreng Spesial"
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price (Rp) *</Label>
                  <Input 
                    id="price"
                    type="number" 
                    step="0.01"
                    value={formData.price} 
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })} 
                    placeholder="e.g., 25000"
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input 
                    id="category"
                    value={formData.category} 
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })} 
                    placeholder="e.g., Appetizer, Main Course, Dessert"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image_url">Image URL</Label>
                  <Input 
                    id="image_url"
                    value={formData.image_url} 
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })} 
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description"
                  value={formData.description} 
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                  placeholder="Describe the menu item..."
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="available"
                  checked={formData.available} 
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })} 
                  className="w-4 h-4"
                />
                <Label htmlFor="available" className="cursor-pointer">Available for order</Label>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit">
                  {editingMenu ? "Update Menu" : "Create Menu"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Menu List</CardTitle>
          <CardDescription>Manage your menu items</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Available</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {menus.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    No menu items yet. Click "Add New Menu" to get started.
                  </TableCell>
                </TableRow>
              ) : (
                menus.map((menu) => (
                  <TableRow key={menu.id}>
                    <TableCell className="font-medium">{menu.name}</TableCell>
                    <TableCell>
                      {menu.category ? (
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                          {menu.category}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>{formatCurrency(menu.price)}</TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-1 rounded ${
                        menu.available 
                          ? "bg-green-100 text-green-700" 
                          : "bg-red-100 text-red-700"
                      }`}>
                        {menu.available ? "Available" : "Unavailable"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(menu)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(menu.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
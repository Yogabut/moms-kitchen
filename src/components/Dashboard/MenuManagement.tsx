// src/components/Dashboard/MenuManagement.tsx
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
        description: editingMenu ? "Menu updated" : "Menu created",
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
    if (!confirm("Delete this menu item?")) return;
    const { error } = await supabase.from("menus").delete().eq("id", id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Success", description: "Menu deleted" });
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
            <Plus className="mr-2 h-4 w-4" /> Add New
          </Button>
        )}
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>{editingMenu ? "Edit Menu" : "Create Menu"}</CardTitle>
            <CardDescription>
              {editingMenu ? "Update item details" : "Add new menu item"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Name *</Label>
                  <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                </div>
                <div>
                  <Label>Price *</Label>
                  <Input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
                </div>
              </div>
              <Label>Description</Label>
              <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
              <div className="flex items-center space-x-2">
                <input type="checkbox" checked={formData.available} onChange={(e) => setFormData({ ...formData, available: e.target.checked })} />
                <Label>Available</Label>
              </div>
              <div className="flex gap-2">
                <Button type="submit">{editingMenu ? "Update" : "Create"}</Button>
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Available</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {menus.map((menu) => (
                <TableRow key={menu.id}>
                  <TableCell>{menu.name}</TableCell>
                  <TableCell>{formatCurrency(menu.price)}</TableCell>
                  <TableCell>{menu.available ? "Yes" : "No"}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(menu)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(menu.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

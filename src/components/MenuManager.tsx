
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2 } from "lucide-react";
import { MenuItem } from "@/types/menu";

interface MenuManagerProps {
  menuItems: MenuItem[];
  onAddItem: (item: Omit<MenuItem, 'id'>) => void;
  onUpdateItem: (id: string, item: Omit<MenuItem, 'id'>) => void;
  onDeleteItem: (id: string) => void;
}

const MenuManager = ({ menuItems, onAddItem, onUpdateItem, onDeleteItem }: MenuManagerProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'mains' as MenuItem['category']
  });

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', category: 'mains' });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    const itemData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category
    };

    if (editingId) {
      onUpdateItem(editingId, itemData);
    } else {
      onAddItem(itemData);
    }
    resetForm();
  };

  const startEdit = (item: MenuItem) => {
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category
    });
    setEditingId(item.id);
  };

  const categorizedItems = menuItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const categoryTitles = {
    appetizers: 'Appetizers',
    mains: 'Main Courses',
    desserts: 'Desserts',
    beverages: 'Beverages'
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Menu Items</h2>
        <Button 
          onClick={() => setIsAdding(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      {(isAdding || editingId) && (
        <Card className="bg-white/10 backdrop-blur border-white/20">
          <CardHeader>
            <CardTitle className="text-white">
              {editingId ? 'Edit Menu Item' : 'Add New Menu Item'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Item name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
              <Textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              />
              <div className="flex gap-4">
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Price"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />
                <Select 
                  value={formData.category} 
                  onValueChange={(value: MenuItem['category']) => 
                    setFormData(prev => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="appetizers">Appetizers</SelectItem>
                    <SelectItem value="mains">Main Courses</SelectItem>
                    <SelectItem value="desserts">Desserts</SelectItem>
                    <SelectItem value="beverages">Beverages</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  {editingId ? 'Update' : 'Add'} Item
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {Object.entries(categoryTitles).map(([category, title]) => {
          const items = categorizedItems[category] || [];
          if (items.length === 0) return null;
          
          return (
            <div key={category}>
              <h3 className="text-xl font-semibold text-white mb-4">{title}</h3>
              <div className="grid gap-4">
                {items.map((item) => (
                  <Card key={item.id} className="bg-white/5 backdrop-blur border-white/10 hover:bg-white/10 transition-all">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-white text-lg">{item.name}</h4>
                          <p className="text-gray-300 text-sm mb-2">{item.description}</p>
                          <p className="text-green-400 font-bold">${item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEdit(item)}
                            className="border-white/20 hover:bg-white/10"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onDeleteItem(item.id)}
                            className="border-red-400/20 hover:bg-red-500/10 text-red-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MenuManager;

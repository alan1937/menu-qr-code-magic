
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MenuManager from "@/components/MenuManager";
import QRCodeGenerator from "@/components/QRCodeGenerator";
import { MenuItem } from "@/types/menu";

const Index = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    {
      id: "1",
      name: "Caesar Salad",
      description: "Fresh romaine lettuce with parmesan cheese and croutons",
      price: 12.99,
      category: "appetizers"
    },
    {
      id: "2", 
      name: "Grilled Salmon",
      description: "Atlantic salmon with lemon herb butter and seasonal vegetables",
      price: 24.99,
      category: "mains"
    },
    {
      id: "3",
      name: "Chocolate Lava Cake",
      description: "Warm chocolate cake with vanilla ice cream",
      price: 8.99,
      category: "desserts"
    }
  ]);

  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...item,
      id: Date.now().toString()
    };
    setMenuItems(prev => [...prev, newItem]);
  };

  const updateMenuItem = (id: string, updatedItem: Omit<MenuItem, 'id'>) => {
    setMenuItems(prev => 
      prev.map(item => 
        item.id === id ? { ...updatedItem, id } : item
      )
    );
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            QR Menu Generator
          </h1>
          <p className="text-xl text-gray-300">Create and manage your digital restaurant menu</p>
        </div>

        <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
          <CardContent className="p-6">
            <Tabs defaultValue="menu" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur">
                <TabsTrigger value="menu" className="data-[state=active]:bg-white/20">
                  Manage Menu
                </TabsTrigger>
                <TabsTrigger value="qr" className="data-[state=active]:bg-white/20">
                  Generate QR Code
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="menu" className="mt-6">
                <MenuManager
                  menuItems={menuItems}
                  onAddItem={addMenuItem}
                  onUpdateItem={updateMenuItem}
                  onDeleteItem={deleteMenuItem}
                />
              </TabsContent>
              
              <TabsContent value="qr" className="mt-6">
                <QRCodeGenerator menuItems={menuItems} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;

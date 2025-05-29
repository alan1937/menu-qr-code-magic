
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MenuItem, MenuData } from "@/types/menu";

const MenuDisplay = () => {
  const [searchParams] = useSearchParams();
  const [menuData, setMenuData] = useState<MenuData | null>(null);

  useEffect(() => {
    const dataParam = searchParams.get('data');
    if (dataParam) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(dataParam));
        setMenuData(parsedData);
      } catch (error) {
        console.error('Error parsing menu data:', error);
      }
    }
  }, [searchParams]);

  if (!menuData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <Card className="bg-white/10 backdrop-blur border-white/20">
          <CardContent className="p-8 text-center">
            <p className="text-white text-xl">Loading menu...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const categorizedItems = menuData.items.reduce((acc, item) => {
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

  const categoryEmojis = {
    appetizers: '🥗',
    mains: '🍽️',
    desserts: '🍰',
    beverages: '🥤'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {menuData.restaurantName}
          </h1>
          <p className="text-gray-300 text-lg">Digital Menu</p>
        </div>

        <div className="space-y-8">
          {Object.entries(categoryTitles).map(([category, title]) => {
            const items = categorizedItems[category] || [];
            if (items.length === 0) return null;

            return (
              <div key={category}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">{categoryEmojis[category as keyof typeof categoryEmojis]}</span>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
                </div>
                
                <div className="grid gap-4">
                  {items.map((item, index) => (
                    <Card 
                      key={item.id} 
                      className="bg-white/10 backdrop-blur border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-[1.02]"
                      style={{
                        animationDelay: `${index * 100}ms`
                      }}
                    >
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-xl font-semibold text-white leading-tight">
                                {item.name}
                              </h3>
                              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 ml-4 text-lg font-bold px-3 py-1">
                                ${item.price.toFixed(2)}
                              </Badge>
                            </div>
                            {item.description && (
                              <p className="text-gray-300 text-base leading-relaxed">
                                {item.description}
                              </p>
                            )}
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

        <div className="mt-12 text-center">
          <Card className="bg-white/5 backdrop-blur border-white/10">
            <CardContent className="p-6">
              <p className="text-gray-400 text-sm">
                Powered by QR Menu Generator • Scan, View, Enjoy
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MenuDisplay;


import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QrCode, Download } from "lucide-react";
import QRCode from "qrcode";
import { MenuItem } from "@/types/menu";

interface QRCodeGeneratorProps {
  menuItems: MenuItem[];
}

const QRCodeGenerator = ({ menuItems }: QRCodeGeneratorProps) => {
  const [restaurantName, setRestaurantName] = useState("My Restaurant");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [menuId] = useState(() => {
    // Get existing menu ID from localStorage or create a new one
    let savedMenuId = localStorage.getItem('menuId');
    if (!savedMenuId) {
      savedMenuId = `menu_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('menuId', savedMenuId);
    }
    return savedMenuId;
  });

  const saveMenuData = () => {
    const menuData = {
      restaurantName,
      items: menuItems,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem(`menu_data_${menuId}`, JSON.stringify(menuData));
  };

  const generateQRCode = async () => {
    try {
      // Save current menu data to localStorage
      saveMenuData();
      
      // Generate QR code with fixed menu ID
      const menuUrl = `${window.location.origin}/menu?id=${menuId}`;
      
      const qrDataUrl = await QRCode.toDataURL(menuUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#1e293b',
          light: '#ffffff'
        }
      });
      
      setQrCodeUrl(qrDataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  useEffect(() => {
    // Save menu data whenever it changes
    saveMenuData();
  }, [menuItems, restaurantName, menuId]);

  useEffect(() => {
    if (menuItems.length > 0) {
      generateQRCode();
    }
  }, [restaurantName, menuId]);

  return (
    <div className="space-y-6">
      <Card className="bg-white/10 backdrop-blur border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <QrCode className="w-5 h-5" />
            QR Code Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Restaurant Name
            </label>
            <Input
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
              placeholder="Enter your restaurant name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Menu ID (Fixed)
            </label>
            <Input
              value={menuId}
              readOnly
              className="bg-gray-600/20 border-gray-500/20 text-gray-300"
            />
            <p className="text-xs text-gray-400 mt-1">
              This ID keeps your QR code stable while you update your menu
            </p>
          </div>
        </CardContent>
      </Card>

      {qrCodeUrl && (
        <Card className="bg-white/10 backdrop-blur border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Your Menu QR Code</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-white p-4 rounded-lg">
                <img src={qrCodeUrl} alt="Menu QR Code" className="w-64 h-64" />
              </div>
              <div className="text-center">
                <p className="text-gray-300 text-sm mb-2">
                  Scan this QR code to view your menu
                </p>
                <p className="text-gray-400 text-xs">
                  Menu items: {menuItems.length} • Updates automatically
                </p>
              </div>
              <Button
                onClick={downloadQRCode}
                className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              >
                <Download className="w-4 h-4 mr-2" />
                Download QR Code
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {menuItems.length === 0 && (
        <Card className="bg-yellow-500/10 backdrop-blur border-yellow-500/20">
          <CardContent className="p-6 text-center">
            <p className="text-yellow-300">
              Add some menu items first to generate your QR code!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  function downloadQRCode() {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.download = `${restaurantName.replace(/\s+/g, '_')}_menu_qr.png`;
      link.href = qrCodeUrl;
      link.click();
    }
  }
};

export default QRCodeGenerator;

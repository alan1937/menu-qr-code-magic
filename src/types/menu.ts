
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'appetizers' | 'mains' | 'desserts' | 'beverages';
  image?: string;
}

export interface MenuData {
  restaurantName: string;
  items: MenuItem[];
}

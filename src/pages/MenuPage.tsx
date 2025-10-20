import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import MenuCard from '@/components/MenuCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface Menu {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  available: boolean;
}

export default function MenuPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const { data, error } = await supabase
        .from('menus')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      setMenus(data || []);
    } catch (error) {
      console.error('Error fetching menus:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...new Set(menus.map((menu) => menu.category))];
  
  const filteredMenus =
    selectedCategory === 'all'
      ? menus
      : menus.filter((menu) => menu.category === selectedCategory);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Header */}
        <section className="text-gray-800 py-10">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Menu Kami
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Pilihan menu terbaik untuk berbagai acara Anda
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filter Dropdown + Menu Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            
            {/* Dropdown Filter */}
            <div className="flex justify-start mb-8">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'Semua Menu' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Menu Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="border rounded-lg p-4 animate-pulse space-y-3"
                  >
                    <div className="h-40 bg-gray-200 rounded-md"></div>
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-8 bg-gray-300 rounded-md w-full"></div>
                  </div>
                ))}
              </div>
            ) : filteredMenus.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">
                  Belum ada menu tersedia
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMenus.map((menu) => (
                  <MenuCard key={menu.id} {...menu} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

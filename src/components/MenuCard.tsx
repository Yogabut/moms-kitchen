import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { formatCurrency } from '@/utils/formatCurrency';
import { useCartStore } from '@/store/cartStore';
import { toast } from 'sonner';

interface MenuCardProps {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url?: string;
  available: boolean;
}

export default function MenuCard({
  id,
  name,
  description,
  price,
  category,
  image_url,
  available,
}: MenuCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    if (!available) return;
    
    addItem({ id, name, price, image_url });
    toast.success(`${name} ditambahkan ke keranjang`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Card className="overflow-hidden h-full flex flex-col hover:shadow-soft transition-all duration-300">
        <div className="relative h-48 bg-muted overflow-hidden">
          {image_url ? (
            <img
              src={image_url}
              alt={name}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
              <span className="text-4xl">🍽️</span>
            </div>
          )}
          {!available && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="secondary" className="text-sm">
                Tidak Tersedia
              </Badge>
            </div>
          )}
          <Badge className="absolute top-2 right-2 bg-primary">
            {category}
          </Badge>
        </div>

        <CardContent className="flex-1 p-4">
          <h3 className="font-semibold text-lg mb-2 line-clamp-1">{name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {description}
          </p>
          <p className="text-xl font-bold text-primary">
            {formatCurrency(price)}
          </p>
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <Button
            onClick={handleAddToCart}
            disabled={!available}
            className="w-full gap-2"
            variant="default"
          >
            <ShoppingCart className="h-4 w-4" />
            Tambah ke Keranjang
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

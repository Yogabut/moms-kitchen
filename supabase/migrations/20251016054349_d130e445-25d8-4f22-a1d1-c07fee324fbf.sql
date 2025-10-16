-- Create menus table
CREATE TABLE public.menus (
  id bigint generated always as identity primary key,
  name text not null,
  description text,
  price numeric(10,2) not null,
  category text,
  image_url text,
  available boolean default true,
  created_at timestamp with time zone default now()
);

-- Create orders table
CREATE TABLE public.orders (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  customer_name text not null,
  customer_phone text not null,
  customer_address text not null,
  total_amount numeric(10,2) not null,
  event_date date not null,
  order_date timestamp with time zone default now(),
  status text default 'pending' check (status in ('pending', 'processing', 'completed', 'cancelled')),
  payment_status text default 'unpaid' check (payment_status in ('unpaid', 'paid')),
  notes text
);

-- Create order_items table
CREATE TABLE public.order_items (
  id bigint generated always as identity primary key,
  order_id bigint references public.orders(id) on delete cascade not null,
  menu_id bigint references public.menus(id) not null,
  menu_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10,2) not null,
  subtotal numeric(10,2) not null
);

-- Enable Row Level Security
ALTER TABLE public.menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for menus (public read, admin write)
CREATE POLICY "Anyone can view available menus"
  ON public.menus FOR SELECT
  USING (available = true);

CREATE POLICY "Authenticated users can view all menus"
  ON public.menus FOR SELECT
  TO authenticated
  USING (true);

-- RLS Policies for orders
CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
  ON public.orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for order_items
CREATE POLICY "Users can view their order items"
  ON public.order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create order items"
  ON public.order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Insert sample menu items
INSERT INTO public.menus (name, description, price, category, available) VALUES
('Nasi Box Ayam Goreng', 'Nasi putih, ayam goreng kremes, sambal, lalapan, kerupuk', 25000, 'Nasi Box', true),
('Nasi Box Rendang', 'Nasi putih, rendang sapi empuk, sambal, serundeng, kerupuk', 30000, 'Nasi Box', true),
('Paket Tumpeng Mini', 'Tumpeng nasi kuning lengkap untuk 10 porsi dengan lauk pauk', 250000, 'Tumpeng', true),
('Paket Prasmanan 50 Pax', 'Prasmanan lengkap untuk 50 orang: nasi, 3 lauk, sayur, sambal', 1500000, 'Prasmanan', true),
('Sate Ayam 10 Tusuk', 'Sate ayam bumbu kacang dengan lontong dan sambal kecap', 35000, 'Sate', true),
('Gado-Gado Jakarta', 'Sayuran segar dengan bumbu kacang kental dan kerupuk', 20000, 'Makanan Tradisional', true),
('Soto Ayam', 'Soto ayam kuah bening dengan nasi, telur, dan kerupuk', 22000, 'Makanan Tradisional', true),
('Nasi Uduk Komplit', 'Nasi uduk dengan ayam goreng, telur, tempe orek, kerupuk', 28000, 'Nasi Box', true);
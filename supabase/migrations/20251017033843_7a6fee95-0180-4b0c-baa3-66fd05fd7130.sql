-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');


-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Function to automatically assign 'user' role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  RETURN NEW;
END;
$$;

-- Trigger to auto-assign user role
CREATE TRIGGER on_auth_user_created_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Update menus table policies for admin access
DROP POLICY IF EXISTS "Anyone can view available menus" ON public.menus;
DROP POLICY IF EXISTS "Authenticated users can view all menus" ON public.menus;

CREATE POLICY "Anyone can view available menus"
  ON public.menus FOR SELECT
  USING (available = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage menus"
  ON public.menus FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- Update orders table policies for admin access
CREATE POLICY "Admins can view all orders"
  ON public.orders FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update orders"
  ON public.orders FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- Update order_items policies for admin access
CREATE POLICY "Admins can view all order items"
  ON public.order_items FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- Add missing columns to orders table
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS customer_name TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS customer_phone TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS customer_address TEXT NOT NULL DEFAULT '';

-- Add missing columns to order_items table
ALTER TABLE public.order_items
ADD COLUMN IF NOT EXISTS menu_name TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS unit_price NUMERIC(10,2) NOT NULL DEFAULT 0;

-- Insert admin user role (you'll need to get the actual user_id after creating the account)
-- This is a placeholder - you'll update it with the real admin user_id
-- INSERT INTO public.user_roles (user_id, role) VALUES ('YOUR-ADMIN-USER-ID', 'admin');
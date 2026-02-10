
-- Role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'tenant', 'owner');

-- User roles table (separate from profiles per security requirements)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Properties table
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  property_type TEXT NOT NULL DEFAULT '2BHK',
  price_per_month INTEGER NOT NULL,
  city TEXT NOT NULL,
  location TEXT NOT NULL,
  address TEXT,
  bhk INTEGER NOT NULL DEFAULT 2,
  amenities TEXT[] DEFAULT '{}',
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Property images table
CREATE TABLE public.property_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;

-- Wishlists table
CREATE TABLE public.wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, property_id)
);
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- Visits table
CREATE TABLE public.visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  proposed_date DATE NOT NULL,
  proposed_time TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  owner_proposed_date DATE,
  owner_proposed_time TEXT,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;

-- Reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content TEXT,
  status TEXT NOT NULL DEFAULT 'approved',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Auto-create profile & role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  );
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'tenant')::app_role
  );
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON public.properties FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_visits_updated_at BEFORE UPDATE ON public.visits FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS POLICIES

-- user_roles: users see own, admins see all
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- profiles: users see own, admins see all, public basic info
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Authenticated can view profiles" ON public.profiles FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can insert profiles" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- properties: everyone reads available, owners manage own, admins manage all
CREATE POLICY "Anyone can view properties" ON public.properties FOR SELECT USING (true);
CREATE POLICY "Owners can insert properties" ON public.properties FOR INSERT WITH CHECK (auth.uid() = owner_id AND public.has_role(auth.uid(), 'owner'));
CREATE POLICY "Owners can update own properties" ON public.properties FOR UPDATE USING (auth.uid() = owner_id AND public.has_role(auth.uid(), 'owner'));
CREATE POLICY "Owners can delete own properties" ON public.properties FOR DELETE USING (auth.uid() = owner_id AND public.has_role(auth.uid(), 'owner'));
CREATE POLICY "Admins can manage all properties" ON public.properties FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- property_images: public read, owner manage
CREATE POLICY "Anyone can view property images" ON public.property_images FOR SELECT USING (true);
CREATE POLICY "Owners can manage own property images" ON public.property_images FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.properties WHERE id = property_id AND owner_id = auth.uid())
);
CREATE POLICY "Owners can delete own property images" ON public.property_images FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.properties WHERE id = property_id AND owner_id = auth.uid())
);

-- wishlists: tenant private
CREATE POLICY "Tenants can view own wishlist" ON public.wishlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Tenants can add to wishlist" ON public.wishlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Tenants can remove from wishlist" ON public.wishlists FOR DELETE USING (auth.uid() = user_id);

-- visits: tenant and owner involved
CREATE POLICY "Users can view own visits" ON public.visits FOR SELECT USING (auth.uid() = tenant_id OR auth.uid() = owner_id);
CREATE POLICY "Tenants can create visits" ON public.visits FOR INSERT WITH CHECK (auth.uid() = tenant_id);
CREATE POLICY "Involved users can update visits" ON public.visits FOR UPDATE USING (auth.uid() = tenant_id OR auth.uid() = owner_id);

-- reviews: public read, users create own, admins manage
CREATE POLICY "Anyone can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Users can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage reviews" ON public.reviews FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Storage bucket for property images
INSERT INTO storage.buckets (id, name, public) VALUES ('property-images', 'property-images', true);

CREATE POLICY "Anyone can view property images storage" ON storage.objects FOR SELECT USING (bucket_id = 'property-images');
CREATE POLICY "Owners can upload property images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'property-images' AND auth.uid() IS NOT NULL);
CREATE POLICY "Owners can delete own property images storage" ON storage.objects FOR DELETE USING (bucket_id = 'property-images' AND auth.uid()::text = (storage.foldername(name))[1]);

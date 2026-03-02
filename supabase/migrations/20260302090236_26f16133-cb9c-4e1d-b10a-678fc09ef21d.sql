
CREATE TABLE public.owner_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  amount integer NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'completed',
  paid_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + interval '30 days'),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.owner_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view own payments" ON public.owner_payments
  FOR SELECT TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Owners can insert own payments" ON public.owner_payments
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Admins can view all payments" ON public.owner_payments
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- ⚡ QUICK FIX (run this if the table already exists):
-- ALTER TABLE public.tenants ALTER COLUMN hostel_id DROP NOT NULL;

-- Create the 'tenants' table
CREATE TABLE public.tenants (
    id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
    owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    hostel_id uuid REFERENCES public.hostels(id) ON DELETE SET NULL, -- nullable
    name text NOT NULL,
    whatsapp_number text NOT NULL,
    room_number text NOT NULL,
    rent_amount numeric NOT NULL,
    due_date integer NOT NULL, -- Day of the month (1-31)
    status text NOT NULL DEFAULT 'pending', -- 'pending' or 'paid'
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    PRIMARY KEY (id)
);

-- Turn on Row Level Security (RLS)
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

-- Policy: Owners can SELECT their own tenants
CREATE POLICY "Owners can view their own tenants"
    ON public.tenants
    FOR SELECT
    USING (auth.uid() = owner_id);

-- Policy: Owners can INSERT their own tenants
CREATE POLICY "Owners can insert their own tenants"
    ON public.tenants
    FOR INSERT
    WITH CHECK (auth.uid() = owner_id);

-- Policy: Owners can UPDATE their own tenants
CREATE POLICY "Owners can update their own tenants"
    ON public.tenants
    FOR UPDATE
    USING (auth.uid() = owner_id);

-- Policy: Owners can DELETE their own tenants
CREATE POLICY "Owners can delete their own tenants"
    ON public.tenants
    FOR DELETE
    USING (auth.uid() = owner_id);

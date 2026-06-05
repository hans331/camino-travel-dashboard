-- Checklist item attachments (예매 확인서·여권 사본·티켓 PDF 등)
CREATE TABLE checklist_attachments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID NOT NULL REFERENCES checklist_items(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  uploaded_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_checklist_attachments_item ON checklist_attachments(item_id);

ALTER TABLE checklist_attachments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all on checklist_attachments" ON checklist_attachments FOR ALL USING (true) WITH CHECK (true);

-- Storage bucket for attachments (public read, anon write — personal app)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'attachments',
  'attachments',
  true,
  20971520,  -- 20 MB per file
  ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read attachments" ON storage.objects
  FOR SELECT USING (bucket_id = 'attachments');

CREATE POLICY "Anon upload attachments" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'attachments');

CREATE POLICY "Anon delete attachments" ON storage.objects
  FOR DELETE USING (bucket_id = 'attachments');

-- Create storage bucket for deal documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'deal-documents',
  'deal-documents',
  false,
  20971520, -- 20MB limit
  ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
);

-- RLS policies for deal documents
CREATE POLICY "Authenticated users can upload deal documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'deal-documents');

CREATE POLICY "Authenticated users can view their own deal documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'deal-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Authenticated users can update their own deal documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'deal-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Authenticated users can delete their own deal documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'deal-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
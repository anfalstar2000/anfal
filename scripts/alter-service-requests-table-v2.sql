-- هذا السكربت يقوم بتعديل الأعمدة لجعلها تقبل القيم الفارغة (NULL)
-- يرجى تشغيل هذا السكربت في Supabase SQL Editor بعد تحديث الكود.

ALTER TABLE service_requests ALTER COLUMN project_goal DROP NOT NULL;
ALTER TABLE service_requests ALTER COLUMN has_identity DROP NOT NULL;
ALTER TABLE service_requests ALTER COLUMN budget DROP NOT NULL;
ALTER TABLE service_requests ALTER COLUMN deadline DROP NOT NULL;
ALTER TABLE service_requests ALTER COLUMN notes DROP NOT NULL;

-- هذا السكربت يقوم بتعديل الأعمدة لجعلها إلزامية (NOT NULL)
-- يرجى تشغيل هذا السكربت في Supabase SQL Editor بعد تحديث الكود.
-- إذا كنت قد قمت بتشغيل سكربت "alter-service-requests-table-v2.sql" سابقًا،
-- فهذا السكربت سيعيد قيود NOT NULL.

ALTER TABLE service_requests ALTER COLUMN project_goal SET NOT NULL;
ALTER TABLE service_requests ALTER COLUMN has_identity SET NOT NULL;
ALTER TABLE service_requests ALTER COLUMN budget SET NOT NULL;
ALTER TABLE service_requests ALTER COLUMN deadline SET NOT NULL;
ALTER TABLE service_requests ALTER COLUMN notes SET NOT NULL;

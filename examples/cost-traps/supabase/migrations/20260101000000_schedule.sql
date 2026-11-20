-- DELIBERATELY BROKEN EXAMPLE. DO NOT COPY INTO A REAL PROJECT.
-- Calls the summarise function (a paid AI call per item) every minute.
select cron.schedule(
  'summarise-every-minute',
  '* * * * *',
  $$
  select net.http_post(
    url := (select decrypted_secret from vault.decrypted_secrets where name = 'project_url') || '/functions/v1/summarise',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (select decrypted_secret from vault.decrypted_secrets where name = 'secret_key')
    ),
    body := '{"items": ["latest orders"]}'::jsonb
  );
  $$
);

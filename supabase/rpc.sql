-- Create RPC function to increment template usage safely
create or replace function increment_template_usage(template_id uuid)
returns void as $$
begin
  update templates
  set times_used = times_used + 1
  where id = template_id;
end;
$$ language plpgsql security definer;

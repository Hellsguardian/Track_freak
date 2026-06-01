-- Generate SQL migration for single active sleep session constraint
create unique index one_active_sleep_session
on sleep_sessions (is_active)
where is_active = true;

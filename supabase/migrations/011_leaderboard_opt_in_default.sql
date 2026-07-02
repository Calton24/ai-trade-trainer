-- leaderboard_opt_in should default false so new users are not blocked at onboarding confirm

alter table public.profiles
  alter column leaderboard_opt_in set default false;

update public.profiles
set leaderboard_opt_in = false
where onboarding_completed = false
  and leaderboard_opt_in = true
  and (username is null or trim(username) = '');

notify pgrst, 'reload schema';

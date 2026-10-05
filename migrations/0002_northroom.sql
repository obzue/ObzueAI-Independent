-- Northroom catalog, stalls, ledger, and profile assistant.

create table if not exists profiles (
  user_id text primary key,
  handle text unique not null,
  display_name text not null,
  role text not null default 'fan',
  city text not null default '',
  genres text not null default '',
  bio text not null default '',
  statement text not null default '',
  plan text not null default 'listener',
  ai_voice text not null default '',
  hue int not null default 18,
  guidelines_accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists artists (
  handle text primary key,
  name text not null,
  city text not null,
  genres text not null,
  bio text not null,
  hue int not null,
  owner_user_id text
);

create table if not exists releases (
  id text primary key,
  artist_handle text not null,
  artist_name text not null,
  title text not null,
  kind text not null,
  genre text not null,
  year int not null,
  price_cents int not null,
  blurb text not null,
  hue int not null,
  pattern int not null default 0,
  tracks jsonb not null,
  plays int not null default 0,
  split_note text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists merch (
  id text primary key,
  artist_handle text not null,
  artist_name text not null,
  title text not null,
  kind text not null,
  price_cents int not null,
  blurb text not null,
  hue int not null,
  stock int not null default 24,
  created_at timestamptz not null default now()
);

create table if not exists cart_items (
  id serial primary key,
  user_id text not null,
  item_type text not null,
  item_id text not null,
  qty int not null default 1,
  unique (user_id, item_type, item_id)
);

create table if not exists orders (
  id text primary key,
  user_id text not null,
  total_cents int not null,
  status text not null default 'settled',
  created_at timestamptz not null default now()
);

create table if not exists sales (
  id serial primary key,
  order_id text not null,
  seller_handle text not null,
  item_type text not null,
  item_id text not null,
  title text not null,
  qty int not null,
  line_cents int not null,
  created_at timestamptz not null default now()
);

create table if not exists library (
  user_id text not null,
  item_type text not null,
  item_id text not null,
  title text not null,
  artist_name text not null,
  acquired_at timestamptz not null default now(),
  primary key (user_id, item_type, item_id)
);

create table if not exists follows (
  user_id text not null,
  artist_handle text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, artist_handle)
);

create table if not exists fan_list (
  artist_handle text not null,
  user_id text not null,
  created_at timestamptz not null default now(),
  primary key (artist_handle, user_id)
);

create table if not exists messages (
  id serial primary key,
  artist_handle text not null,
  sender_user_id text not null,
  sender_name text not null,
  subject text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists ai_notes (
  id serial primary key,
  user_id text not null,
  kind text not null,
  prompt text not null,
  result text not null,
  created_at timestamptz not null default now()
);

create table if not exists reports (
  id serial primary key,
  user_id text not null,
  target text not null,
  reason text not null,
  detail text not null,
  created_at timestamptz not null default now()
);

create index if not exists releases_artist_idx on releases (artist_handle);
create index if not exists merch_artist_idx on merch (artist_handle);
create index if not exists cart_user_idx on cart_items (user_id);
create index if not exists sales_seller_idx on sales (seller_handle);
create index if not exists ai_notes_user_idx on ai_notes (user_id, created_at desc);
create index if not exists messages_artist_idx on messages (artist_handle);

insert into artists (handle, name, city, genres, bio, hue) values
  ('mira-sol', 'Mira Sol', 'Lisbon', 'Ambient soul', $nr$Mira writes late-room songs for people who stay after the lights come up. Copper Hour is the record; the stall is everything around it — pins, linen, and the mailing list she actually answers.$nr$, 22),
  ('night-dispatch', 'Night Dispatch', 'Glasgow', 'Post-punk', $nr$A three-piece that still believes a poster on a wet wall can outrun a playlist. Station Closed was tracked live, mistakes left in, sleeves printed in the practice room.$nr$, 210),
  ('juniper-hale', 'Juniper Hale', 'Asheville', 'Folk', $nr$Kitchen songs, porch songs, and the kind of folk that names the town. Juniper sells the record and a letterpress print of the kitchen window from the cover.$nr$, 92),
  ('kestrel', 'KESTREL', 'Seoul', 'Electronic', $nr$Low Orbit is club music with the ceiling removed. KESTREL keeps the masters, names the price, and ships a heavy hoodie for the people who heard it in a room first.$nr$, 198),
  ('sable-choir', 'Sable Choir', 'New Orleans', 'Gospel', $nr$Four voices, one room, windows open. Open Windows is a gospel record that borrowed an electronic pulse and gave it back warmer.$nr$, 36),
  ('rio-pell', 'Rio Pell', 'Chicago', 'Hip-hop', $nr$Receipts is a rap record about what actually cleared. Rio sells it direct, splits nothing he did not agree to, and prints the poster like a grocery slip.$nr$, 12)
on conflict (handle) do nothing;

insert into releases (id, artist_handle, artist_name, title, kind, genre, year, price_cents, blurb, hue, pattern, tracks, plays, split_note) values
  ('copper-hour', 'mira-sol', 'Mira Sol', 'Copper Hour', 'album', 'Ambient soul', 2025, 1200,
    $nr$Eight songs recorded between midnight and the bakery opening downstairs. Buy the album, keep it, play it loud enough that the hallway hears.$nr$,
    22, 0,
    $nr$[{"title":"First Light","duration":"3:42"},{"title":"Tile Floor","duration":"4:05"},{"title":"Copper Hour","duration":"5:11"},{"title":"Neighbor's Radio","duration":"2:58"},{"title":"Leave the Kettle","duration":"4:33"},{"title":"After the Tram","duration":"3:19"}]$nr$::jsonb,
    1840, 'Mira Sol 80 / string arranger 20'),
  ('lantern', 'mira-sol', 'Mira Sol', 'Lantern', 'single', 'Ambient soul', 2026, 200,
    $nr$A one-song lamp for the walk home. Name-your-price energy, set honestly at two dollars.$nr$,
    28, 1,
    $nr$[{"title":"Lantern","duration":"3:54"}]$nr$::jsonb,
    960, ''),
  ('station-closed', 'night-dispatch', 'Night Dispatch', 'Station Closed', 'album', 'Post-punk', 2024, 1000,
    $nr$The last train, the first argument, a bass amp that would not stay polite. Ten dollars, no middle desk.$nr$,
    210, 2,
    $nr$[{"title":"Platform 4","duration":"2:41"},{"title":"Wet Coat","duration":"3:16"},{"title":"Station Closed","duration":"4:02"},{"title":"Glass Ticket","duration":"3:28"},{"title":"Call Your Brother","duration":"2:55"}]$nr$::jsonb,
    2210, 'Band split, equal thirds'),
  ('kitchen-light', 'juniper-hale', 'Juniper Hale', 'Kitchen Light', 'album', 'Folk', 2025, 1100,
    $nr$Recorded at the table the songs are about. If you want the vinyl-feeling, this is the file and the story together.$nr$,
    92, 3,
    $nr$[{"title":"Flour on the Counter","duration":"3:07"},{"title":"Kitchen Light","duration":"4:22"},{"title":"County Line","duration":"3:44"},{"title":"Two Chairs","duration":"2:36"},{"title":"Leave the Porch On","duration":"4:01"}]$nr$::jsonb,
    1433, ''),
  ('porch-song', 'juniper-hale', 'Juniper Hale', 'Porch Song', 'single', 'Folk', 2026, 150,
    $nr$The song that would not fit on the album without making the album about the weather.$nr$,
    80, 4,
    $nr$[{"title":"Porch Song","duration":"3:11"}]$nr$::jsonb,
    640, ''),
  ('low-orbit', 'kestrel', 'KESTREL', 'Low Orbit', 'album', 'Electronic', 2026, 900,
    $nr$Dance music for rooms with bad clocks. Stems stay with KESTREL; you get the finished record and the right to play it.$nr$,
    198, 5,
    $nr$[{"title":"Apron","duration":"4:48"},{"title":"Low Orbit","duration":"6:02"},{"title":"Service Elevator","duration":"5:14"},{"title":"Paper Moon","duration":"3:57"},{"title":"Last Call, First Bus","duration":"5:33"}]$nr$::jsonb,
    3102, ''),
  ('open-windows', 'sable-choir', 'Sable Choir', 'Open Windows', 'album', 'Gospel', 2025, 1400,
    $nr$A choir record with the windows open so the street is in the mix. Pay the singers, not a catalog nobody can name.$nr$,
    36, 1,
    $nr$[{"title":"Open Windows","duration":"4:16"},{"title":"Second Sunday","duration":"3:52"},{"title":"Hold the Note","duration":"5:05"},{"title":"Walk Me to the Corner","duration":"3:27"},{"title":"Still Here","duration":"4:44"}]$nr$::jsonb,
    880, 'Choir pool 70 / production 30'),
  ('receipts', 'rio-pell', 'Rio Pell', 'Receipts', 'album', 'Hip-hop', 2026, 800,
    $nr$Twelve short verses and a beat tape that refuses to whisper. Eight dollars. The poster is separate, on purpose.$nr$,
    12, 2,
    $nr$[{"title":"Itemized","duration":"2:22"},{"title":"Receipts","duration":"3:01"},{"title":"Transfer","duration":"2:48"},{"title":"Back Room","duration":"3:14"},{"title":"Keep the Change","duration":"2:36"},{"title":"Closed Out","duration":"3:19"}]$nr$::jsonb,
    2677, 'Rio Pell 100')
on conflict (id) do nothing;

insert into merch (id, artist_handle, artist_name, title, kind, price_cents, blurb, hue, stock) values
  ('mira-pin', 'mira-sol', 'Mira Sol', 'Copper enamel pin', 'pin', 1200, $nr$A small lamp-shaped pin. Ships from Lisbon when the stall is live; this ledger records the order.$nr$, 24, 48),
  ('mira-tee', 'mira-sol', 'Mira Sol', 'Linen hour tee', 'tee', 3200, $nr$Undyed linen, copper stitch at the collar. One design, no fake scarcity.$nr$, 26, 30),
  ('night-poster', 'night-dispatch', 'Night Dispatch', 'Station Closed poster', 'poster', 1800, $nr$A1, printed like a timetable. The train still is not coming.$nr$, 210, 40),
  ('juniper-print', 'juniper-hale', 'Juniper Hale', 'Kitchen window print', 'print', 2400, $nr$Letterpress-feeling print of the cover window. Paper, not a screenshot.$nr$, 92, 22),
  ('juniper-cap', 'juniper-hale', 'Juniper Hale', 'Porch cap', 'hat', 2800, $nr$Washed canvas, small brim, the song title embroidered where a logo would usually shout.$nr$, 88, 18),
  ('kestrel-hoodie', 'kestrel', 'KESTREL', 'Low Orbit hoodie', 'hoodie', 6400, $nr$Heavy fleece, orbit line on the cuff, not the chest. Built for the cold walk out of the room.$nr$, 198, 16),
  ('sable-zine', 'sable-choir', 'Sable Choir', 'Open Windows zine', 'zine', 1600, $nr$Lyrics, a rehearsal photo, and the recipe for the lemonade they sold at the door.$nr$, 36, 36),
  ('rio-poster', 'rio-pell', 'Rio Pell', 'Receipt poster', 'poster', 1400, $nr$Looks like a grocery slip until you read the lines. Printed on receipt stock, on purpose.$nr$, 14, 50),
  ('rio-tee', 'rio-pell', 'Rio Pell', 'Itemized tee', 'tee', 3600, $nr$Heavyweight black, one column of type, no giant face.$nr$, 8, 28)
on conflict (id) do nothing;

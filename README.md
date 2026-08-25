# weddingSite
The wedding of an alcoholic couple

## Supabase upload setup

To enable visitor uploads on the wedding-day gallery page, create a `.env` file in this folder:

```bash
VITE_SUPABASE_URL=https://edlrlzoprgmtzghxoaie.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
```

Then create a public Storage bucket named `wedding-day-gallery` in Supabase.

Suggested storage policy setup for public event uploads:
1. Public read for the `wedding-day-gallery` bucket.
2. Insert allowed for `anon` users on `wedding-day-gallery` bucket objects.

Without these settings, the page can still be viewed but upload/refresh may fail.

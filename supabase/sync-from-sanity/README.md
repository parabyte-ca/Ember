# Sanity CMS Sync (Migration Stub)

This directory contains stub code for syncing content from Sanity CMS to Supabase.

## Schema Mapping

When migrating from Sanity to Supabase:

| Sanity Schema | Supabase Table | Notes |
|---|---|---|
| `prompt` | `prompts` | Map `_id` → `id`, `body` → `body`, `tier` → `tier` |
| `category` | `categories` | Map `slug.current` → `slug` |
| `pack` | `prompt_packs` | Map `isPremium` → `is_premium` |
| `packItem` | `prompt_pack_items` | Join table |

## TODO: Implement Sanity sync

1. Install `@sanity/client`
2. Configure SANITY_PROJECT_ID, SANITY_DATASET, SANITY_TOKEN env vars
3. Run GROQ queries to fetch all prompts
4. Upsert into Supabase using service role

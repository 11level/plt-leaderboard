# Prep Leaderboard

Prep Leaderboard attributes unique debate evidence cards to their cutters, removes
duplicates, and preserves an explanation for every scoring decision.

## Current vertical slice

- Next.js 16 operational leaderboard, member audit trail, and admin review queue.
- PostgreSQL/Supabase schema with tenant isolation, append-only card events, sync
  state, Drive channels, anomaly flags, and audit logs.
- Strict cutter-tag parser and normalization/Jaccard duplicate classifier.
- Existing Google Docs scanner retained while OAuth-backed incremental sync is wired.

The checked-in sample data is intentional preview data. Replace it through the
leaderboard query layer after applying `supabase/schema.sql`.

## Local setup

```bash
cp .env.example .env.local
cd web
npm install
npm run dev
```

Apply `supabase/schema.sql` in a Supabase SQL editor or with the Supabase CLI. Run
the parser suite with:

```bash
cd scanner
python3 -m unittest test_card_pipeline.py
```

## Google configuration

Create a Google Cloud OAuth web client, enable Drive and Docs APIs, and add
`GOOGLE_REDIRECT_URI` as an authorized redirect. Use `drive.file` with Google
Picker for a public app, or `drive.readonly` for a private team folder. OAuth
secrets and refresh tokens must only live in server-side environment variables
or the encrypted `drive_connections` field.

Drive notifications are signals, not payloads: acknowledge after verification,
enqueue an idempotent sync, consume changes from the stored page token, then
commit the new token only after processing succeeds. Renew watch channels before
`expires_at` and reconcile every 15 minutes.

## Production target

The selected production stack is Google Cloud Run for the Next.js application
and scanner worker, Supabase PostgreSQL for durable application data, and managed
Redis for the synchronization queue. `qianpingkang@gmail.com` is the configured
owner identity. The deployment must enforce this identity through Google
authentication and the `team_members` administrator role, not through a
browser-provided email value.

## Placeholder decisions

The confirmed configuration is Google sign-in, one shared folder scanned
recursively for Google Docs, strict `// username` tags on their own line,
existing `PEOPLE_TAGS` member aliases, and administrator review before duplicate
credit is resolved. The Google account named by `PLT_OWNER_EMAIL` controls Drive
configuration. Values that require an account or deployment are named in
`.env.example`; no credentials belong in chat or source control.

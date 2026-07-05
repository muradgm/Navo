# Security Baseline

## MVP

- No secrets in frontend code.
- No API keys committed.
- Use `.env.local` for local secrets.
- External links must use `rel="noopener noreferrer"`.
- Validate imported city/activity data.
- Escape/render text safely.

## Backend Later

- Helmet
- CORS allowlist
- rate limits
- input validation
- auth token expiry
- secure cookies if using cookie auth
- audit logs for account data changes

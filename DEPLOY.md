# Deployment Guide

## Environment Variables

When deploying to Vercel, ensure the following environment variables are set:

1.  `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL.
2.  `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key.
3.  `NEXT_PUBLIC_POWERSYNC_URL`: Your PowerSync instance URL.

## Build Command

Vercel should automatically detect Next.js.
Build command: `next build`
Install command: `npm install`

## Security Headers

`vercel.json` is included to set strict security headers (`X-Content-Type-Options`, `X-Frame-Options`).

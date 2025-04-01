# Stardew Sage Database and Feedback System

## Overview
This guide explains how our feedback system works. I've built it using Supabase as the database to collect user reactions to Stardew Sage while keeping everything secure and spam-free.

## Database Setup

### Supabase Integration
I'm using Supabase as our secure, PostgreSQL-based database. Here's how it's set up:

1. **Configuration**
   - Store your database URL and API keys in `.env.local`
   - Keep all sensitive credentials out of git using the updated `.gitignore`
   - All connections are encrypted with TLS

2. **Database Schema**
   ```sql
   -- Feedback clicks table
   create table feedback_clicks (
     id uuid default uuid_generate_v4() primary key,
     feedback_type text not null,
     ip_hash text not null,
     created_at timestamp with time zone default timezone('utc'::text, now())
   );
   ```

## Security Features

1. **Rate Limiting**
   - Users get one vote per IP every 30 days
   - IP addresses are hashed for privacy
   - Built-in rate-limiting middleware prevents spam

2. **Data Privacy**
   - No personal data stored
   - IP addresses are never stored in plain text
   - All database access requires authentication

3. **Environment Variables**
   - Put all your secrets in `.env.local`
   - Never commit sensitive data to git
   - Use separate environments for dev/prod

## How the Feedback System Works

1. **User Experience**
   - Users see two buttons: "Love it!" and "Needs work"
   - Buttons show instant feedback when clicked
   - Previous votes are remembered locally

2. **Data Flow**
   - Click → API request to `/api/feedback`
   - Server checks if vote is allowed
   - IP gets hashed for rate limiting
   - Vote saved to database
   - UI updates to show success

3. **Rate Limiting**
   - System checks for previous votes
   - Blocks repeat votes for 30 days
   - Shows friendly error messages

## Code Structure

1. **Frontend**
   - `FeedbackButtons.tsx`: Main UI component
   - Uses React state for quick updates
   - Handles loading and errors smoothly

2. **API Endpoints**
   - POST `/api/feedback`: Records votes
   - Uses secure rate limiting
   - Returns clear status codes

3. **Performance**
   - React cache() for fast responses
   - localStorage prevents extra requests
   - Automatic cache updates

## Security Checklist

1. **Code Security**
   - No secrets in the code
   - Protected API routes
   - Input validation everywhere

2. **Database Security**
   - Row Level Security on
   - Minimal permissions
   - Regular security checks

3. **Deployment**
   - HTTPS only
   - Security headers set
   - Dependencies kept updated

## Maintenance Tips

1. **Monitoring**
   - Watch for errors in logs
   - Check performance metrics
   - Monitor rate limits

2. **Backups**
   - Database backs up automatically
   - Can restore to any point
   - Test backups regularly

## Common Issues

1. **Rate Limit Hit**
   - User needs to wait 30 days
   - Shows clear error message
   - Prevents unnecessary API calls

2. **Connection Issues**
   - Auto-reconnects if needed
   - Has error handling
   - Shows user-friendly messages

## Future Plans

1. **Upcoming Features**
   - Analytics dashboard
   - More feedback options
   - Flexible rate limiting

2. **Security Updates**
   - More auth options
   - Better monitoring
   - Regular security reviews

## Need Help?
If you run into issues or need to modify the feedback system, check the TypeScript types in `src/lib/supabase/types.ts` and the API routes in `src/app/api/feedback/`. The code is well-commented and type-safe!

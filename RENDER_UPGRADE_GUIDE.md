# 🚀 Render Deployment Upgrade Guide

## Current Status: FREE TIER
- ⚠️ **Auto-sleeps after 15 minutes of inactivity**
- ⚠️ **30-60 second wake-up time on first request**
- ⚠️ **Not suitable for real customer traffic**

## Recommended: UPGRADE TO STARTER PLAN

### Why Upgrade?
1. **No Auto-Sleep**: Service stays awake 24/7
2. **Better Performance**: Faster response times
3. **Professional**: No waiting for customers
4. **Only $7/month**: Very affordable for a business tool

### How to Upgrade

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com
   - Click on your `auraweb` service

2. **Upgrade Plan**
   - Click "Settings" tab
   - Scroll to "Instance Type"
   - Change from "Free" to "Starter ($7/month)"
   - Click "Save Changes"

3. **Benefits You Get**
   - ✅ Always-on service (no sleep)
   - ✅ 512 MB RAM (same as free)
   - ✅ Better CPU priority
   - ✅ Can handle 500-1,000+ users
   - ✅ Professional uptime

### Cost Breakdown
- **Monthly**: $7 USD
- **Yearly**: $84 USD
- **Per day**: ~$0.23 USD

### Alternative: Keep Free Tier

If you want to keep the free tier for now:
- ⚠️ Expect slow first loads (30-60 seconds)
- ⚠️ Not recommended for real customers
- ✅ Good for testing and demos
- 💡 Consider using a "keep-alive" service (pings your site every 14 mins)

## Database Upgrade (Optional)

Your PostgreSQL database is also on free tier:
- **Current**: Free (limited storage, may sleep)
- **Upgrade**: Starter ($7/month) - 1 GB storage, always-on

**Total for production-ready setup**: $14/month
- $7 - Web service (always-on)
- $7 - Database (always-on, 1GB)

## When to Upgrade?

**Upgrade NOW if:**
- ✅ You're ready to accept real customers
- ✅ You want professional performance
- ✅ You can't afford slow first-load times

**Stay on FREE if:**
- ✅ Still testing/developing
- ✅ Just showing demos
- ✅ Not accepting real customers yet

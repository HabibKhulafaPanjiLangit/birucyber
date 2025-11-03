# Railway Environment Variables Configuration

## Required Variables

Set these in Railway Dashboard → Variables:

### Database (PostgreSQL Plugin)
```
DATABASE_URL=${{Postgres.DATABASE_URL}}
DIRECT_DATABASE_URL=${{Postgres.DATABASE_PRIVATE_URL}}
```

### Node Configuration
```
NODE_ENV=production
PORT=3000
```

## How to Set Variables in Railway:

1. Go to Railway Dashboard
2. Select your project
3. Click on your service
4. Go to "Variables" tab
5. Add these variables:

```
DATABASE_URL = ${{Postgres.DATABASE_URL}}
DIRECT_DATABASE_URL = ${{Postgres.DATABASE_PRIVATE_URL}}
NODE_ENV = production
PORT = 3000
```

## PostgreSQL Plugin

If PostgreSQL plugin is not connected:
1. Click "New" → "Database" → "Add PostgreSQL"
2. Variables will auto-populate
3. Redeploy the service

## Verify Variables

After setting, verify in Railway logs:
```
✓ DATABASE_URL is set
✓ DIRECT_DATABASE_URL is set
```

## Troubleshooting

**Error: Environment variable not found: DATABASE_URL**
- Go to Railway Variables tab
- Add: `DATABASE_URL=${{Postgres.DATABASE_URL}}`
- Redeploy

**Error: Can't reach database server**
- Check PostgreSQL plugin is running
- Verify DATABASE_URL format
- Check network connectivity

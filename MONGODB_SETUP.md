# MongoDB Atlas Setup Guide

## What is MongoDB Atlas?

MongoDB Atlas is a fully managed cloud database service. Instead of storing data in JSON files, your application will store data in a MongoDB database in the cloud.

### Benefits:
- ✅ Scalable cloud database
- ✅ Automatic backups
- ✅ Global distribution
- ✅ Built-in security
- ✅ Real-time monitoring
- ✅ No server maintenance

---

## Step 1: Create a MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click **"Sign Up"**
3. Create your account (free tier available)
4. Verify your email

---

## Step 2: Create a Cluster

1. After login, click **"Create"** to build a new database
2. Select **"Build a Database"**
3. Choose **"Shared"** (Free tier - perfect for development)
4. Select your preferred cloud provider and region (recommended: closest to your location)
5. Click **"Create Cluster"** (takes 2-3 minutes)

---

## Step 3: Create Database User

1. Go to **"Database Access"** from left sidebar
2. Click **"Add Database User"**
3. Enter username: `bombay_trooper`
4. Enter password: Use a strong password (save it!)
5. Select authentication method: **Password**
6. Under **Database User Privileges**, select **Atlas admin**
7. Click **"Add User"**

---

## Step 4: Allow Network Access

1. Go to **"Network Access"** from left sidebar
2. Click **"Add IP Address"**
3. Option A (For Development): Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - ⚠️ Not recommended for production
4. Click **"Confirm"**

---

## Step 5: Get Connection String

1. Go to **"Clusters"** and click **"Connect"** on your cluster
2. Select **"Drivers"**
3. Choose **"Node.js"** driver
4. Copy the connection string (looks like):
   ```
   mongodb+srv://bombay_trooper:PASSWORD@cluster0.xxxxx.mongodb.net/bombay_trooper?retryWrites=true&w=majority
   ```
5. Replace `PASSWORD` with your actual password
6. Replace `bombay_trooper` database name (the part after `/`)

---

## Step 6: Update Environment Variables

### Backend (.env)

```env
# Change from JSON to MongoDB
DATABASE_TYPE=mongodb
MONGODB_URI=mongodb+srv://bombay_trooper:your_password@cluster0.xxxxx.mongodb.net/bombay_trooper?retryWrites=true&w=majority

# Keep other variables
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_here
```

### Frontend (.env)

No changes needed - frontend doesn't interact with MongoDB directly.

---

## Step 7: Install MongoDB Package

In your `backend` directory:

```bash
npm install mongoose
```

---

## Step 8: Update Code

The application code has been updated to:
1. Auto-detect if using MongoDB or JSON
2. Create MongoDB models with schemas
3. Replace file-based operations with database queries

### What Changed:

**Before (JSON files):**
```javascript
const users = Database.readAll('users');
```

**After (MongoDB):**
```javascript
const users = await User.find();
```

---

## Step 9: Migrate Existing Data (Optional)

If you have existing JSON data:

```bash
cd backend
node scripts/migrateToMongoDB.js
```

This script will:
1. Read data from JSON files
2. Insert into MongoDB
3. Keep a backup

---

## Database Collections

MongoDB will automatically create these collections:

- `users` - User accounts
- `products` - Product listings
- `orders` - Customer orders
- `carts` - Shopping carts

---

## Viewing Data in MongoDB Atlas

1. Go to **"Collections"** in your cluster
2. Click on the database name (`bombay_trooper`)
3. Click on collection name (`users`, `products`, etc.)
4. View, filter, and search documents
5. Use MongoDB Atlas UI to manage data

---

## Troubleshooting

### Connection String Errors
- ✅ Check password has no special characters (or escape them)
- ✅ Verify IP is whitelisted
- ✅ Ensure database name is correct

### Mongoose Connection Errors
```
Error: connect ENOTFOUND cluster0.xxxxx.mongodb.net
```
**Solution:** Check internet connection and IP whitelist

### Duplicate Key Errors
```
MongoServerError: E11000 duplicate key error
```
**Solution:** Email must be unique per user

---

## Performance Tips

1. **Indexing:**
   - Email field is auto-indexed
   - Add indexes for frequently searched fields

2. **Connection Pooling:**
   - Mongoose handles this automatically
   - Default pool size: 10 connections

3. **Query Optimization:**
   - Use `.select()` to fetch only needed fields
   - Use `.lean()` for read-only queries

---

## Security Best Practices

1. **Never commit connection string** to Git
2. **Use strong passwords** (20+ characters)
3. **Rotate passwords** regularly (every 3 months)
4. **Use IP whitelist** instead of 0.0.0.0/0 in production
5. **Enable VPC peering** for production applications
6. **Use read-only users** for analytics/reporting

---

## Production Deployment Checklist

- ✅ Use dedicated database in MongoDB Atlas (not shared)
- ✅ Enable encrypted connections (TLS/SSL)
- ✅ Set up IP whitelist with specific IPs
- ✅ Enable authentication with strong password
- ✅ Configure automated backups
- ✅ Enable database activity monitor
- ✅ Set up alerts for unusual activity
- ✅ Use separate databases for dev/staging/prod

---

## Example Connection String Parts

```
mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
        ↑         ↑        ↑              ↑                    ↑                ↑
      Protocol  Username Password   Cluster   Database Name   Options
```

---

## Useful MongoDB Atlas Links

- [Atlas Dashboard](https://cloud.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [MongoDB Query Language](https://docs.mongodb.com/manual/crud/)
- [Atlas Security Best Practices](https://docs.mongodb.com/manual/security/)

---

## Next Steps

1. ✅ Create MongoDB Atlas account
2. ✅ Set up cluster and user
3. ✅ Get connection string
4. ✅ Update `.env` file
5. ✅ Install mongoose: `npm install mongoose`
6. ✅ Start backend: `npm start`
7. ✅ Verify connection in console logs

**You're ready to use MongoDB!** 🚀

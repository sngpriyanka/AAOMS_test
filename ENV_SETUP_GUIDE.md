# Environment Configuration Guide

This document explains how to set up environment variables for the Bombay Trooper project.

## Project Structure

```
AAXOMS/
├── backend/
│   ├── .env              (Do not commit - local only)
│   ├── .env.sample       (Template - commit this)
│   └── .gitignore        (Configured to ignore .env)
├── frontend/
│   ├── .env              (Do not commit - local only)
│   ├── .env.sample       (Template - commit this)
│   └── .gitignore        (Configured to ignore .env)
├── .gitignore            (Root level)
└── .env.sample           (Root level - quick reference)
```

## Quick Start

### 1. Backend Setup

```bash
cd backend
cp .env.sample .env
```

Edit `backend/.env` and update values:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_secret_key_here
FRONTEND_URL=https://aaoms-test.onrender.com
DATABASE_TYPE=json
ESEWA_MERCHANT_ID=EPAYTEST
KHALTI_PUBLIC_KEY=test_key_here
```

### 2. Frontend Setup

```bash
cd frontend
cp .env.sample .env
```

Edit `frontend/.env` and update values:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ESEWA_MERCHANT_ID=EPAYTEST
REACT_APP_KHALTI_PUBLIC_KEY=test_key_here
REACT_APP_ENV=development
```

## Environment Variables Reference

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` OR `production` |
| `JWT_SECRET` | JWT signing key | Generate a strong secret |
| `FRONTEND_URL` | Frontend origin | `https://aaoms-test.onrender.com` |
| `DATABASE_TYPE` | Database type | `json` (for development) |
| `DATABASE_PATH` | Data directory | `./data` |
| `ESEWA_MERCHANT_ID` | eSewa merchant ID | `EPAYTEST` (testing) |
| `ESEWA_PAYMENT_URL` | eSewa API URL | `https://uat.esewa.com.np/epay/main` |
| `KHALTI_PUBLIC_KEY` | Khalti public key | `test_public_key_xxx` |
| `KHALTI_SECRET_KEY` | Khalti secret key | `test_secret_key_xxx` |
| `EMAIL_SERVICE` | Email provider | `gmail` |
| `EMAIL_USER` | Email address | `your-email@gmail.com` |
| `EMAIL_PASSWORD` | App password | Generate from provider |

### Frontend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `http://localhost:5000/api` |
| `REACT_APP_ENV` | Environment | `development` OR `production` |
| `REACT_APP_ESEWA_MERCHANT_ID` | eSewa merchant ID | `EPAYTEST` |
| `REACT_APP_ESEWA_PAYMENT_URL` | eSewa API URL | `https://uat.esewa.com.np/epay/main` |
| `REACT_APP_KHALTI_PUBLIC_KEY` | Khalti public key | `test_public_key_xxx` |

## Payment Gateway Setup

### eSewa (Testing)

1. Get test credentials from [eSewa Developer](https://esewa.com.np/)
2. Use Merchant ID: `EPAYTEST` for testing
3. Use URL: `https://uat.esewa.com.np/epay/main` for testing

### Khalti (Testing)

1. Get test credentials from [Khalti Developers](https://khalti.com/developers/)
2. Use test public key format: `test_public_key_xxxxxxxxxxxxxxx`
3. API endpoint: `https://khalti.com/api/payment/`

## Production Deployment

Before deploying to production:

1. **Generate strong JWT secret:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. **Update environment variables:**
   - Change `NODE_ENV` to `production`
   - Use real payment gateway credentials
   - Update `FRONTEND_URL` and `REACT_APP_API_URL` to production domains
   - Use production email service credentials

3. **Security checklist:**
   - ✅ Never commit `.env` files
   - ✅ Always use strong JWT_SECRET
   - ✅ Use different credentials for dev/staging/prod
   - ✅ Set secure CORS origins
   - ✅ Use HTTPS in production
   - ✅ Rotate secrets regularly

## Important Notes

- **Never commit `.env` files** - Only commit `.env.sample` files
- **Never expose secrets** in code or logs
- **Use `.env.sample` as template** for onboarding new developers
- **Security first** - Treat secrets like passwords
- **Document changes** when adding new environment variables

## Troubleshooting

### Backend not connecting to frontend
- Check `FRONTEND_URL` in backend `.env`
- Verify CORS settings match

### API calls 404
- Check `REACT_APP_API_URL` in frontend `.env`
- Verify backend is running on correct port

### Payment gateway errors
- Verify merchant ID is correct
- Check payment URLs match environment
- Ensure test credentials are being used in dev

## Support

For more details, see:
- `backend/.env.sample` - Detailed backend configuration
- `frontend/.env.sample` - Detailed frontend configuration

# 💳 Chapa Payment Integration Setup

## Overview

Chapa is Ethiopia's leading payment gateway supporting:
- 📱 **Telebirr** - Mobile money
- 🏦 **CBE Birr** - Bank mobile banking
- 💳 **Debit/Credit Cards** - Visa, MasterCard
- 🏧 **Bank Transfer** - Direct bank payments

## Getting Started

### Step 1: Create Chapa Account

1. **Sign up**: https://dashboard.chapa.co/register
2. **Verify your business**:
   - Business registration document
   - Valid ID card
   - Business TIN number
3. **Complete KYC verification**

### Step 2: Get API Keys

1. **Login to Chapa Dashboard**: https://dashboard.chapa.co
2. **Go to Settings** → **API Keys**
3. **Copy your Secret Key** (starts with `CHASECK_`)

### Step 3: Configure Environment Variables

Add these to your **Render Environment Variables**:

```
CHAPA_SECRET_KEY=CHASECK_your-secret-key-here
CHAPA_CALLBACK_URL=https://auraweb-6.onrender.com/api/submissions/payment_callback/
CHAPA_RETURN_URL=https://auraweb-6.onrender.com/payment-success
```

### Step 4: Webhook Setup

1. **In Chapa Dashboard**, go to **Settings** → **Webhooks**
2. **Add webhook URL**: `https://auraweb-6.onrender.com/api/submissions/payment_callback/`
3. **Select events**:
   - `payment.success`
   - `payment.failed`

---

## How It Works

### Payment Flow

```
Customer submits form
         ↓
Admin reviews submission
         ↓
Admin clicks "Send Payment Link"
         ↓
Chapa payment page opens for customer
         ↓
Customer pays via Telebirr/CBE/Card
         ↓
Chapa notifies our webhook
         ↓
Submission status → "Payment Received"
         ↓
Development begins
```

### Package Pricing

| Package | Full Price | 50% Deposit |
|---------|------------|-------------|
| Starter | 7,000 ETB | 3,500 ETB |
| Business | 10,000 ETB | 5,000 ETB |
| Dynamic | 14,999 ETB | 7,500 ETB |

---

## API Endpoints

### Create Payment Link
```http
POST /api/submissions/{id}/create_payment/
Authorization: Token {admin_token}
```

**Response:**
```json
{
  "checkout_url": "https://checkout.chapa.co/...",
  "tx_ref": "auraweb-abc123-xyz789",
  "amount": 5000,
  "currency": "ETB"
}
```

### Verify Payment Status
```http
GET /api/submissions/verify_payment/?tx_ref={tx_ref}
```

**Response:**
```json
{
  "status": "paid",
  "business_name": "Test Business",
  "package": "business"
}
```

### Payment Webhook (for Chapa)
```http
POST /api/submissions/payment_callback/
```

---

## Testing

### Test Mode
Chapa provides test credentials for development:
- Use test phone numbers
- No real money is charged

### Test Phone Numbers
```
Telebirr: 0911000000
CBE Birr: 0911111111
Card: Use test card from Chapa docs
```

---

## Troubleshooting

### Payment Link Not Generated?
1. Check CHAPA_SECRET_KEY is correct
2. Verify customer has valid email/phone
3. Check Render logs for errors

### Webhook Not Working?
1. Verify webhook URL in Chapa dashboard
2. Check CORS allows Chapa domains
3. Ensure endpoint is accessible (no auth required)

### Payment Status Not Updating?
1. Check webhook is configured
2. Verify tx_ref matches in database
3. Check Chapa dashboard for payment status

---

## Security Notes

1. **Never expose** CHAPA_SECRET_KEY in frontend
2. **Validate** all webhook requests
3. **Use HTTPS** for all payment endpoints
4. **Log** all payment attempts

---

## Support

- **Chapa Documentation**: https://developer.chapa.co/
- **Chapa Support**: support@chapa.co
- **Test Dashboard**: https://dashboard.chapa.co

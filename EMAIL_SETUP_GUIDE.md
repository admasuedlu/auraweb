# 📧 Email Notifications Setup Guide

## ✅ Feature Added: Automatic Email Notifications

Your AuraWeb application now sends beautiful HTML emails automatically when:
1. ✅ **Customer submits a form** → They receive a confirmation email
2. ✅ **Customer submits a form** → You (admin) receive a notification email
3. ✅ **Payment request sent** → Customer receives payment link (future feature)

---

## 🔧 Setup Instructions

### Step 1: Get Gmail App Password

1. **Go to your Gmail account**
   - Visit: https://myaccount.google.com/security

2. **Enable 2-Step Verification** (if not already enabled)
   - Click "2-Step Verification"
   - Follow the setup process

3. **Create App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select app: "Mail"
   - Select device: "Other (Custom name)"
   - Enter name: "AuraWeb"
   - Click "Generate"
   - **Copy the 16-character password** (you'll need this)

---

### Step 2: Configure Render Environment Variables

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com
   - Click on your `auraweb` service

2. **Add Environment Variables**
   - Click "Environment" tab
   - Add these variables:

```
EMAIL_HOST_USER = your-email@gmail.com
EMAIL_HOST_PASSWORD = your-16-char-app-password
DEFAULT_FROM_EMAIL = AuraWeb Solutions <your-email@gmail.com>
ADMIN_EMAIL = your-email@gmail.com
```

3. **Save Changes**
   - Click "Save Changes"
   - Render will automatically redeploy

---

### Step 3: Test Locally (Optional)

Create a `.env` file in your project root:

```env
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=AuraWeb Solutions <your-email@gmail.com>
ADMIN_EMAIL=your-email@gmail.com
```

Then test:
```bash
python backend/manage.py shell
```

```python
from submissions.models import Submission
from auraweb_backend.email_service import send_customer_confirmation

# Get a test submission
submission = Submission.objects.first()
send_customer_confirmation(submission)
```

---

## 📧 Email Templates

### Customer Confirmation Email
- ✅ Professional design with your branding
- ✅ Shows submission details
- ✅ Explains next steps
- ✅ Includes contact information

### Admin Notification Email
- ✅ All submission details
- ✅ Direct link to admin dashboard
- ✅ Easy to read format

---

## 🎨 Email Features

- **Beautiful HTML Design**: Professional, responsive emails
- **Mobile-Friendly**: Looks great on all devices
- **Branded**: Uses your business colors and style
- **Informative**: Clear next steps for customers

---

## ⚠️ Important Notes

1. **Gmail Limits**: Gmail allows ~500 emails/day for free accounts
2. **For Production**: Consider using:
   - **SendGrid** (100 emails/day free)
   - **Mailgun** (5,000 emails/month free)
   - **AWS SES** (62,000 emails/month free)

3. **Email Deliverability**:
   - Emails might go to spam initially
   - Ask customers to add your email to contacts
   - Consider using a custom domain email

---

## 🔄 Alternative: Use SendGrid (Recommended for Production)

SendGrid is more reliable for business emails:

1. **Sign up**: https://signup.sendgrid.com/
2. **Get API Key**: Settings → API Keys → Create API Key
3. **Update Render Environment Variables**:

```
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_HOST_USER=apikey
EMAIL_HOST_PASSWORD=your-sendgrid-api-key
DEFAULT_FROM_EMAIL=AuraWeb Solutions <noreply@yourdomain.com>
```

---

## 🧪 Testing

After setup, test by:
1. Visit your live site: https://auraweb-6.onrender.com
2. Submit a test form with a real email address
3. Check your inbox for confirmation email
4. Check admin email for notification

---

## 📊 What Happens Next

When a customer submits:
1. ✅ Form data saved to database
2. ✅ Customer receives confirmation email
3. ✅ You receive notification email with all details
4. ✅ You can reply directly to the customer

---

## 🎯 Next Features to Add

After email is working:
- 💳 Payment integration (Chapa)
- 📊 Enhanced admin dashboard
- 📱 WhatsApp notifications
- 📈 Analytics tracking

---

## 🆘 Troubleshooting

**Emails not sending?**
- Check Render logs for errors
- Verify environment variables are set
- Check Gmail app password is correct
- Ensure 2-Step Verification is enabled

**Emails going to spam?**
- Use a custom domain email
- Add SPF/DKIM records
- Ask customers to whitelist your email

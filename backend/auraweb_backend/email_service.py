"""
Email notification service for AuraWeb
Sends emails when customers submit website requests
"""

from django.core.mail import send_mail, EmailMultiAlternatives
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags
import os


def send_customer_confirmation(submission):
    """
    Send confirmation email to customer after submission
    """
    subject = f"✅ Your Website Request Received - {submission.business_name}"
    
    # HTML email content
    html_message = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                       color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
            .content {{ background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }}
            .info-box {{ background: white; padding: 20px; margin: 20px 0; border-radius: 8px; 
                        border-left: 4px solid #667eea; }}
            .footer {{ text-align: center; margin-top: 30px; color: #666; font-size: 14px; }}
            .button {{ background: #667eea; color: white; padding: 12px 30px; text-decoration: none; 
                      border-radius: 6px; display: inline-block; margin: 20px 0; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎉 Thank You for Choosing AuraWeb!</h1>
            </div>
            <div class="content">
                <p>Dear <strong>{submission.business_name}</strong>,</p>
                
                <p>We've successfully received your website development request. Our team is excited to bring your vision to life!</p>
                
                <div class="info-box">
                    <h3>📋 Submission Details:</h3>
                    <p><strong>Package:</strong> {submission.package_id.upper()}</p>
                    <p><strong>Business Type:</strong> {submission.business_type}</p>
                    <p><strong>Contact:</strong> {submission.phone}</p>
                    <p><strong>Submission ID:</strong> {submission.id}</p>
                </div>
                
                <h3>⏱️ What Happens Next?</h3>
                <ol>
                    <li><strong>Review (24 hours):</strong> Our team will review your requirements</li>
                    <li><strong>Payment Invoice:</strong> You'll receive a payment link for the 50% deposit</li>
                    <li><strong>Development Starts:</strong> Once payment is confirmed, we begin building</li>
                    <li><strong>Delivery:</strong> Your website will be ready within the agreed timeline</li>
                </ol>
                
                <div style="text-align: center;">
                    <a href="https://auraweb-6.onrender.com" class="button">Visit Our Website</a>
                </div>
                
                <p><strong>Questions?</strong> Reply to this email or call us at +251 911 234 567</p>
            </div>
            <div class="footer">
                <p>AuraWeb Solutions - Fast, Professional Website Development</p>
                <p>Addis Ababa, Ethiopia</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    plain_message = strip_tags(html_message)
    
    try:
        if submission.email:
            send_mail(
                subject=subject,
                message=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[submission.email],
                html_message=html_message,
                fail_silently=False,
            )
            return True
    except Exception as e:
        print(f"Error sending customer email: {e}")
        return False


def send_admin_notification(submission):
    """
    Send notification to admin when new submission arrives
    """
    admin_email = os.environ.get('ADMIN_EMAIL', 'admin@auraweb.com')
    
    subject = f"🔔 New Website Request: {submission.business_name}"
    
    html_message = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: #1e293b; color: white; padding: 20px; border-radius: 8px 8px 0 0; }}
            .content {{ background: #f8fafc; padding: 20px; border-radius: 0 0 8px 8px; }}
            .detail {{ background: white; padding: 15px; margin: 10px 0; border-radius: 6px; }}
            .label {{ color: #64748b; font-size: 12px; text-transform: uppercase; }}
            .value {{ color: #1e293b; font-weight: bold; margin-top: 5px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>🔔 New Submission Alert</h2>
                <p>A new customer has submitted a website request</p>
            </div>
            <div class="content">
                <div class="detail">
                    <div class="label">Business Name</div>
                    <div class="value">{submission.business_name}</div>
                </div>
                
                <div class="detail">
                    <div class="label">Package</div>
                    <div class="value">{submission.package_id.upper()}</div>
                </div>
                
                <div class="detail">
                    <div class="label">Business Type</div>
                    <div class="value">{submission.business_type}</div>
                </div>
                
                <div class="detail">
                    <div class="label">Contact Information</div>
                    <div class="value">
                        📞 {submission.phone}<br>
                        📧 {submission.email or 'Not provided'}<br>
                        📍 {submission.address}
                    </div>
                </div>
                
                <div class="detail">
                    <div class="label">About Business</div>
                    <div class="value">{submission.about_us}</div>
                </div>
                
                <div class="detail">
                    <div class="label">Services</div>
                    <div class="value">{', '.join(submission.services) if submission.services else 'None'}</div>
                </div>
                
                <div class="detail">
                    <div class="label">Design Preferences</div>
                    <div class="value">
                        Style: {submission.theme_style}<br>
                        Color: {submission.primary_color}<br>
                        Language: {submission.language}
                    </div>
                </div>
                
                <div class="detail">
                    <div class="label">Submission ID</div>
                    <div class="value">{submission.id}</div>
                </div>
                
                <p style="margin-top: 20px;">
                    <a href="https://auraweb-6.onrender.com/admin" 
                       style="background: #3b82f6; color: white; padding: 12px 24px; 
                              text-decoration: none; border-radius: 6px; display: inline-block;">
                        View in Admin Dashboard
                    </a>
                </p>
            </div>
        </div>
    </body>
    </html>
    """
    
    plain_message = strip_tags(html_message)
    
    try:
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[admin_email],
            html_message=html_message,
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f"Error sending admin email: {e}")
        return False


def send_payment_request(submission, payment_link):
    """
    Send payment request email to customer with Chapa payment link
    """
    subject = f"💳 Payment Request - {submission.business_name} Website"
    
    html_message = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background: linear-gradient(135deg, #10b981 0%, #059669 100%); 
                       color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }}
            .content {{ background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }}
            .payment-box {{ background: white; padding: 30px; margin: 20px 0; border-radius: 8px; 
                           border: 2px solid #10b981; text-align: center; }}
            .amount {{ font-size: 36px; color: #10b981; font-weight: bold; margin: 20px 0; }}
            .button {{ background: #10b981; color: white; padding: 15px 40px; text-decoration: none; 
                      border-radius: 8px; display: inline-block; margin: 20px 0; font-size: 18px; font-weight: bold; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>💳 Payment Request</h1>
            </div>
            <div class="content">
                <p>Dear <strong>{submission.business_name}</strong>,</p>
                
                <p>Great news! We've reviewed your requirements and are ready to start building your website.</p>
                
                <div class="payment-box">
                    <h3>50% Deposit Payment</h3>
                    <div class="amount">Amount Due</div>
                    <p style="font-size: 14px; color: #666;">Payment securely processed by Chapa</p>
                    
                    <a href="{payment_link}" class="button">Pay Now with Chapa</a>
                    
                    <p style="font-size: 12px; color: #666; margin-top: 20px;">
                        Secure payment via Mobile Money, Bank Transfer, or Card
                    </p>
                </div>
                
                <h3>📋 What You're Paying For:</h3>
                <ul>
                    <li><strong>Package:</strong> {submission.package_id.upper()}</li>
                    <li><strong>Business:</strong> {submission.business_name}</li>
                    <li><strong>Submission ID:</strong> {submission.id}</li>
                </ul>
                
                <p><strong>⚠️ Important:</strong> Development will begin immediately after payment confirmation.</p>
                
                <p>Questions? Contact us at +251 911 234 567</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    plain_message = strip_tags(html_message)
    
    try:
        if submission.email:
            send_mail(
                subject=subject,
                message=plain_message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[submission.email],
                html_message=html_message,
                fail_silently=False,
            )
            return True
    except Exception as e:
        print(f"Error sending payment email: {e}")
        return False

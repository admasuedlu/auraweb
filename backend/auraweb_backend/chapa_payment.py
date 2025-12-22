"""
Chapa Payment Integration for AuraWeb
Handles payment initialization and verification for Ethiopian payments
Documentation: https://developer.chapa.co/
"""

import requests
import os
import uuid
from django.conf import settings


class ChapaPayment:
    """
    Chapa Payment Gateway Integration
    Supports: Mobile Money (Telebirr, CBE Birr), Bank Transfer, Card Payments
    """
    
    def __init__(self):
        self.secret_key = os.environ.get('CHAPA_SECRET_KEY', '')
        self.base_url = 'https://api.chapa.co/v1'
        self.callback_url = os.environ.get('CHAPA_CALLBACK_URL', 'https://auraweb-6.onrender.com/api/payments/callback/')
        self.return_url = os.environ.get('CHAPA_RETURN_URL', 'https://auraweb-6.onrender.com/payment-success')
    
    def get_headers(self):
        return {
            'Authorization': f'Bearer {self.secret_key}',
            'Content-Type': 'application/json'
        }
    
    def initialize_payment(self, submission, amount):
        """
        Initialize a Chapa payment for a submission
        
        Args:
            submission: Submission model instance
            amount: Payment amount in ETB
            
        Returns:
            dict: {'success': bool, 'checkout_url': str, 'tx_ref': str}
        """
        tx_ref = f"auraweb-{submission.id}-{uuid.uuid4().hex[:8]}"
        
        payload = {
            'amount': str(amount),
            'currency': 'ETB',
            'email': submission.email or 'customer@auraweb.com',
            'first_name': submission.business_name.split()[0] if submission.business_name else 'Customer',
            'last_name': submission.business_name.split()[-1] if len(submission.business_name.split()) > 1 else 'AuraWeb',
            'phone_number': submission.phone,
            'tx_ref': tx_ref,
            'callback_url': self.callback_url,
            'return_url': f"{self.return_url}?tx_ref={tx_ref}",
            'customization': {
                'title': 'AuraWeb Payment',
                'description': f'Website development deposit for {submission.business_name}',
                'logo': 'https://auraweb-6.onrender.com/static/logo.png'
            },
            'meta': {
                'submission_id': submission.id,
                'package': submission.package_id,
                'business_name': submission.business_name
            }
        }
        
        try:
            response = requests.post(
                f'{self.base_url}/transaction/initialize',
                json=payload,
                headers=self.get_headers()
            )
            
            data = response.json()
            
            if data.get('status') == 'success':
                return {
                    'success': True,
                    'checkout_url': data['data']['checkout_url'],
                    'tx_ref': tx_ref
                }
            else:
                return {
                    'success': False,
                    'error': data.get('message', 'Payment initialization failed')
                }
                
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def verify_payment(self, tx_ref):
        """
        Verify a payment using the transaction reference
        
        Args:
            tx_ref: Transaction reference from Chapa
            
        Returns:
            dict: {'success': bool, 'verified': bool, 'data': dict}
        """
        try:
            response = requests.get(
                f'{self.base_url}/transaction/verify/{tx_ref}',
                headers=self.get_headers()
            )
            
            data = response.json()
            
            if data.get('status') == 'success':
                return {
                    'success': True,
                    'verified': data['data']['status'] == 'success',
                    'data': data['data']
                }
            else:
                return {
                    'success': False,
                    'verified': False,
                    'error': data.get('message', 'Verification failed')
                }
                
        except Exception as e:
            return {
                'success': False,
                'verified': False,
                'error': str(e)
            }


# Package pricing in ETB
PACKAGE_PRICES = {
    'starter': 7000,
    'business': 10000,
    'dynamic': 14999
}


def get_deposit_amount(package_id):
    """Calculate 50% deposit amount for a package"""
    full_price = PACKAGE_PRICES.get(package_id, 10000)
    return full_price // 2


def create_payment_link(submission):
    """
    Create a Chapa payment link for a submission
    Returns checkout URL or None if failed
    """
    chapa = ChapaPayment()
    deposit = get_deposit_amount(submission.package_id)
    
    result = chapa.initialize_payment(submission, deposit)
    
    if result['success']:
        # Store tx_ref in submission for later verification
        # You might want to add a payment_tx_ref field to the Submission model
        return result['checkout_url']
    else:
        print(f"Payment initialization failed: {result.get('error')}")
        return None

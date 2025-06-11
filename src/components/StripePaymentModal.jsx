import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PoundSterling, Lock, CreditCard, Shield } from 'lucide-react';
import { loadStripe, Elements, CardElement, useStripe, useElements } from '../lib/stripe-mock.jsx'; // Using mock for now

const StripePaymentModal = ({ isOpen, onClose, amount, description, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded. Make sure to disable form submission until Stripe.js has loaded.
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    // Mock backend response for payment intent
    const mockPaymentIntent = {
      clientSecret: 'mock_client_secret_123',
      amount: amount * 100, // Amount in cents
      currency: 'gbp',
    };

    // Simulate payment confirmation
    const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(mockPaymentIntent.clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: 'Mock User',
        },
      },
    });

    if (confirmError) {
      setError(confirmError.message);
      setLoading(false);
    } else if (paymentIntent.status === 'succeeded') {
      onSuccess();
      setLoading(false);
      onClose();
    } else {
      setError('Payment failed: ' + paymentIntent.status);
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-card text-foreground p-6 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary text-center">Unlock Contact Details</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="text-center">
            <p className="text-muted-foreground text-lg mb-2">You are about to pay:</p>
            <div className="flex items-center justify-center text-primary text-4xl font-bold">
              <PoundSterling className="h-8 w-8 mr-2" />
              <span>{amount.toFixed(2)}</span>
            </div>
            <p className="text-muted-foreground mt-2">{description}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="card-element" className="block text-sm font-medium text-muted-foreground mb-2">Card Details</Label>
              <div className="border border-border rounded-md p-3 bg-background">
                <CardElement options={{ style: { base: { color: '#f0f0f0' } } }} />
              </div>
            </div>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <Button type="submit" className="w-full btn-primary" disabled={loading || !stripe || !elements}>
              {loading ? 'Processing...' : ( <> <Lock className="h-5 w-5 mr-2" /> Pay Now </> )}
            </Button>
          </form>

          <div className="text-center text-muted-foreground text-sm mt-4 flex items-center justify-center">
            <Shield className="h-4 w-4 mr-2" />
            <span>Secure payment powered by Stripe</span>
          </div>
        </div>
        <DialogFooter className="flex justify-center">
          <Button variant="outline" onClick={onClose} className="btn-secondary">Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const StripePaymentModalWrapper = (props) => {
  const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTgbpRsm'); // Replace with your actual Stripe publishable key

  return (
    <Elements stripe={stripePromise}>
      <StripePaymentModal {...props} />
    </Elements>
  );
};

export default StripePaymentModalWrapper;



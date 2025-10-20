import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  CreditCard,
  Shield,
  CheckCircle,
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  AlertCircle,
  Lock,
  Building,
  DollarSign
} from 'lucide-react';

interface Event {
  id: number;
  title: string;
  description: string;
  speaker_name: string;
  organizer_name: string;
  event_date: string;
  duration_minutes: number;
  location: string;
  audience_size: number;
  budget_min: number;
  budget_max: number;
  status: string;
}

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'wallet';
  name: string;
  icon: string;
  last4?: string;
}

const PaymentFlow: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const amount = searchParams.get('amount');
  
  const [event, setEvent] = useState<Event | null>(null);
  const [currentStep, setCurrentStep] = useState<'method' | 'details' | 'confirm' | 'processing' | 'success'>('method');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolderName: '',
    billingAddress: '',
    city: '',
    zipCode: '',
    country: 'US'
  });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const paymentMethods: PaymentMethod[] = [
    { id: 'card', type: 'card', name: 'Credit/Debit Card', icon: '💳' },
    { id: 'paypal', type: 'wallet', name: 'PayPal', icon: '🟦' },
    { id: 'stripe', type: 'wallet', name: 'Stripe', icon: '🟣' },
    { id: 'bank', type: 'bank', name: 'Bank Transfer', icon: '🏦' }
  ];

  useEffect(() => {
    // Mock event data - replace with API call
    setTimeout(() => {
      setEvent({
        id: 1,
        title: "AI in Healthcare: Future Perspectives",
        description: "A comprehensive discussion on how artificial intelligence is transforming healthcare delivery.",
        speaker_name: "Dr. Sarah Johnson",
        organizer_name: "Tech Summit 2024",
        event_date: "2024-09-15T14:00:00Z",
        duration_minutes: 45,
        location: "San Francisco Convention Center",
        audience_size: 500,
        budget_min: 5000,
        budget_max: 7500,
        status: "accepted"
      });
      setLoading(false);
    }, 1000);
  }, [eventId]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatCardNumber = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiryDate = (value: string) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(?=\d)/, '$1/');
  };

  const handlePaymentDetailsChange = (field: string, value: string) => {
    let formattedValue = value;
    
    if (field === 'cardNumber') {
      formattedValue = formatCardNumber(value).slice(0, 19); // Max 16 digits with spaces
    } else if (field === 'expiryDate') {
      formattedValue = formatExpiryDate(value).slice(0, 5); // MM/YY format
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4); // Max 4 digits
    }
    
    setPaymentDetails(prev => ({
      ...prev,
      [field]: formattedValue
    }));
  };

  const validatePaymentDetails = () => {
    const { cardNumber, expiryDate, cvv, cardHolderName } = paymentDetails;
    return cardNumber.replace(/\s/g, '').length >= 16 &&
           expiryDate.length === 5 &&
           cvv.length >= 3 &&
           cardHolderName.trim().length > 0;
  };

  const processPayment = async () => {
    setCurrentStep('processing');
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      setCurrentStep('success');
    }, 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#27465C] flex items-center justify-center">
        <div className="text-white text-lg">Loading payment details...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#27465C] flex items-center justify-center">
        <div className="text-white text-lg">Event not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#27465C]">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-black mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <h1 className="text-2xl font-black text-black">Payment</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep !== 'success' && (
          <>
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-center space-x-4">
                {['method', 'details', 'confirm'].map((step, index) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep === step 
                        ? 'bg-[#27465C] text-white' 
                        : ['method', 'details', 'confirm'].indexOf(currentStep) > index
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {['method', 'details', 'confirm'].indexOf(currentStep) > index ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        index + 1
                      )}
                    </div>
                    {index < 2 && (
                      <div className={`w-16 h-1 mx-2 ${
                        ['method', 'details', 'confirm'].indexOf(currentStep) > index 
                          ? 'bg-green-500' 
                          : 'bg-gray-300'
                      }`}></div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-center space-x-16 mt-2">
                <span className="text-xs text-white">Payment Method</span>
                <span className="text-xs text-white">Details</span>
                <span className="text-xs text-white">Confirm</span>
              </div>
            </div>

            {/* Event Summary Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-lg font-black text-black mb-4">Event Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-black mb-2">{event.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{event.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{new Date(event.event_date).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{event.duration_minutes} minutes</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-gray-400" />
                      <span>{event.audience_size} attendees</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-bold text-black mb-3">Payment Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Speaker Fee:</span>
                        <span className="font-medium">{formatCurrency(Number(amount) || event.budget_min)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Platform Fee:</span>
                        <span className="font-medium">{formatCurrency((Number(amount) || event.budget_min) * 0.05)}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-bold">
                        <span>Total Amount:</span>
                        <span>{formatCurrency((Number(amount) || event.budget_min) * 1.05)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Payment Method Selection */}
        {currentStep === 'method' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-black text-black mb-6">Choose Payment Method</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paymentMethods.map(method => (
                <div
                  key={method.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedPaymentMethod?.id === method.id
                      ? 'border-[#27465C] bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onClick={() => setSelectedPaymentMethod(method)}
                >
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{method.icon}</span>
                    <div>
                      <h3 className="font-medium text-black">{method.name}</h3>
                      <p className="text-sm text-gray-600">
                        {method.type === 'card' && 'Visa, Mastercard, American Express'}
                        {method.type === 'wallet' && 'Digital wallet payment'}
                        {method.type === 'bank' && 'Direct bank transfer'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {selectedPaymentMethod && (
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setCurrentStep('details')}
                  className="bg-[#27465C] text-white font-medium py-2 px-6 rounded-lg hover:bg-[#1e3a4a] transition-colors"
                >
                  Continue
                </button>
              </div>
            )}
          </div>
        )}

        {/* Payment Details Form */}
        {currentStep === 'details' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-black text-black mb-6">Payment Details</h2>
            
            {selectedPaymentMethod?.type === 'card' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={paymentDetails.cardNumber}
                      onChange={(e) => handlePaymentDetailsChange('cardNumber', e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27465C] focus:border-transparent"
                    />
                    <CreditCard className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={paymentDetails.expiryDate}
                      onChange={(e) => handlePaymentDetailsChange('expiryDate', e.target.value)}
                      placeholder="MM/YY"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27465C] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      value={paymentDetails.cvv}
                      onChange={(e) => handlePaymentDetailsChange('cvv', e.target.value)}
                      placeholder="123"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27465C] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    value={paymentDetails.cardHolderName}
                    onChange={(e) => handlePaymentDetailsChange('cardHolderName', e.target.value)}
                    placeholder="John Doe"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#27465C] focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {selectedPaymentMethod?.type === 'wallet' && (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">{selectedPaymentMethod.icon}</div>
                <h3 className="text-lg font-medium text-black mb-2">
                  {selectedPaymentMethod.name} Payment
                </h3>
                <p className="text-gray-600">
                  You will be redirected to {selectedPaymentMethod.name} to complete your payment.
                </p>
              </div>
            )}

            <div className="flex items-center justify-center mt-6 p-4 bg-green-50 rounded-lg">
              <Shield className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-sm text-green-800">
                Your payment information is encrypted and secure
              </span>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setCurrentStep('method')}
                className="bg-gray-300 text-gray-700 font-medium py-2 px-6 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setCurrentStep('confirm')}
                disabled={selectedPaymentMethod?.type === 'card' && !validatePaymentDetails()}
                className="bg-[#27465C] text-white font-medium py-2 px-6 rounded-lg hover:bg-[#1e3a4a] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Review Payment
              </button>
            </div>
          </div>
        )}

        {/* Payment Confirmation */}
        {currentStep === 'confirm' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-black text-black mb-6">Confirm Payment</h2>
            
            <div className="space-y-6">
              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-black mb-2">Payment Method</h3>
                <div className="flex items-center">
                  <span className="text-xl mr-2">{selectedPaymentMethod?.icon}</span>
                  <span>{selectedPaymentMethod?.name}</span>
                  {selectedPaymentMethod?.type === 'card' && paymentDetails.cardNumber && (
                    <span className="ml-2 text-gray-600">
                      •••• •••• •••• {paymentDetails.cardNumber.slice(-4)}
                    </span>
                  )}
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <h3 className="font-medium text-black mb-2">Amount Breakdown</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Speaker Fee:</span>
                    <span>{formatCurrency(Number(amount) || event.budget_min)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Fee (5%):</span>
                    <span>{formatCurrency((Number(amount) || event.budget_min) * 0.05)}</span>
                  </div>
                  <div className="border-t pt-1 flex justify-between font-medium">
                    <span>Total:</span>
                    <span>{formatCurrency((Number(amount) || event.budget_min) * 1.05)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-start p-4 bg-yellow-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Payment Terms</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Payment will be processed immediately</li>
                    <li>• Refunds are subject to our cancellation policy</li>
                    <li>• You will receive a confirmation email</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setCurrentStep('details')}
                className="bg-gray-300 text-gray-700 font-medium py-2 px-6 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Back
              </button>
              <button
                onClick={processPayment}
                disabled={processing}
                className="bg-[#27465C] text-white font-medium py-2 px-6 rounded-lg hover:bg-[#1e3a4a] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
              >
                {processing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 mr-2" />
                    Confirm Payment
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Processing State */}
        {currentStep === 'processing' && (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="w-16 h-16 border-4 border-[#27465C] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-xl font-black text-black mb-2">Processing Payment</h2>
            <p className="text-gray-600">Please wait while we process your payment...</p>
          </div>
        )}

        {/* Success State */}
        {currentStep === 'success' && (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-black text-black mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-6">
              Your payment has been processed successfully. You will receive a confirmation email shortly.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h3 className="font-medium text-black mb-2">Transaction Details</h3>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Transaction ID:</span>
                  <span className="font-mono">TXN-{Date.now()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount Paid:</span>
                  <span>{formatCurrency((Number(amount) || event.budget_min) * 1.05)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span>{selectedPaymentMethod?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{new Date().toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate('/host/dashboard')}
                className="bg-[#27465C] text-white font-medium py-2 px-6 rounded-lg hover:bg-[#1e3a4a] transition-colors"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => navigate(`/event-details/${eventId}`)}
                className="bg-gray-300 text-gray-700 font-medium py-2 px-6 rounded-lg hover:bg-gray-400 transition-colors"
              >
                View Event Details
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentFlow;
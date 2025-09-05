import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const speakers = [
  {
    id: 1,
    name: "Elon Musk",
    image: "/img1.png"
  },
  {
    id: 2, 
    name: "Sarah Chen",
    image: "/img2.png"
  },
  {
    id: 3,
    name: "Dr. James Wilson", 
    image: "/img3.png"
  },
  {
    id: 4,
    name: "Maria Rodriguez",
    image: "/img4.png"
  },
  {
    id: 5,
    name: "David Kim",
    image: "/img5.png"
  },
  {
    id: 6,
    name: "Lisa Thompson",
    image: "/img6.png"
  }
];

export default function Compensation() {
  const navigate = useNavigate();
  const { speakerId } = useParams();
  const [activeTab, setActiveTab] = useState('Compensation');
  const [formData, setFormData] = useState({
    speakingFee: '',
    feeStructure: '',
    budget: '',
    paymentTerms: '',
    invoiceRequirements: '',
    additionalBenefits: '',
    negotiable: 'yes',
    cancellationPolicy: '',
    contractType: ''
  });

  const speaker = speakers.find(s => s.id === parseInt(speakerId || '1'));

  const tabs = ['Event Details', 'Organizer Info', 'Speaker Requirements', 'Compensation'];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    // Show success message and redirect to home
    alert(`Booking request sent for ${speaker?.name || "the speaker"}! You will receive a confirmation email shortly with contract details and next steps.`);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#27465C]">
      {/* Navigation */}
      <nav className="w-full py-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div onClick={() => navigate('/')} className="cursor-pointer">
            <div className="text-white text-3xl font-bold">C&I</div>
            <div className="text-white text-sm">Connect and Inspire</div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 pb-8">
        <h1 className="text-white text-2xl font-bold mb-8">Book Speaker - {activeTab}</h1>

        {/* Speaker Info */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg">
              <img 
                src={speaker?.image || "/img1.png"} 
                alt={speaker?.name || "Speaker"}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-white text-lg font-medium">
              You are booking {speaker?.name || "Elon Musk"}
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-white rounded-t-2xl p-2 mb-0 shadow-lg">
          <div className="flex overflow-x-auto">
            {tabs.map((tab, index) => {
              const isCompleted = tabs.indexOf(activeTab) > index;
              const isCurrent = activeTab === tab;
              
              return (
                <div
                  key={tab}
                  className={`px-6 py-3 text-sm font-medium whitespace-nowrap ${
                    isCompleted
                      ? 'text-black'
                      : isCurrent
                      ? 'text-black'
                      : 'text-gray-400'
                  }`}
                >
                  {tab}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-b-2xl rounded-t-none p-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Budget Range */}
            <div className="md:col-span-1">
              <label className="block text-black font-medium mb-2">Budget Range</label>
              <select
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#27465C]/20 bg-white"
              >
                <option value="">Select budget range</option>
                <option value="under-5k">Under $5,000</option>
                <option value="5k-10k">$5,000 - $10,000</option>
                <option value="10k-25k">$10,000 - $25,000</option>
                <option value="25k-50k">$25,000 - $50,000</option>
                <option value="50k-100k">$50,000 - $100,000</option>
                <option value="100k-plus">$100,000+</option>
                <option value="negotiable">Negotiable</option>
              </select>
            </div>

            {/* Fee Structure */}
            <div className="md:col-span-1">
              <label className="block text-black font-medium mb-2">Fee Structure</label>
              <select
                value={formData.feeStructure}
                onChange={(e) => handleInputChange('feeStructure', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#27465C]/20 bg-white"
              >
                <option value="">Select structure</option>
                <option value="flat-fee">Flat Fee</option>
                <option value="hourly">Hourly Rate</option>
                <option value="per-session">Per Session</option>
                <option value="revenue-share">Revenue Share</option>
                <option value="donation">Donation to Charity</option>
                <option value="pro-bono">Pro Bono</option>
              </select>
            </div>

            {/* Payment Terms */}
            <div className="md:col-span-1">
              <label className="block text-black font-medium mb-2">Payment Terms</label>
              <select
                value={formData.paymentTerms}
                onChange={(e) => handleInputChange('paymentTerms', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#27465C]/20 bg-white"
              >
                <option value="">Select terms</option>
                <option value="advance-50">50% advance, 50% after event</option>
                <option value="advance-full">100% advance payment</option>
                <option value="after-event">Payment after event</option>
                <option value="30-days">Net 30 days</option>
                <option value="15-days">Net 15 days</option>
                <option value="upon-invoice">Upon receipt of invoice</option>
              </select>
            </div>

            {/* Speaking Fee Details */}
            <div className="md:col-span-2">
              <label className="block text-black font-medium mb-2">Speaking Fee Details</label>
              <textarea
                value={formData.speakingFee}
                onChange={(e) => handleInputChange('speakingFee', e.target.value)}
                placeholder="Specific fee amount, currency, and any additional details"
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#27465C]/20 resize-none"
              />
            </div>

            {/* Negotiable */}
            <div className="md:col-span-1">
              <label className="block text-black font-medium mb-2">Fee Negotiable?</label>
              <select
                value={formData.negotiable}
                onChange={(e) => handleInputChange('negotiable', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#27465C]/20 bg-white"
              >
                <option value="yes">Yes, open to negotiation</option>
                <option value="no">No, fee is fixed</option>
                <option value="depends">Depends on circumstances</option>
              </select>
            </div>

            {/* Contract Type */}
            <div className="md:col-span-1">
              <label className="block text-black font-medium mb-2">Contract Type</label>
              <select
                value={formData.contractType}
                onChange={(e) => handleInputChange('contractType', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#27465C]/20 bg-white"
              >
                <option value="">Select contract type</option>
                <option value="speaking-agreement">Speaking Agreement</option>
                <option value="service-contract">Service Contract</option>
                <option value="appearance-agreement">Appearance Agreement</option>
                <option value="consulting-agreement">Consulting Agreement</option>
                <option value="standard-template">Use standard template</option>
              </select>
            </div>

            {/* Invoice Requirements */}
            <div className="md:col-span-1">
              <label className="block text-black font-medium mb-2">Invoice Requirements</label>
              <textarea
                value={formData.invoiceRequirements}
                onChange={(e) => handleInputChange('invoiceRequirements', e.target.value)}
                placeholder="PO numbers, specific billing address, tax information"
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#27465C]/20 resize-none"
              />
            </div>

            {/* Additional Benefits */}
            <div className="md:col-span-2">
              <label className="block text-black font-medium mb-2">Additional Benefits/Perks</label>
              <textarea
                value={formData.additionalBenefits}
                onChange={(e) => handleInputChange('additionalBenefits', e.target.value)}
                placeholder="Travel upgrades, extended stay, networking opportunities, promotional benefits, etc."
                rows={3}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#27465C]/20 resize-none"
              />
            </div>

            {/* Cancellation Policy */}
            <div className="md:col-span-1">
              <label className="block text-black font-medium mb-2">Cancellation Policy</label>
              <select
                value={formData.cancellationPolicy}
                onChange={(e) => handleInputChange('cancellationPolicy', e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#27465C]/20 bg-white"
              >
                <option value="">Select policy</option>
                <option value="30-days">30 days notice required</option>
                <option value="60-days">60 days notice required</option>
                <option value="90-days">90 days notice required</option>
                <option value="50-percent">50% fee if cancelled &lt; 30 days</option>
                <option value="full-fee">Full fee if cancelled &lt; 14 days</option>
                <option value="force-majeure">Force majeure exceptions</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-8">
            <Button
              onClick={handleSubmit}
              variant="dark"
              size="lg"
              className="px-8 py-3 font-medium"
            >
              Submit Booking Request
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
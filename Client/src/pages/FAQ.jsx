import { useState } from "react";
import { ChevronDown, ChevronUp, Sparkle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleAIModal } from "../store/slices/popupSlice";
import AISearchModal from "../components/Products/AISearchModal";

const FAQPage = () => {
  const dispatch = useDispatch();
  const { isAIPopupOpen } = useSelector((state) => state.popup);
  const [openItems, setOpenItems] = useState({});

  const faqs = [
    {
      question: "How do I place an order?",
      answer:
        "Simply browse our products, add items to your cart, and proceed to checkout. Follow the prompts to complete your order.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards, PayPal, and other secure payment methods.",
    },
    {
      question: "How long does shipping take?",
      answer:
        "Standard shipping takes 3-5 business days. Express shipping options are available at checkout.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer a 30-day return policy for most items. Items must be in original condition with tags attached.",
    },
  ];

  const toggleItem = (index) => {
    setOpenItems((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const openAIModal = () => {
    dispatch(toggleAIModal());
  };

  return (
    <div className="min-h-screen bg-background pt-20 relative">
      {/* Page Header */}
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-xl text-muted-foreground">
          Find answers to common questions or ask our AI for help.
        </p>
      </div>

      {/* FAQ List */}
      <div className="max-w-3xl mx-auto px-4 space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-secondary rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-primary/10 transition-colors"
            >
              <h3 className="font-semibold text-foreground">{faq.question}</h3>
              {openItems[index] ? (
                <ChevronUp className="w-5 h-5 text-foreground" />
              ) : (
                <ChevronDown className="w-5 h-5 text-foreground" />
              )}
            </button>
            {openItems[index] && (
              <div className="px-6 pb-4 animate-slideDown">
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
        {/* Place this button inside the FAQ container, e.g., below FAQ title */}
<div className="text-center mt-8">
        <button
          onClick={openAIModal}
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-secondary/70 backdrop-blur-md border border-border text-foreground font-semibold hover:bg-secondary/90 hover:shadow-lg transition-all transform hover:-translate-y-1 hover:scale-105
          bg-gradient-to-br from-purple-500 
 to-blue-500"
        >
      <Sparkle className="w-5 h-5 text-primary" />
      <span>Ask AI for help</span>
    </button>
</div>

      </div>
      {/* AI Modal */}
      {isAIPopupOpen && <AISearchModal />}
    </div>
  );
};

export default FAQPage;

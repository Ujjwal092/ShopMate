import { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CreditCard, Lock } from "lucide-react";
import { toast } from "react-toastify";
import { toggleOrderStep } from "../store/slices/orderSlice";
import { clearCart } from "../store/slices/cartSlice";

const PaymentForm = () => {
  const clientSecret = useSelector((state) => state.order.paymentIntent);
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); //after summit page will not refresh and in last we used a button to summit
    

    if (!stripe || !elements) return;
    if (!clientSecret) {
      toast.error("Payment cannot be processed. Please try again.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setErrorMessage("Card details not found. Please reload the page.");
      setIsProcessing(false);
      return;
    }

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (error) {
        setErrorMessage(error.message);
        toast.error("Payment failed. Please check your card details.");
      } else if (paymentIntent?.status === "succeeded") {
        toast.success("Payment Successful!");
        dispatch(toggleOrderStep());
        dispatch(clearCart());
        navigate("/");
      } else {
        setErrorMessage("Payment could not be completed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const cardStyle = {
    style: {
      base: {
        fontSize: "16px",
        color: "#000",
        fontFamily: "Arial, sans-serif",
        "::placeholder": { color: "#888" },
      },
      invalid: { color: "#fa755a" },
    },
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 gradient-primary rounded-full flex items-center justify-center">
          <CreditCard className="w-6 h-6 text-primary-foreground" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Card Payment</h2>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-2">
          Card Details <span className="text-red-500 text-bold">*</span>
        </label>
        <div className="px-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none text-foreground">
          <CardElement options={cardStyle} />
        </div>
      </div>

      <div className="flex items-center space-x-2 mb-6 p-4 bg-secondary/50 rounded-lg">
        <Lock className="w-5 h-5 text-green-500" />
        <span className="text-sm text-muted-foreground">
          Your card information is encrypted and secure.
        </span>
      </div>

      {errorMessage && (
        <p className="mb-4 text-sm text-red-500">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="flex justify-center items-center gap-2 w-full py-3 gradient-primary text-primary-foreground rounded-lg hover:glow-on-hover animate-smooth font-semibold"
      >
        {isProcessing ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Payment Processing ...</span>
          </>
        ) : (
          "Complete Payment"
        )}
      </button>
    </form>
  );
};

export default PaymentForm;

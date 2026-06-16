import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Package, Truck, CheckCircle, XCircle, MapPin, Phone, Download } from "lucide-react";
import { useSelector } from "react-redux";
import { axiosInstance } from "../lib/axios";
import { formatINR } from "../lib/currency";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigateTo = useNavigate();
  const { authUser } = useSelector((state) => state.auth);
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authUser) {
      navigateTo("/products");
      return;
    }

    const fetchOrder = async () => {
      try {
        const res = await axiosInstance.get(`/order/${orderId}`);
        setOrder(res.data.orders);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [authUser, navigateTo, orderId]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Processing":
        return <Package className="w-6 h-6 text-yellow-500" />;
      case "Shipped":
        return <Truck className="w-6 h-6 text-blue-500" />;
      case "Delivered":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case "Cancelled":
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Package className="w-6 h-6 text-yellow-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <p className="text-primary text-lg">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center glass-panel p-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">Order not found</h1>
          <p className="text-muted-foreground mb-6">We couldn’t find the requested order.</p>
          <button
            onClick={() => navigateTo("/orders")}
            className="px-6 py-3 gradient-primary text-primary-foreground rounded-lg hover:glow-on-hover animate-smooth font-semibold"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-1">Order Details</h1>
            <p className="text-muted-foreground">Order #{order.id} placed on {new Date(order.created_at).toLocaleDateString()}</p>
          </div>
          <button
            onClick={() => navigateTo('/orders')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-foreground rounded-lg hover:bg-accent animate-smooth"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Orders
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
          <div className="glass-card p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div>
                <p className="text-muted-foreground mb-2">Order Status</p>
                <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-secondary text-foreground">
                  {getStatusIcon(order.order_status)}
                  <span className="font-semibold capitalize">{order.order_status}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Total Paid</p>
                <p className="text-2xl font-bold text-primary">{formatINR(order.total_price)}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="border-b border-[hsla(var(--glass-border))] pb-4">
                <h2 className="text-xl font-semibold text-foreground mb-3">Shipping Info</h2>
                <p className="text-foreground">{order.shipping_info?.full_name}</p>
                <p className="text-muted-foreground">{order.shipping_info?.address}</p>
                <p className="text-muted-foreground">{order.shipping_info?.city}, {order.shipping_info?.state}, {order.shipping_info?.country} {order.shipping_info?.pincode}</p>
                <p className="text-muted-foreground flex items-center gap-2"><Phone className="w-4 h-4" /> {order.shipping_info?.phone}</p>
              </div>

              <div className="border-b border-[hsla(var(--glass-border))] pb-4">
                <h2 className="text-xl font-semibold text-foreground mb-3">Order Items</h2>
                <div className="space-y-4">
                  {order.order_items?.map((item) => (
                    <div key={item.product_id} className="flex items-center gap-4 p-4 bg-secondary/50 rounded-lg">
                      <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded-lg" />
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${item.product_id}`} className="font-semibold text-foreground hover:text-primary transition-colors">{item.title}</Link>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-foreground">{formatINR(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 space-y-4">
            <div className="rounded-2xl border border-[hsla(var(--glass-border))] bg-secondary/70 p-4">
              <p className="text-muted-foreground mb-2">Order Summary</p>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Tax</span>
                <span>{formatINR(order.tax_price)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Shipping</span>
                <span>{order.shipping_price === 0 ? "Free" : formatINR(order.shipping_price)}</span>
              </div>
              <div className="border-t border-[hsla(var(--glass-border))] pt-4 mt-4 flex justify-between font-semibold text-foreground">
                <span>Grand Total</span>
                <span>{formatINR(order.total_price)}</span>
              </div>
            </div>

            <div className="rounded-2xl bg-primary/10 p-4">
              <p className="font-semibold text-foreground mb-2">Delivery details</p>
              <p className="text-sm text-muted-foreground">Your order is being processed and will be shipped shortly.</p>
            </div>

            <Link
              to="/orders"
              className="block text-center py-3 rounded-lg gradient-primary text-primary-foreground font-semibold hover:glow-on-hover"
            >
              Back to My Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;

import React, { useEffect, useState } from "react";
import { Filter, Package, Truck, CheckCircle, XCircle, Download, X, Clock } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import { fetchMyOrders, cancelOrder } from "../store/slices/orderSlice";
import { addToCart } from "../store/slices/cartSlice";
import { formatINR } from "../lib/currency";

const Orders = () => {
  const [statusFilter, setStatusFilter] = useState("All");
  const [now, setNow] = useState(() => Date.now());
  const { myOrders, isLoading } = useSelector((state) => state.order);
  const { authUser } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  // Redirect if user not logged in
  useEffect(() => {
    if (!authUser) {
      navigateTo("/products");
    }
  }, [authUser, navigateTo]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch orders
  useEffect(() => {
    if (authUser) {
      dispatch(fetchMyOrders());
    }
  }, [dispatch, authUser]);

  // Filter orders based on status
  const filterOrders = myOrders.filter(
    (order) => statusFilter === "All" || order.order_status === statusFilter
  );

  const getStatusIcon = (status) => {
    switch (status) {
      case "Processing":
        return <Package className="w-5 h-5 text-yellow-500" />;
      case "Shipped":
        return <Truck className="w-5 h-5 text-blue-500" />;
      case "Delivered":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "Cancelled":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Package className="w-5 h-5 text-yellow-500" />;
    }
  }; 

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "bg-yellow-500/20 text-yellow-400";
      case "Shipped":
        return "bg-blue-500/20 text-blue-400";
      case "Delivered":
        return "bg-green-500/20 text-green-400";
      case "Cancelled":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const statusArray = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];

  const getCancelTimer = (createdAt) => {
    const createdTime = new Date(createdAt).getTime();
    const remaining = 15 * 60 * 1000 - (now - createdTime);
    if (remaining <= 0) return null;
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const canCancelOrder = (order) => {
    return (
      order.order_status === "Processing" &&
      getCancelTimer(order.created_at) !== null
    );
  };

  const handleViewDetails = (order) => {
    navigateTo(`/orders/${order.id}`);
  };

  const handleWriteReview = (order) => {
    const firstDeliveredItem = order.order_items?.[0];
    if (!firstDeliveredItem) return;
    navigateTo(`/product/${firstDeliveredItem.product_id}?tab=reviews`);
  };

  const handleReorder = (order) => {
    order.order_items?.forEach((item) => {
      dispatch(
        addToCart({
          product: {
            id: item.product_id,
            name: item.title,
            price: item.price,
            images: [{ url: item.image }],
            category: item.category || "ShopMate",
          },
          quantity: item.quantity,
        }),
      );
    });
    navigateTo("/cart");
  };

  const downloadInvoice = (order) => {
    const doc = new jsPDF();
    const orderDate = new Date(order.created_at).toLocaleString();
    doc.setFontSize(18);
    doc.text("ShopMate Order Invoice", 14, 20);
    doc.setFontSize(11);
    doc.text(`Order #: ${order.id}`, 14, 32);
    doc.text(`Order Date: ${orderDate}`, 14, 38);
    doc.text(`Status: ${order.order_status}`, 14, 44);
    doc.text(`Total: ${formatINR(order.total_price)}`, 14, 50);
    doc.text("Shipping Info:", 14, 60);
    doc.setFontSize(10);
    doc.text(`Name: ${order.shipping_info?.full_name || "-"}`, 14, 66);
    doc.text(`Address: ${order.shipping_info?.address || "-"}`, 14, 72);
    doc.text(`City: ${order.shipping_info?.city || "-"}`, 14, 78);
    doc.text(`State: ${order.shipping_info?.state || "-"}`, 14, 84);
    doc.text(`Phone: ${order.shipping_info?.phone || "-"}`, 14, 90);
    doc.text("Items:", 14, 102);

    let currentY = 108;
    order.order_items?.forEach((item, index) => {
      if (currentY > 250) {
        doc.addPage();
        currentY = 20;
      }
      doc.text(
        `${index + 1}. ${item.title} x${item.quantity} - ${formatINR(
          item.price,
        )}`,
        14,
        currentY,
      );
      currentY += 8;
    });

    doc.setFontSize(12);
    doc.text(`Grand Total: ${formatINR(order.total_price)}`, 14, currentY + 12);
    doc.save(`invoice-${order.id}.pdf`);
  };

  // Show loader if fetching orders
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-primary text-lg">Loading your orders...</p>
      </div>
    );
  }

  if (!authUser) return null; // Prevent render until navigation

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">My Orders😍</h1>
          <p className="text-muted-foreground">Track and manage your order history.</p>
        </div>

        {/* STATUS FILTER */}
        <div className="glass-card p-4 mb-8">
          <div className="flex items-center space-x-4 flex-wrap">
          
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-primary" />
              <span className="font-medium">Filter by status:</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {statusArray.map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${
                    statusFilter === status
                      ? "gradient-primary text-primary-foreground"
                      : "glass-card hover:glow-on-hover text-foreground"
                  }`} //for selected filter show 
                >
                  {status}
                </button>
              ))}
            </div>

          </div>
        </div>

        {/* ORDERS LIST */}
        {filterOrders.length === 0 ? (
       
       <div className="text-center glass-panel max-w-md mx-auto">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No Orders Found</h2>
            <p className="text-muted-foreground">
              {statusFilter === "All"
                ? "You haven't placed any orders yet."
                : `No orders with status "${statusFilter}" found.`}
            </p>
          </div>

        ) : (
          <div className="space-y-6">
            {filterOrders.map((order) => (
              <div key={order.id} className="glass-card p-6">
               
                {/* ORDER HEADER */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">Orders #{order.id}</h3>
                    <p className="text-muted-foreground">
                      Placed on {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.order_status)}
                      <span
                        className={`px-3 py-1 rounded text-sm font-medium capitalize ${getStatusColor(
                          order.order_status 
                        )}`}
                      >
                        {order.order_status}
                      </span>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-xl font-bold text-primary">{formatINR(order.total_price)}</p>
                    </div>
                  </div>
                </div>

                {/* ORDER ITEMS */}
                <div className="space-y-4"> 
                  {/**order_items is from backend fetchMyOrder wla controller*/}
                  {order?.order_items?.map((item) => (
                    <div
                      key={item.product_id}
                      className="flex items-center space-x-4 p-4 bg-secondary/50 rounded-lg"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground truncate">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">{formatINR(item.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ORDER ACTIONS */}
                <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-[hsla(var(--glass-border))]">
                  <button
                    onClick={() => handleViewDetails(order)}
                    className="px-4 py-2 glass-card hover:glow-on-hover animate-smooth text-sm"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleViewDetails(order)}
                    className="px-4 py-2 glass-card hover:glow-on-hover animate-smooth text-sm"
                  >
                    Track Order
                  </button>

                  <button
                    onClick={() => downloadInvoice(order)}
                    className="px-4 py-2 glass-card hover:glow-on-hover animate-smooth text-sm flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download Invoice
                  </button>

                  {canCancelOrder(order) && (
                    <button
                      onClick={() => dispatch(cancelOrder(order.id))}
                      className="px-4 py-2 glass-card hover:glow-on-hover animate-smooth text-sm text-yellow-600"
                    >
                      <span className="flex items-center gap-2">
                        <X className="w-4 h-4" />
                        Cancel Order
                      </span>
                    </button>
                  )}

                  {order.order_status === "Processing" && getCancelTimer(order.created_at) && (
                    <div className="px-4 py-2 bg-yellow-500/10 text-yellow-600 rounded-lg text-sm flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Cancel available for {getCancelTimer(order.created_at)}
                    </div>
                  )}

                  {order.order_status === "Delivered" && (
                    <>
                      <button
                        onClick={() => handleWriteReview(order)}
                        className="px-4 py-2 glass-card hover:glow-on-hover animate-smooth text-sm"
                      >
                        Write Review
                      </button>
                      <button
                        onClick={() => handleReorder(order)}
                        className="px-4 py-2 glass-card hover:glow-on-hover animate-smooth text-sm"
                      >
                        Reorder
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;

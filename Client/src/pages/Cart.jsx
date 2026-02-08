import { Plus, Minus, Trash2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, updateCartQuantity } from "../store/slices/cartSlice";

const Cart = () => {
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);
  const { authUser } = useSelector((state) => state.auth);

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      dispatch(removeFromCart(id));
    } else {
      dispatch(updateCartQuantity({ id, quantity }));
    }
  };

  let total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  let cartItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center glass-panel max-w-md p-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-muted-foreground mb-6">
            Looks like you haven’t added any items yet.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-primary-foreground gradient-primary hover:glow-on-hover animate-smooth font-semibold"
          >
            <span>Continue Shopping</span> <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Shopping Cart</h1>
          <p className="text-muted-foreground">
            {cartItemsCount} item{cartItemsCount !== 1 ? "s" : ""} in your cart
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="flex-1 space-y-4">
            {cart.map((item) => (
              <div key={item.product.id} className="glass-card p-4 flex flex-col md:flex-row items-center md:items-start gap-4">
                
                <Link to={`/product/${item.product.id}`} className="flex-shrink-0">
                  <img
                    src={item.product?.images[0]?.url}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-lg hover:scale-105 transition-transform"
                  />
                </Link>

                <div className="flex-1 flex flex-col md:flex-row md:justify-between w-full items-start md:items-center gap-2">
                  <div className="flex-1">
                    <Link to={`/product/${item.product.id}`} className="block hover:text-primary transition-colors">
                      <h3 className="text-lg font-semibold text-foreground">{item.product.name}</h3>
                    </Link>
                    <p className="text-muted-foreground text-sm">Category: {item.product.category}</p>
                    <span className="text-xl font-bold text-primary">${item.product.price}</span>
                  </div>

                  <div className="flex items-center gap-4 mt-2 md:mt-0">
                    <div className="flex items-center gap-2">
                      <button
                        disabled={item.quantity === 1}
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-2 glass-card hover:glow-on-hover animate-smooth"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-2 glass-card hover:glow-on-hover animate-smooth"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => dispatch(removeFromCart(item.product.id))}
                      className="p-2 glass-card hover:glow-on-hover animate-smooth text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-right mt-2 md:mt-0">
                    <p className="text-lg font-bold text-foreground">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3 flex-shrink-0">
            <div className="glass-panel p-6 sticky top-24 flex flex-col gap-4">
              <h2 className="text-xl font-semibold text-foreground mb-4">Order Summary</h2>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal ({cartItemsCount} items)</span>
                <span className="font-semibold">${total.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-semibold text-green-500">{total >= 50 ? "Free" : "$2"}</span>
              </div>

              {total < 50 && (
                <p className="text-xs text-red-500 mt-1">
                  Cart total must be above $50 for free shipping.
                </p>
              )}

              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-semibold">${(total * 0.18).toFixed(2)}</span>
              </div>

              <div className="border-t border-[hsla(var(--glass-border))] pt-4 flex justify-between">
                <span className="text-lg font-semibold">Total</span>
                <span>${(total + total * 0.18).toFixed(2)}</span>
              </div>

              {authUser && (
                <Link
                  to="/payment"
                  className="w-full text-center py-3 gradient-primary text-primary-foreground rounded-lg hover:glow-on-hover animate-smooth font-semibold"
                >
                  Proceed to Checkout
                </Link>
              )}

              <Link
                to="/products"
                className="w-full text-center py-3 bg-secondary text-foreground rounded-lg border border-border hover:bg-accent animate-smooth font-semibold"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

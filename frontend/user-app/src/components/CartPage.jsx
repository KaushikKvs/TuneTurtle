import React, { useContext, useEffect, useMemo, useState } from "react";
import { ShoppingCart, Trash2, CreditCard, Music2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { PlayerContext } from "../context/PlayerContext";
import { API_BASE_URL, useAuth } from "../context/AuthContext";

const CartPage = () => {
  const { cartItems, removeFromCart, clearCart, setPurchasedSongIds } = useContext(PlayerContext);
  const { user, getAuthHeaders } = useAuth();
  const [checkingOut, setCheckingOut] = useState(false);

  const total = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + (Number(item.amountPaid) || 0), 0);
  }, [cartItems]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("stripe_cart_session_id");
    const payment = params.get("payment");

    if (payment === "cancelled") {
      toast("Cart checkout cancelled.");
      return;
    }

    if (!sessionId || !user) return;

    const confirmCartSession = async () => {
      try {
        await axios.post(
          `${API_BASE_URL}/api/transactions/stripe/confirm-cart-session`,
          { sessionId },
          { headers: getAuthHeaders() }
        );

        // Ownership logic is complex now, better to just let PlayerContext 
        // refresh everything from the /my-ownership endpoint
        clearCart();
        toast.success("Payment successful. Digital access granted!");
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (error) {
        toast.error(error.response?.data || "Could not verify cart payment.");
      }
    };

    confirmCartSession();
  }, [user, getAuthHeaders, clearCart]);

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please login first.");
      return;
    }
    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    setCheckingOut(true);
    try {
      const currentUrl = `${window.location.origin}/cart`;
      const payload = {
        items: cartItems.map((item) => ({
          songId: item.songId, // Used as general itemId in backend
          songName: item.songName,
          artistId: item.artistId,
          amountPaid: item.amountPaid,
          type: item.type || "SONG"
        })),
        successUrl: `${currentUrl}?stripe_cart_session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${currentUrl}?payment=cancelled`,
      };

      const { data } = await axios.post(
        `${API_BASE_URL}/api/transactions/stripe/create-cart-checkout-session`,
        payload,
        { headers: getAuthHeaders() }
      );

      if (!data?.url) {
        throw new Error("Stripe URL not received");
      }
      window.location.href = data.url;
    } catch (error) {
      toast.error(error.response?.data || "Cart checkout failed.");
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div className="p-6 md:p-12 animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8 border-b border-[var(--border-subtle)] pb-5">
        <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
          <ShoppingCart className="w-8 h-8 text-[var(--accent)]" />
          Checkout Cart
        </h1>
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-meta)]">
          {cartItems.length} Item{cartItems.length === 1 ? "" : "s"}
        </span>
      </div>

      {cartItems.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-[var(--border-subtle)] p-16 text-center bg-[var(--bg-hover)]">
          <Music2 className="w-12 h-12 mx-auto mb-4 text-[var(--text-meta)] opacity-30" />
          <p className="text-lg font-bold text-[var(--text-primary)]">Your cart is empty.</p>
          <p className="text-[var(--text-secondary)] mt-1">Add songs from Music or Artist pages to purchase together.</p>
        </div>
      ) : (
        <div className="grid gap-4 pb-20">
          {cartItems.map((item) => (
            <div key={`${item.songId}-${item.type}`} className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
              <img src={item.image} alt={item.songName} className="w-14 h-14 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[var(--text-primary)] truncate">
                    <span className="text-[var(--accent)] text-[10px] uppercase tracking-wider mr-2">{item.type || "SONG"}</span>
                    {item.songName}
                </p>
                <p className="text-xs text-[var(--text-secondary)] truncate">{item.desc || "TuneTurtle marketplace track"}</p>
              </div>
              <p className="font-black text-[var(--text-primary)]">₹{item.amountPaid}</p>
              <button
                onClick={() => removeFromCart(item.songId)}
                className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                title="Remove from cart"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {cartItems.length > 0 && (
        <div className="mt-8 rounded-3xl p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <div className="flex items-center justify-between">
            <p className="text-sm uppercase tracking-[0.15em] text-[var(--text-meta)] font-bold">Total</p>
            <p className="text-3xl font-black text-[var(--text-primary)]">₹{total.toFixed(2)}</p>
          </div>
          <div className="mt-5 flex gap-3">
            <button
              onClick={clearCart}
              className="px-4 py-3 rounded-xl border border-[var(--border-subtle)] text-[var(--text-primary)] font-bold hover:bg-[var(--bg-hover)] transition-colors"
            >
              Clear Cart
            </button>
            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className="flex-1 flex items-center justify-center gap-2 bg-[var(--accent)] text-[var(--bg-base)] font-black py-3 rounded-xl hover:opacity-90 disabled:opacity-60 transition-opacity"
            >
              <CreditCard className="w-4 h-4" />
              {checkingOut ? "Redirecting..." : "Pay with Stripe"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;

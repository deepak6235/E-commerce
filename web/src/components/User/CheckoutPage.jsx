import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CheckoutPage = () => {
  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [zip, setZip] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
        
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login");
        navigate("/");
        return;
      }
    try {
      const res = await axios.get("http://localhost:5000/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data.items || []);
      setSubtotal(res.data.subtotal || 0);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  const handlePayment = async () => {
    if (!address || !city || !state || !country || !zip) {
      alert("Please fill all address fields.");
      return;
    }

    try {
      const amountInPaise = subtotal * 100;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amountInPaise,
        currency: "INR",
        name: "My Shop",
        description: "Order Payment",
        handler: async function (response) {
          try {

            for (const item of cart) {
              await axios.post(
                "http://localhost:5000/orders/checkout",
                {
                  productId: item.product.id,
                  quantity: item.quantity,
                  paymentResponse: {
                    ...response,
                    status: "success",
                  },
                  shippingDetails: {
                    address,
                    city,
                    state,
                    country,
                    zip,
                  },
                },
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
            }

            alert("Order placed successfully!");
            navigate("/user-orders");
          } catch (err) {
            console.error("Order save failed:", err);
            alert(
              "Payment succeeded, but some orders were not saved. Contact support."
            );
          }
        },
        prefill: {
          name: "John Doe",
          email: "john@example.com",
          contact: "9999999999",
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment initialization failed:", err);
      alert("Payment failed! Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Checkout</h1>
      <h2>Total: ₹{subtotal}</h2>

      <div style={{ marginBottom: "20px" }}>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul>
            {cart.map((item) => (
              <li key={item.id}>
                {item.product.name} x {item.quantity} = ₹{item.total}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
        <input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
        <input placeholder="State" value={state} onChange={(e) => setState(e.target.value)} />
        <input placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
        <input placeholder="ZIP" value={zip} onChange={(e) => setZip(e.target.value)} />
      </div>

      <button
        onClick={handlePayment}
        style={{
          marginTop: "20px",
          padding: "12px 25px",
          backgroundColor: "#3399cc",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Pay Online & Place Order
      </button>
    </div>
  );
};

export default CheckoutPage;

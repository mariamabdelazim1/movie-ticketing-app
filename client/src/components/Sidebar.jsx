import { Clapperboard, Gift, Popcorn, ShoppingCart, Ticket, UserRound } from "lucide-react";
import "./Sidebar.css";

export function Sidebar({ page, setPage, user, cartItemCount = 0 }) {
  const items = [
    ["movies", Clapperboard, "Movies"],
    ["cart", ShoppingCart, "View Cart"],
    ["bookings", Ticket, "Bookings"],
    ["snacks", Popcorn, "Snacks & Drinks"],
    ["profile", UserRound, "Profile"],
    ["rewards", Gift, "Rewards"]
  ];

  return (
    <aside className="sidebar">
      <strong className="brand">
        <img src="/logo.png" alt="" />
        3M Cinema
      </strong>
      <nav>
        {items.map(([id, Icon, label]) => (
          <button key={id} className={page === id ? "active" : ""} onClick={() => setPage(id)}>
            <Icon size={18} /> {label}
            {id === "cart" && cartItemCount > 0 && <span className="cart-badge">{cartItemCount}</span>}
          </button>
        ))}
      </nav>
      <div className="points-box">
        <Gift size={18} />
        <span>{user ? `${user.points} points` : "Login for points"}</span>
      </div>
    </aside>
  );
}

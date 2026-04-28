import React from "react";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Clapperboard, Loader2, LogIn, UserRound } from "lucide-react";
import { AuthPage } from "./components/AuthPage.jsx";
import { BookingsPage } from "./components/BookingsPage.jsx";
import { CartPage } from "./components/CartPage.jsx";
import { MoviePage } from "./components/MoviePage.jsx";
import { MoviesPage } from "./components/MoviesPage.jsx";
import { ProfilePage } from "./components/ProfilePage.jsx";
import { ReceiptPage } from "./components/ReceiptPage.jsx";
import { RewardsPage } from "./components/RewardsPage.jsx";
import { SeatFoodPage } from "./components/SeatFoodPage.jsx";
import { Sidebar } from "./components/Sidebar.jsx";
import { SnacksPage } from "./components/SnacksPage.jsx";
import { API_URL, titleForPage } from "./utils/format.js";

const REWARD_COSTS = {
  freePopcorn: 500,
  ticketDiscount: 1000,
  freeTicket: 1800
};

export function App() {
  const [page, setPage] = useState("movies");
  const [movies, setMovies] = useState([]);
  const [concessions, setConcessions] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShowId, setSelectedShowId] = useState("");
  const [showDetails, setShowDetails] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [snacks, setSnacks] = useState({});
  const [rewardRedemptions, setRewardRedemptions] = useState({
    freePopcorn: false,
    ticketDiscount: false,
    freeTicket: false
  });
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("cinemaUser");
    try {
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      localStorage.removeItem("cinemaUser");
      return null;
    }
  });
  const [bookings, setBookings] = useState([]);
  const [receipt, setReceipt] = useState(null);
  const [previousPage, setPreviousPage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedShowId) {
      loadShow(selectedShowId);
    }
  }, [selectedShowId]);

  useEffect(() => {
    if (user?._id) {
      refreshUser(user._id);
      loadBookings(user._id);
    }
  }, [user?._id]);

  useEffect(() => {
    if (user?._id && ["rewards", "profile", "bookings"].includes(page)) {
      refreshUser(user._id);
      loadBookings(user._id);
    }
  }, [page, user?._id]);

  function navigate(nextPage) {
    if (nextPage !== page) {
      setPreviousPage(page);
      setPage(nextPage);
    }
  }

  function goBack() {
    setPage(previousPage || "movies");
    setPreviousPage("");
  }

  async function loadData() {
    setLoading(true);
    try {
      const [movieRes, concessionRes] = await Promise.all([
        fetch(`${API_URL}/movies`),
        fetch(`${API_URL}/concessions`)
      ]);
      setMovies(await movieRes.json());
      setConcessions(await concessionRes.json());
    } catch (err) {
      setError("Could not load cinema data. Start MongoDB and the API, then refresh.");
    } finally {
      setLoading(false);
    }
  }

  async function refreshUser(userId) {
    try {
      const res = await fetch(`${API_URL}/users/${userId}`);
      const data = await res.json();
      if (!res.ok) {
        localStorage.removeItem("cinemaUser");
        setUser(null);
        setBookings([]);
        return;
      }
      if (data._id) {
        setUser(data);
        localStorage.setItem("cinemaUser", JSON.stringify(data));
      }
    } catch (err) {
      setError("Could not refresh profile.");
    }
  }

  async function loadBookings(userId) {
    try {
      setBookings(await fetch(`${API_URL}/users/${userId}/reservations`).then((res) => res.json()));
    } catch (err) {
      setError("Could not load bookings.");
    }
  }

  async function loadShow(showId) {
    setSelectedSeats([]);
    try {
      setShowDetails(await fetch(`${API_URL}/shows/${showId}`).then((res) => res.json()));
    } catch (err) {
      setError("Could not load this show.");
    }
  }

  function openMovie(movie) {
    setSelectedMovie(movie);
    setSelectedShowId("");
    setShowDetails(null);
    navigate("movie");
  }

  function chooseShow(showId) {
    if (!user) {
      setSelectedShowId(showId);
      navigate("auth");
      return;
    }

    setSelectedShowId(showId);
    navigate("seats");
  }

  function toggleSeat(seat) {
    if (seat.status === "booked") return;
    setSelectedSeats((current) =>
      current.includes(seat.id) ? current.filter((item) => item !== seat.id) : [...current, seat.id]
    );
  }

  function changeSnack(itemId, delta) {
    setSnacks((current) => ({ ...current, [itemId]: Math.max(0, (current[itemId] || 0) + delta) }));
  }

  function redeemReward(rewardKey) {
    setError("");
    if (!user) {
      navigate("auth");
      return;
    }

    const currentPointCost = Object.entries(rewardRedemptions).reduce(
      (sum, [key, active]) => sum + (active ? REWARD_COSTS[key] || 0 : 0),
      0
    );
    const nextPointCost = currentPointCost + (rewardRedemptions[rewardKey] ? 0 : REWARD_COSTS[rewardKey]);

    if (user.points < nextPointCost) {
      setError("You do not have enough points for that reward yet.");
      return;
    }

    if (rewardKey === "freePopcorn") {
      const popcorn = concessions.find((item) => item.name.toLowerCase().includes("popcorn"));
      if (!popcorn) {
        setError("Popcorn is not available right now.");
        return;
      }
      setSnacks((current) => ({ ...current, [popcorn._id]: Math.max(1, current[popcorn._id] || 0) }));
      setRewardRedemptions((current) => ({ ...current, freePopcorn: true }));
      navigate(selectedShowId ? "cart" : "snacks");
      return;
    }

    setRewardRedemptions((current) => ({ ...current, [rewardKey]: true }));
    navigate(selectedShowId ? "seats" : "movies");
  }

  function clearRewards() {
    setRewardRedemptions({ freePopcorn: false, ticketDiscount: false, freeTicket: false });
    setError("");
  }

  const rawSnackTotal = useMemo(
    () => concessions.reduce((sum, item) => sum + (snacks[item._id] || 0) * item.price, 0),
    [concessions, snacks]
  );
  const freePopcornDiscount = useMemo(() => {
    if (!rewardRedemptions.freePopcorn) return 0;
    const popcorn = concessions.find((item) => item.name.toLowerCase().includes("popcorn") && snacks[item._id] > 0);
    return popcorn?.price || 0;
  }, [concessions, rewardRedemptions.freePopcorn, snacks]);
  const rawTicketTotal = selectedSeats.length * (showDetails?.ticketPrice || 0);
  const ticketRewardDiscount = Math.min(
    rawTicketTotal,
    (rewardRedemptions.ticketDiscount ? Math.round(rawTicketTotal * 0.1) : 0) +
      (rewardRedemptions.freeTicket && selectedSeats.length ? showDetails?.ticketPrice || 0 : 0)
  );
  const ticketTotal = Math.max(0, rawTicketTotal - ticketRewardDiscount);
  const snackTotal = Math.max(0, rawSnackTotal - freePopcornDiscount);
  const cartTotal = ticketTotal + snackTotal;
  const rewardDiscountTotal = ticketRewardDiscount + freePopcornDiscount;
  const cartItemCount =
    selectedSeats.length + Object.values(snacks).reduce((sum, quantity) => sum + Number(quantity || 0), 0);
  const rewardPointsSpent = Object.entries(rewardRedemptions).reduce(
    (sum, [key, active]) => sum + (active ? REWARD_COSTS[key] || 0 : 0),
    0
  );

  async function submitAuth(mode, form) {
    setError("");
    const endpoint = mode === "login" ? "login" : "signup";
    const payload =
      mode === "login"
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };

    try {
      const res = await fetch(`${API_URL}/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setUser(data);
      localStorage.setItem("cinemaUser", JSON.stringify(data));
      navigate(selectedShowId ? "seats" : "movies");
    } catch (err) {
      setError(err.message || "Could not sign in.");
    }
  }

  async function reserveCart() {
    setError("");
    if (!selectedSeats.length) {
      setError("Choose at least one seat before reserving.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/reservations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          showId: selectedShowId,
          userId: user._id,
          customerName: user.name,
          customerEmail: user.email,
          seats: selectedSeats,
          concessions: Object.entries(snacks)
            .filter(([, quantity]) => quantity > 0)
            .map(([item, quantity]) => ({ item, quantity })),
          rewardRedemptions
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      if (data.updatedUser) {
        setUser(data.updatedUser);
        localStorage.setItem("cinemaUser", JSON.stringify(data.updatedUser));
      }
      setReceipt(data.reservation);
      setSelectedSeats([]);
      setSnacks({});
      setRewardRedemptions({ freePopcorn: false, ticketDiscount: false, freeTicket: false });
      await Promise.all([loadShow(selectedShowId), loadBookings(user._id)]);
      navigate("receipt");
    } catch (err) {
      setError(err.message || "Reservation failed.");
    } finally {
      setSaving(false);
    }
  }

  async function buySnacksOnly() {
    setError("");
    if (!user) {
      navigate("auth");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/snack-orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id,
          reservationId: bookings[0]?._id,
          items: Object.entries(snacks)
            .filter(([, quantity]) => quantity > 0)
            .map(([item, quantity]) => ({ item, quantity })),
          rewardRedemptions
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      if (data.updatedUser) {
        setUser(data.updatedUser);
        localStorage.setItem("cinemaUser", JSON.stringify(data.updatedUser));
      }
      setReceipt({ snackOrder: data.order });
      setSnacks({});
      setRewardRedemptions({ freePopcorn: false, ticketDiscount: false, freeTicket: false });
      navigate("receipt");
    } catch (err) {
      setError(err.message || "Snack order failed.");
    } finally {
      setSaving(false);
    }
  }

  function logout() {
    localStorage.removeItem("cinemaUser");
    setUser(null);
    setBookings([]);
    navigate("movies");
  }

  async function changePassword(form) {
    setError("");
    try {
      const res = await fetch(`${API_URL}/users/${user._id}/password`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      return data.message;
    } catch (err) {
      setError(err.message || "Could not change password.");
      return "";
    }
  }

  async function deleteAccount() {
    setError("");
    try {
      const res = await fetch(`${API_URL}/users/${user._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      localStorage.removeItem("cinemaUser");
      setUser(null);
      setBookings([]);
      navigate("movies");
    } catch (err) {
      setError(err.message || "Could not delete account.");
    }
  }

  async function cancelBooking(bookingId) {
    setError("");
    try {
      const res = await fetch(`${API_URL}/reservations/${bookingId}/cancel`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      if (data.updatedUser) {
        setUser(data.updatedUser);
        localStorage.setItem("cinemaUser", JSON.stringify(data.updatedUser));
      }
      await Promise.all([loadBookings(user._id), refreshUser(user._id), selectedShowId && loadShow(selectedShowId)]);
    } catch (err) {
      setError(err.message || "Could not cancel booking.");
    }
  }

  if (loading) {
    return (
      <main className="center">
        <Loader2 className="spin" />
        Loading cinema...
      </main>
    );
  }

  return (
    <main className="shell">
      <Sidebar page={page} setPage={navigate} user={user} cartItemCount={cartItemCount} />
      <section className="content">
        <header className="topbar">
          <div>
            <span className="eyebrow"><Clapperboard size={16} /> Cinema Reserve</span>
            <div className="title-row">
              {page !== "movies" && (
                <button className="back-btn" onClick={goBack} title="Back">
                  <ArrowLeft size={20} />
                </button>
              )}
              <h1>{titleForPage(page)}</h1>
            </div>
          </div>
          <button className="account-btn" onClick={() => (user ? navigate("profile") : navigate("auth"))}>
            {user ? <UserRound size={18} /> : <LogIn size={18} />} {user ? user.name : "Login / Sign up"}
          </button>
        </header>

        {error && <div className="notice">{error}</div>}

        {page === "movies" && <MoviesPage movies={movies} openMovie={openMovie} />}
        {page === "movie" && selectedMovie && (
          <MoviePage movie={selectedMovie} chooseShow={chooseShow} user={user} />
        )}
        {page === "auth" && <AuthPage submitAuth={submitAuth} />}
        {page === "seats" && (
          <SeatFoodPage
            showDetails={showDetails}
            selectedSeats={selectedSeats}
            toggleSeat={toggleSeat}
            concessions={concessions}
            snacks={snacks}
            changeSnack={changeSnack}
            setPage={navigate}
            ticketTotal={ticketTotal}
            snackTotal={snackTotal}
            cartTotal={cartTotal}
            rewardDiscountTotal={rewardDiscountTotal}
            rewardRedemptions={rewardRedemptions}
            rewardPointsSpent={rewardPointsSpent}
            clearRewards={clearRewards}
          />
        )}
        {page === "cart" && (
          <CartPage
            showDetails={showDetails}
            selectedSeats={selectedSeats}
            concessions={concessions}
            snacks={snacks}
            ticketTotal={ticketTotal}
            snackTotal={snackTotal}
            cartTotal={cartTotal}
            rewardDiscountTotal={rewardDiscountTotal}
            rewardRedemptions={rewardRedemptions}
            rewardPointsSpent={rewardPointsSpent}
            clearRewards={clearRewards}
            reserveCart={reserveCart}
            saving={saving}
          />
        )}
        {page === "receipt" && <ReceiptPage receipt={receipt} />}
        {page === "bookings" && <BookingsPage bookings={bookings} cancelBooking={cancelBooking} />}
        {page === "snacks" && (
          <SnacksPage
            concessions={concessions}
            snacks={snacks}
            changeSnack={changeSnack}
            snackTotal={snackTotal}
            rewardDiscountTotal={freePopcornDiscount}
            rewardRedemptions={rewardRedemptions}
            rewardPointsSpent={rewardRedemptions.freePopcorn ? REWARD_COSTS.freePopcorn : 0}
            clearRewards={clearRewards}
            buySnacksOnly={buySnacksOnly}
            saving={saving}
          />
        )}
        {page === "profile" && (
          <ProfilePage
            user={user}
            logout={logout}
            changePassword={changePassword}
            deleteAccount={deleteAccount}
          />
        )}
        {page === "rewards" && <RewardsPage user={user} redeemReward={redeemReward} rewardRedemptions={rewardRedemptions} />}
      </section>
    </main>
  );
}

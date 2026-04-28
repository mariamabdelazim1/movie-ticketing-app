export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";
export const EMAIL_PATTERN = "[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}";

export const money = (value) =>
  new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0
  }).format(value || 0);

export const formatShowTime = (date) =>
  new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(date));

export const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date(date));

export const canCancelBooking = (booking) =>
  booking.status !== "cancelled" &&
  (new Date(booking.show.startsAt).getTime() - Date.now()) / 60000 >= 30;

export function youtubeEmbedUrl(url) {
  try {
    const parsed = new URL(url);
    const videoId = parsed.searchParams.get("v") || parsed.pathname.split("/").filter(Boolean).pop();
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  } catch {
    return url;
  }
}

export function titleForPage(page) {
  const titles = {
    movies: "Now Showing",
    movie: "Movie Details",
    auth: "Login or Sign up",
    seats: "Choose Seats and Food",
    cart: "Cart",
    receipt: "Receipt",
    bookings: "Bookings",
    snacks: "Snacks and Drinks",
    profile: "Profile",
    rewards: "Rewards"
  };

  return titles[page] || "Cinema Reserve";
}

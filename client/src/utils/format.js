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
    const pathParts = parsed.pathname.split("/").filter(Boolean);
    const videoId =
      parsed.searchParams.get("v") ||
      (pathParts[0] === "embed" ? pathParts[1] : "") ||
      (pathParts[0] === "shorts" ? pathParts[1] : "") ||
      (parsed.hostname.includes("youtu.be") ? pathParts[0] : "");
    const startTime = parsed.searchParams.get("start") || parsed.searchParams.get("t");
    const start = startTime ? Number.parseInt(startTime, 10) || 0 : 0;
    const params = new URLSearchParams({
      rel: "0",
      modestbranding: "1",
      playsinline: "1"
    });

    if (start > 0) {
      params.set("start", String(start));
    }

    return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}?${params}` : url;
  } catch (error) {
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

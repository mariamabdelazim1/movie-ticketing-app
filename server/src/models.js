import mongoose from "mongoose";
import { hashPassword, isPasswordHash } from "./passwords.js";

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    rating: { type: String, required: true },
    duration: { type: Number, required: true },
    genre: { type: String, required: true },
    language: { type: String, required: true },
    subtitles: { type: String, default: "None" },
    releaseDate: { type: Date, required: true },
    poster: { type: String, required: true },
    trailerUrl: { type: String, required: true },
    cast: [{ type: String }],
    synopsis: { type: String, required: true }
  },
  { timestamps: true }
);

const showSchema = new mongoose.Schema(
  {
    movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
    auditorium: { type: String, required: true },
    startsAt: { type: Date, required: true },
    type: { type: String, enum: ["standard", "gold"], required: true },
    basePrice: { type: Number, required: true },
    goldSurcharge: { type: Number, default: 0 },
    bookedSeats: [{ type: String }]
  },
  { timestamps: true }
);

const concessionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, enum: ["snack", "drink", "combo"], required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true }
  },
  { timestamps: true }
);

const reservationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    show: { type: mongoose.Schema.Types.ObjectId, ref: "Show", required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    seats: [{ type: String, required: true }],
    concessions: [
      {
        item: { type: mongoose.Schema.Types.ObjectId, ref: "Concession", required: true },
        quantity: { type: Number, min: 1, required: true }
      }
    ],
    pricing: {
      ticketSubtotal: { type: Number, required: true },
      concessionSubtotal: { type: Number, required: true },
      ticketDiscount: { type: Number, default: 0 },
      concessionDiscount: { type: Number, default: 0 },
      total: { type: Number, required: true }
    },
    rewardsRedeemed: [{ type: String }],
    status: { type: String, enum: ["active", "cancelled"], default: "active" },
    pointsEarned: { type: Number, default: 0 },
    pointsSpent: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [EMAIL_PATTERN, "Please enter a valid email address."]
    },
    password: { type: String, required: true },
    points: { type: Number, default: 0 }
  },
  { timestamps: true }
);

userSchema.pre("save", function hashUserPassword(next) {
  if (this.isModified("password") && !isPasswordHash(this.password)) {
    this.password = hashPassword(this.password);
  }

  next();
});

const snackOrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reservation: { type: mongoose.Schema.Types.ObjectId, ref: "Reservation" },
    items: [
      {
        item: { type: mongoose.Schema.Types.ObjectId, ref: "Concession", required: true },
        quantity: { type: Number, min: 1, required: true }
      }
    ],
    total: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    rewardsRedeemed: [{ type: String }],
    pointsEarned: { type: Number, required: true },
    pointsSpent: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export const Movie = mongoose.model("Movie", movieSchema);
export const Show = mongoose.model("Show", showSchema);
export const Concession = mongoose.model("Concession", concessionSchema);
export const Reservation = mongoose.model("Reservation", reservationSchema);
export const User = mongoose.model("User", userSchema);
export const SnackOrder = mongoose.model("SnackOrder", snackOrderSchema);

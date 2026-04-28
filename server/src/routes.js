import express from "express";
import { Concession, EMAIL_PATTERN, Movie, Reservation, Show, SnackOrder, User } from "./models.js";
import { allSeats, validateSeats } from "./seatMap.js";
import { hashPassword, isPasswordHash, verifyPassword } from "./passwords.js";

export const router = express.Router();

const REWARD_COSTS = {
  freePopcorn: 500,
  ticketDiscount: 1000,
  freeTicket: 1800
};

function selectedRewards(rewardRedemptions = {}) {
  return Object.entries(REWARD_COSTS)
    .filter(([key]) => Boolean(rewardRedemptions[key]))
    .map(([key]) => key);
}

function rewardPointCost(rewards) {
  return rewards.reduce((sum, reward) => sum + REWARD_COSTS[reward], 0);
}

async function normalizeUserPoints(userId) {
  const user = await User.findById(userId).select("-password");
  if (user && user.points < 0) {
    user.points = 0;
    await user.save();
  }
  return user;
}

router.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

router.get("/movies", async (req, res, next) => {
  try {
    const movies = await Movie.find().sort({ createdAt: 1 });
    const shows = await Show.find({ movie: { $in: movies.map((movie) => movie._id) } }).sort({
      startsAt: 1
    });

    const byMovie = shows.reduce((acc, show) => {
      const key = show.movie.toString();
      acc[key] = acc[key] || [];
      acc[key].push(show);
      return acc;
    }, {});

    res.json(
      movies.map((movie) => ({
        ...movie.toObject(),
        shows: byMovie[movie._id.toString()] || []
      }))
    );
  } catch (error) {
    next(error);
  }
});

router.get("/shows/:id", async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id).populate("movie");
    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    const booked = new Set(show.bookedSeats);
    res.json({
      ...show.toObject(),
      ticketPrice: show.basePrice + show.goldSurcharge,
      seats: allSeats(show.type).map((seat) => ({
        id: seat,
        status: booked.has(seat) ? "booked" : "available"
      }))
    });
  } catch (error) {
    next(error);
  }
});

router.get("/concessions", async (req, res, next) => {
  try {
    const concessions = await Concession.find().sort({ category: 1, price: 1 });
    res.json(concessions);
  } catch (error) {
    next(error);
  }
});

router.post("/auth/signup", async (req, res, next) => {
  const { name, email, password } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();

  if (!name || !normalizedEmail || !password) {
    return res.status(400).json({ message: "Name, email, and password are required." });
  }

  if (!EMAIL_PATTERN.test(normalizedEmail)) {
    return res.status(400).json({ message: "Please enter a valid email like name@example.com." });
  }

  try {
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    const user = await User.create({ name: name.trim(), email: normalizedEmail, password });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, points: user.points });
  } catch (error) {
    next(error);
  }
});

router.post("/auth/login", async (req, res, next) => {
  const { email, password } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();

  try {
    const user = await User.findOne({ email: normalizedEmail });
    if (!user || !verifyPassword(password, user.password)) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    if (!isPasswordHash(user.password)) {
      user.password = hashPassword(password);
      await user.save();
    }

    res.json({ _id: user._id, name: user.name, email: user.email, points: user.points });
  } catch (error) {
    next(error);
  }
});

router.patch("/users/:id/password", async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ message: "Current password and a new password of 6+ characters are required." });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user || !verifyPassword(currentPassword, user.password)) {
      return res.status(401).json({ message: "Current password is incorrect." });
    }

    user.password = newPassword;
    await user.save();
    res.json({ message: "Password changed." });
  } catch (error) {
    next(error);
  }
});

router.delete("/users/:id", async (req, res, next) => {
  try {
    const reservations = await Reservation.find({ user: req.params.id, status: "active" });

    await Promise.all(
      reservations.map(async (reservation) => {
        await Show.findByIdAndUpdate(reservation.show, {
          $pull: { bookedSeats: { $in: reservation.seats } }
        });
      })
    );

    await Promise.all([
      Reservation.deleteMany({ user: req.params.id }),
      SnackOrder.deleteMany({ user: req.params.id }),
      User.findByIdAndDelete(req.params.id)
    ]);

    res.json({ message: "Account deleted." });
  } catch (error) {
    next(error);
  }
});

router.get("/users/:id", async (req, res, next) => {
  try {
    const user = await normalizeUserPoints(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.get("/users/:id/reservations", async (req, res, next) => {
  try {
    const reservations = await Reservation.find({ user: req.params.id })
      .populate({ path: "show", populate: { path: "movie" } })
      .populate("concessions.item")
      .sort({ createdAt: -1 });
    res.json(reservations);
  } catch (error) {
    next(error);
  }
});

router.post("/reservations", async (req, res, next) => {
  const { showId, userId, customerName, customerEmail, seats, concessions = [], rewardRedemptions = {} } = req.body;

  if (!customerName || !customerEmail) {
    return res.status(400).json({ message: "Customer info and at least one valid seat are required." });
  }

  try {
    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({ message: "Show not found" });
    }

    const user = userId ? await normalizeUserPoints(userId) : null;
    if (!user) {
      return res.status(401).json({ message: "Please login again before reserving." });
    }

    if (!validateSeats(seats, show.type)) {
      return res.status(400).json({ message: "Choose at least one valid seat for this auditorium." });
    }

    const alreadyBooked = seats.filter((seat) => show.bookedSeats.includes(seat));
    if (alreadyBooked.length) {
      return res.status(409).json({ message: `Seats already booked: ${alreadyBooked.join(", ")}` });
    }

    const concessionIds = concessions.map((entry) => entry.item);
    const concessionDocs = await Concession.find({ _id: { $in: concessionIds } });
    const concessionById = new Map(concessionDocs.map((item) => [item._id.toString(), item]));

    const normalizedConcessions = concessions
      .filter((entry) => concessionById.has(entry.item) && Number(entry.quantity) > 0)
      .map((entry) => ({ item: entry.item, quantity: Number(entry.quantity) }));

    const ticketPrice = show.basePrice + show.goldSurcharge;
    const ticketSubtotal = seats.length * ticketPrice;
    const concessionSubtotal = normalizedConcessions.reduce((sum, entry) => {
      return sum + concessionById.get(entry.item).price * entry.quantity;
    }, 0);
    const rewardsRedeemed = selectedRewards(rewardRedemptions);
    const pointsSpent = rewardPointCost(rewardsRedeemed);

    if (pointsSpent > user.points) {
      return res.status(400).json({ message: "Not enough points to redeem this reward." });
    }

    const popcornEntry = normalizedConcessions.find((entry) =>
      concessionById.get(entry.item)?.name.toLowerCase().includes("popcorn")
    );
    if (rewardRedemptions.freePopcorn && !popcornEntry) {
      return res.status(400).json({ message: "Add popcorn to the cart before redeeming free popcorn." });
    }

    const ticketDiscount = Math.min(
      ticketSubtotal,
      (rewardRedemptions.ticketDiscount ? Math.round(ticketSubtotal * 0.1) : 0) +
        (rewardRedemptions.freeTicket ? ticketPrice : 0)
    );
    const concessionDiscount =
      rewardRedemptions.freePopcorn && popcornEntry ? concessionById.get(popcornEntry.item).price : 0;
    const discountedTicketSubtotal = Math.max(0, ticketSubtotal - ticketDiscount);
    const discountedConcessionSubtotal = Math.max(0, concessionSubtotal - concessionDiscount);
    const total = discountedTicketSubtotal + discountedConcessionSubtotal;
    const pointsEarned = Math.floor(total / 10);

    if (user.points + pointsEarned - pointsSpent < 0) {
      return res.status(400).json({ message: "Not enough points to redeem this reward." });
    }

    show.bookedSeats.push(...seats);
    await show.save();

    const reservation = await Reservation.create({
      user: userId,
      show: show._id,
      customerName,
      customerEmail,
      seats,
      concessions: normalizedConcessions,
      pricing: {
        ticketSubtotal: discountedTicketSubtotal,
        concessionSubtotal: discountedConcessionSubtotal,
        ticketDiscount,
        concessionDiscount,
        total
      },
      rewardsRedeemed,
      pointsEarned,
      pointsSpent
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $inc: { points: pointsEarned - pointsSpent } },
      { new: true }
    ).select("-password");

    await reservation.populate([
      { path: "show", populate: { path: "movie" } },
      { path: "concessions.item" }
    ]);

    res.status(201).json({ reservation, updatedUser });
  } catch (error) {
    next(error);
  }
});

router.patch("/reservations/:id/cancel", async (req, res, next) => {
  const { userId } = req.body;

  try {
    const reservation = await Reservation.findById(req.params.id).populate("show");
    if (!reservation || reservation.status === "cancelled") {
      return res.status(404).json({ message: "Active booking not found." });
    }

    if (userId && reservation.user?.toString() !== userId) {
      return res.status(403).json({ message: "You can only cancel your own bookings." });
    }

    const startsAt = new Date(reservation.show.startsAt).getTime();
    const minutesUntilShow = (startsAt - Date.now()) / 60000;
    if (minutesUntilShow < 30) {
      return res.status(400).json({ message: "Bookings can only be cancelled at least 30 minutes before showtime." });
    }

    await Show.findByIdAndUpdate(reservation.show._id, {
      $pull: { bookedSeats: { $in: reservation.seats } }
    });

    reservation.status = "cancelled";
    await reservation.save();

    const updatedUser =
      reservation.user && (reservation.pointsEarned || reservation.pointsSpent)
        ? await User.findByIdAndUpdate(
            reservation.user,
            { $inc: { points: reservation.pointsSpent - reservation.pointsEarned } },
            { new: true }
          ).select("-password")
        : null;

    await reservation.populate([
      { path: "show", populate: { path: "movie" } },
      { path: "concessions.item" }
    ]);

    res.json({ reservation, updatedUser });
  } catch (error) {
    next(error);
  }
});

router.post("/snack-orders", async (req, res, next) => {
  const { userId, reservationId, items = [], rewardRedemptions = {} } = req.body;

  if (!userId || !items.length) {
    return res.status(400).json({ message: "User and snack items are required." });
  }

  try {
    const user = await normalizeUserPoints(userId);
    if (!user) {
      return res.status(401).json({ message: "Please login again before ordering snacks." });
    }

    const concessionDocs = await Concession.find({ _id: { $in: items.map((entry) => entry.item) } });
    const concessionById = new Map(concessionDocs.map((item) => [item._id.toString(), item]));
    const normalizedItems = items
      .filter((entry) => concessionById.has(entry.item) && Number(entry.quantity) > 0)
      .map((entry) => ({ item: entry.item, quantity: Number(entry.quantity) }));

    const total = normalizedItems.reduce(
      (sum, entry) => sum + concessionById.get(entry.item).price * entry.quantity,
      0
    );
    const rewardsRedeemed = selectedRewards(rewardRedemptions).filter((reward) => reward === "freePopcorn");
    const pointsSpent = rewardPointCost(rewardsRedeemed);

    if (pointsSpent > user.points) {
      return res.status(400).json({ message: "Not enough points to redeem this reward." });
    }

    const popcornEntry = normalizedItems.find((entry) =>
      concessionById.get(entry.item)?.name.toLowerCase().includes("popcorn")
    );
    if (rewardRedemptions.freePopcorn && !popcornEntry) {
      return res.status(400).json({ message: "Add popcorn to the cart before redeeming free popcorn." });
    }

    const discount = rewardRedemptions.freePopcorn && popcornEntry ? concessionById.get(popcornEntry.item).price : 0;
    const discountedTotal = Math.max(0, total - discount);
    const pointsEarned = Math.floor(discountedTotal / 10);

    if (user.points + pointsEarned - pointsSpent < 0) {
      return res.status(400).json({ message: "Not enough points to redeem this reward." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $inc: { points: pointsEarned - pointsSpent } },
      { new: true }
    ).select("-password");
    const order = await SnackOrder.create({
      user: userId,
      reservation: reservationId || undefined,
      items: normalizedItems,
      total: discountedTotal,
      discount,
      rewardsRedeemed,
      pointsEarned,
      pointsSpent
    });
    await order.populate(["items.item", "reservation"]);

    res.status(201).json({ order, updatedUser });
  } catch (error) {
    next(error);
  }
});

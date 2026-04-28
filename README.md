# Movie Ticketing Website

Full-stack movie ticketing app built with React, Node/Express, and MongoDB.

## Features

- Movies-only home page with dedicated movie details pages
- Multiple showtimes per film with login/signup required before reservation
- Available, selected, and booked seat map
- Standard and Gold Cinema pricing
- Snack and drink preorders during booking plus snack-only orders after booking
- Separate cart, receipt, bookings, profile, and rewards pages
- Reward points earned on ticket and snack purchases
- MongoDB seed data for users, movies, shows, seats, concessions, and rewards demo data

## Run Locally

1. Install dependencies:

   ```bash
   npm run install:all
   ```

2. Create `server/.env`:

   ```bash
   MONGODB_URI=mongodb://127.0.0.1:27017/movie-ticketing
   PORT=5001
   ```

3. Seed demo data:

   ```bash
   npm run seed
   ```

4. Start the app:

   ```bash
   npm run dev
   ```

Client: http://localhost:5173

API: http://localhost:5001/api

Demo login:

```text
demo@cinema.com
123456
```

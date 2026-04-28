export const ROWS = ["A", "B", "C", "D", "E", "F"];
export const SEATS_PER_ROW = 10;
export const GOLD_ROWS = ["A", "B", "C", "D"];
export const GOLD_SEATS_PER_ROW = 6;

export function allSeats(type = "standard") {
  const rows = type === "gold" ? GOLD_ROWS : ROWS;
  const seatsPerRow = type === "gold" ? GOLD_SEATS_PER_ROW : SEATS_PER_ROW;

  return rows.flatMap((row) =>
    Array.from({ length: seatsPerRow }, (_, index) => `${row}${index + 1}`)
  );
}

export function validateSeats(seats, type = "standard") {
  const seatSet = new Set(allSeats(type));
  return Array.isArray(seats) && seats.length > 0 && seats.every((seat) => seatSet.has(seat));
}

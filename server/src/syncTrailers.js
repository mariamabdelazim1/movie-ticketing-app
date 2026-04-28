import "dotenv/config";
import mongoose from "mongoose";
import { connectDb } from "./db.js";
import { Movie } from "./models.js";

const trailerUpdates = [
  { title: "Bershama", language: "Arabic", trailerUrl: "https://www.youtube.com/watch?v=ymedaKBL2wM" },
  { title: "Michael", language: "English", trailerUrl: "https://www.youtube.com/watch?v=3zOLzsbOleM&t=8s" },
  { title: "Goat", language: "English", trailerUrl: "https://www.youtube.com/watch?v=ggZA2oi8S5s" },
  {
    title: "The Super Mario Galaxy Movie",
    language: "English",
    trailerUrl: "https://www.youtube.com/watch?v=GuCejewteF8"
  },
  { title: "Egy Best", language: "Arabic", trailerUrl: "https://www.youtube.com/watch?v=LY_weJMN1nE" },
  { title: "Saffah El Tagammou", language: "Arabic", trailerUrl: "https://www.youtube.com/watch?v=WdxOXQ0a9n4" },
  {
    title: "Lee Cronin's The Mummy",
    language: "English",
    trailerUrl: "https://www.youtube.com/watch?v=XJ0uv-phsDk"
  },
  { title: "The Desert Warrior", language: "English", trailerUrl: "https://www.youtube.com/watch?v=fraAGOuT3sA" },
  { title: "Project Hail Mary", language: "English", trailerUrl: "https://www.youtube.com/watch?v=m08TxIsFTRI" },
  { title: "Hoppers", language: "English", trailerUrl: "https://www.youtube.com/watch?v=PypDSyIRRSs" },
  { title: "The Raiders", language: "English", trailerUrl: "https://www.youtube.com/watch?v=sbfK5lw3iLY" },
  { title: "Family Business", language: "Arabic", trailerUrl: "https://www.youtube.com/watch?v=zTgeV3rM2fg" },
  {
    title: "The Super Mario Galaxy Movie",
    language: "Arabic",
    trailerUrl: "https://www.youtube.com/watch?v=3zOLzsbOleM&t=8s"
  },
  { title: "Goat", language: "Arabic", trailerUrl: "https://www.youtube.com/watch?v=ggZA2oi8S5s" },
  { title: "This is not a Test", language: "English", trailerUrl: "https://www.youtube.com/watch?v=DXAjPhglafE" }
];

async function syncTrailers() {
  await connectDb();

  for (const update of trailerUpdates) {
    const result = await Movie.updateMany(
      { title: update.title, language: update.language },
      { $set: { trailerUrl: update.trailerUrl } }
    );

    console.log(
      `${update.title} (${update.language}) -> matched ${result.matchedCount}, modified ${result.modifiedCount}`
    );
  }

  await mongoose.disconnect();
}

syncTrailers().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});

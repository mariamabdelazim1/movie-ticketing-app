import "dotenv/config";
import { connectDb } from "./db.js";
import { Concession, Movie, Reservation, Show, SnackOrder, User } from "./models.js";

const poster = (name) =>
  `https://images.unsplash.com/${name}?auto=format&fit=crop&w=900&q=80`;

const moviePoster = (fileName) => `/posters/${fileName}`;

const release = (date) => new Date(`${date}T00:00:00.000Z`);

const movieData = [
  {
    title: "Bershama",
    rating: "12+",
    duration: 110,
    genre: "Comedy",
    language: "Arabic",
    subtitles: "English",
    releaseDate: release("2026-03-19"),
    poster: moviePoster("bershama.jpg"),
    trailerUrl: "https://www.youtube.com/watch?v=ymedaKBL2wM",
    cast: ["Hesham Maged", "Hatem Salah", "Mostafa Ghareeb"],
    synopsis:
      "In a high school exam, the supervisor dies mid-test, and the students try to hide it, hoping to cheat. Only problem? Nobody knows the answers. Among the chaos are a top student obsessed with being proper, the mayor's hopelessly dumb son who must pass at any cost, a dancer chasing a diploma to work abroad, a sixty-year-old woman chasing a pension boost, and a former criminal desperate to pass so he can marry. Absurd schemes, nonstop chaos, and wild laughs turn this exam into a hilarious disaster."
  },
  {
    title: "Michael",
    rating: "G",
    duration: 130,
    genre: "Drama",
    language: "English",
    subtitles: "Arabic",
    releaseDate: release("2026-04-23"),
    poster: moviePoster("michael.jpg"),
    trailerUrl: "https://www.youtube.com/watch?v=3zOLzsbOleM&t=8s",
    cast: ["Nia Long", "Jaafar Jackson", "Laura Harrier"],
    synopsis:
      "Michael is the cinematic portrayal of the life and legacy of one of the most influential artists the world has ever known. The film tells the story of Michael Jackson's life beyond the music, tracing his journey from the discovery of his extraordinary talent as the lead of the Jackson Five, to the visionary artist whose creative ambition fueled a relentless pursuit to become the biggest entertainer in the world."
  },
  {
    title: "Goat",
    rating: "G",
    duration: 95,
    genre: "Animation",
    language: "English",
    subtitles: "Arabic",
    releaseDate: release("2026-04-23"),
    poster: moviePoster("goat.jpg"),
    trailerUrl: "https://www.youtube.com/watch?v=3zOLzsbOleM&t=8s",
    cast: ["Gabrielle Union", "Caleb McLaughlin", "Stephen Curry"],
    synopsis:
      "From Sony Pictures Animation, the studio behind Spider-Man: Across the Spider-Verse and the artists that made KPop Demon Hunters, comes GOAT, an original action-comedy set in an all-animal world. The story follows Will, a small goat with big dreams who gets a once-in-a-lifetime shot to join the pros and play roarball, a high-intensity, co-ed, full-contact sport dominated by the fastest, fiercest animals in the world."
  },
  {
    title: "The Super Mario Galaxy Movie",
    rating: "G",
    duration: 100,
    genre: "Action",
    language: "English",
    subtitles: "Arabic",
    releaseDate: release("2026-04-02"),
    poster: moviePoster("superMario.jpg"),
    trailerUrl: "https://www.youtube.com/watch?v=3zOLzsbOleM&t=8s",
    cast: ["Jack Black", "Anya Taylor-Joy", "Chris Pratt", "Charlie Day"],
    synopsis:
      "The Super Mario Galaxy Movie is an animated film based on the world of Super Mario Bros., and follows The Super Mario Bros. Movie, which was released in 2023 and earned more than $1.3 billion worldwide. The film is produced by Chris Meledandri of Illumination and Shigeru Miyamoto of Nintendo."
  },
  {
    title: "Egy Best",
    rating: "12+",
    duration: 110,
    genre: "Comedy",
    language: "Arabic",
    subtitles: "English",
    releaseDate: release("2026-03-19"),
    poster: moviePoster("egyBest.jpg"),
    trailerUrl: "https://www.youtube.com/watch?v=3zOLzsbOleM&t=8s",
    cast: ["Salma Abu Deif", "Ahmed Malek", "Marwan Pablo"],
    synopsis:
      "Inspired by real events, it chronicles the founding of EgyBest, the platform that shook the foundations of copyright in the Arab world. The story begins in an alley in El Marg district in Cairo, where two friends decide to turn their passion for the big screen into a digital rebellion."
  },
  {
    title: "Saffah El Tagammou",
    rating: "18+",
    duration: 90,
    genre: "Crime",
    language: "Arabic",
    subtitles: "None",
    releaseDate: release("2026-03-19"),
    poster: moviePoster("safahElTagamoa.jpg"),
    trailerUrl: "https://www.youtube.com/watch?v=WdxOXQ0a9n4",
    cast: ["Ahmed Al-Fishawy", "Sabrien", "Faten Saeed", "Cynthia Khalifeh"],
    synopsis:
      "It follows the story of a serial killer named Karim, who grew up alone searching for himself, and finds what he seeks in disobeying his family. Years later, he forms a relationship with a beautiful girl and begins a series of murders of a number of women."
  },
  {
    title: "Lee Cronin's The Mummy",
    rating: "18+",
    duration: 135,
    genre: "Horror",
    language: "English",
    subtitles: "Arabic",
    releaseDate: release("2026-04-16"),
    poster: moviePoster("theMummy.jpg"),
    trailerUrl: "https://www.youtube.com/watch?v=WdxOXQ0a9n4",
    cast: ["Jack Reynor", "Laia Costa", "May Calamawy"],
    synopsis:
      "The young daughter of a journalist disappears into the desert without a trace. Eight years later, the broken family is shocked when she is returned to them, as what should be a joyful reunion turns into a living nightmare."
  },
  {
    title: "The Desert Warrior",
    rating: "12+",
    duration: 125,
    genre: "Action",
    language: "English",
    subtitles: "Arabic",
    releaseDate: release("2026-04-23"),
    poster: moviePoster("desertWarrior.jpg"),
    trailerUrl: "https://www.youtube.com/watch?v=WdxOXQ0a9n4",
    cast: ["Aiysha Hart", "Ghassan Massoud", "Anthony Mackie"],
    synopsis:
      "7th century Arabia. Courageous Princess Hind refuses to serve as concubine to the merciless Sassanid Emperor Kisra. Escaping with her father into the unforgiving desert, Hind is pursued by Kisra's troops and forced to trust a mysterious bandit."
  },
  {
    title: "Project Hail Mary",
    rating: "G",
    duration: 155,
    genre: "Action",
    language: "English",
    subtitles: "Arabic",
    releaseDate: release("2026-03-19"),
    poster: moviePoster("projectHailMary.jpg"),
    trailerUrl: "https://www.youtube.com/watch?v=WdxOXQ0a9n4",
    cast: ["Ryan Gosling", "Sandra Huller", "Lionel Boyce", "Ken Leung"],
    synopsis:
      "Science teacher Ryland Grace wakes up on a spaceship light years from home with no recollection of who he is or how he got there. As his memory returns, he begins to uncover his mission: solve the riddle of the mysterious substance causing the sun to die out."
  },
  {
    title: "Hoppers",
    rating: "G",
    duration: 105,
    genre: "Animation",
    language: "English",
    subtitles: "Arabic",
    releaseDate: release("2026-03-18"),
    poster: moviePoster("Hoppers.jpg"),
    trailerUrl: "https://www.youtube.com/watch?v=WdxOXQ0a9n4",
    cast: ["Jon Hamm", "Piper Curda", "Bobby Moynihan"],
    synopsis:
      "An animal lover uses technology that places her consciousness into a robotic beaver to uncover mysteries within the animal world beyond her imagination."
  },
  {
    title: "The Raiders",
    rating: "12+",
    duration: 105,
    genre: "Action",
    language: "English",
    subtitles: "Arabic",
    releaseDate: release("2026-04-09"),
    poster: moviePoster("theRaiders.jpg"),
    trailerUrl: "https://www.youtube.com/watch?v=WdxOXQ0a9n4",
    cast: ["Jackie Chan", "Gulnezer Bextiyar", "Yixing Zhang"],
    synopsis:
      "Professor Fang leads a team of archaeologists to discover a mysterious jade that takes him back in time in an action-packed journey."
  },
  {
    title: "Family Business",
    rating: "12+",
    duration: 110,
    genre: "Comedy",
    language: "Arabic",
    subtitles: "None",
    releaseDate: release("2026-03-19"),
    poster: moviePoster("familyBusiness.jpg"),
    trailerUrl: "https://www.youtube.com/watch?v=WdxOXQ0a9n4",
    cast: ["Mohamed Saad", "Ghada Adel", "Hidy Karam"],
    synopsis:
      "A poor family struggles to survive through small acts of theft, while the father dreams of a better life for his children. After an incident that nearly lands him in prison, he decides to abandon crime, only to realize that reality offers them no real opportunities."
  },
  {
    title: "The Super Mario Galaxy Movie",
    rating: "G",
    duration: 100,
    genre: "Action",
    language: "Arabic",
    subtitles: "English",
    releaseDate: release("2026-04-02"),
    poster: moviePoster("superMarioGalaxy.jpg"),
    trailerUrl: "https://www.youtube.com/watch?v=WdxOXQ0a9n4",
    cast: ["Jack Black", "Anya Taylor-Joy", "Chris Pratt", "Charlie Day"],
    synopsis:
      "The Super Mario Galaxy Movie is an animated film based on the world of Super Mario Bros. This Arabic-language version follows Mario and friends through a bright cosmic adventure."
  },
  {
    title: "Goat",
    rating: "18 TC",
    duration: 95,
    genre: "Animation",
    language: "Arabic",
    subtitles: "None",
    releaseDate: release("2026-04-23"),
    poster: moviePoster("goat.jpg"),
    trailerUrl: "https://www.youtube.com/watch?v=WdxOXQ0a9n4",
    cast: ["Gabrielle Union", "Caleb McLaughlin", "Stephen Curry"],
    synopsis:
      "GOAT is an original action-comedy set in an all-animal world. Will, a small goat with big dreams, gets a once-in-a-lifetime shot to join the pros and prove that smalls can ball."
  },
  {
    title: "This is not a Test",
    rating: "18+",
    duration: 105,
    genre: "Horror",
    language: "English",
    subtitles: "Arabic",
    releaseDate: release("2026-04-23"),
    poster: moviePoster("thisIsNotATest.jpg"),
    trailerUrl: "https://www.youtube.com/watch?v=WdxOXQ0a9n4",
    cast: ["Olivia Holt", "Froy Gutierrez", "Corteon Moore"],
    synopsis:
      "Sloane and four classmates take cover in Cortege High to escape a world plagued by the infected. As danger relentlessly pounds on the doors, Sloane begins to see the world through the eyes of those who actually want to live and takes matters into her own hands."
  }
];

async function seed() {
  await connectDb();
  await Promise.all([
    SnackOrder.deleteMany({}),
    Reservation.deleteMany({}),
    Show.deleteMany({}),
    Movie.deleteMany({}),
    Concession.deleteMany({})
  ]);

  const movies = await Movie.insertMany(movieData);

  const now = new Date();
  const daysFromNow = (day, hour, minute = 30) => {
    const date = new Date(now);
    date.setDate(now.getDate() + day);
    date.setHours(hour, minute, 0, 0);
    return date;
  };

  const shows = movies.flatMap((movie, index) => {
    const day = (index % 5) + 1;
    return [
      {
        movie: movie._id,
        auditorium: `Screen ${(index % 4) + 1}`,
        startsAt: daysFromNow(day, 12 + (index % 2), 15),
        type: "standard",
        basePrice: movie.language === "Arabic" ? 130 : 150,
        bookedSeats: ["B4", "B5", "C7"].slice(0, (index % 3) + 1)
      },
      {
        movie: movie._id,
        auditorium: `Screen ${(index % 4) + 1}`,
        startsAt: daysFromNow(day, 15 + (index % 3), 30),
        type: "standard",
        basePrice: movie.language === "Arabic" ? 130 : 150,
        bookedSeats: ["D2", "D3"].slice(0, index % 2)
      },
      {
        movie: movie._id,
        auditorium: `Screen ${((index + 1) % 4) + 1}`,
        startsAt: daysFromNow(day + 1, 18 + (index % 2), 0),
        type: "standard",
        basePrice: movie.language === "Arabic" ? 135 : 155,
        bookedSeats: ["E8", "E9"].slice(0, (index + 1) % 2)
      },
      {
        movie: movie._id,
        auditorium: "Gold Cinema",
        startsAt: daysFromNow(day, 20 + (index % 2), 15),
        type: "gold",
        basePrice: movie.language === "Arabic" ? 160 : 180,
        goldSurcharge: 100,
        bookedSeats: ["A1", "A2"].slice(0, (index % 2) + 1)
      },
      {
        movie: movie._id,
        auditorium: "Gold Cinema",
        startsAt: daysFromNow(day + 2, 21, 45),
        type: "gold",
        basePrice: movie.language === "Arabic" ? 165 : 185,
        goldSurcharge: 110,
        bookedSeats: ["B3"].slice(0, index % 2)
      }
    ];
  });

  await Show.insertMany(shows);

  await Concession.insertMany([
    {
      name: "Caramel Popcorn",
      category: "snack",
      price: 65,
      image: poster("photo-1578849278619-e73505e9610f")
    },
    {
      name: "Nachos",
      category: "snack",
      price: 75,
      image: poster("photo-1513456852971-30c0b8199d4d")
    },
    {
      name: "Salted Pretzel",
      category: "snack",
      price: 55,
      image: poster("photo-1541592106381-b31e9677c0e5")
    },
    {
      name: "Cola",
      category: "drink",
      price: 35,
      image: poster("photo-1622483767028-3f66f32aef97")
    },
    {
      name: "Iced Coffee",
      category: "drink",
      price: 50,
      image: poster("photo-1461023058943-07fcbe16d735")
    },
    {
      name: "Movie Combo",
      category: "combo",
      price: 120,
      image: poster("photo-1585647347483-22b66260dfff")
    }
  ]);

  const existingDemo = await User.findOne({ email: "demo@cinema.com" });
  if (!existingDemo) {
    await User.create({
      name: "Demo User",
      email: "demo@cinema.com",
      password: "123456",
      points: 920
    });
  }

  console.log("Seeded movies, shows, seats, and concessions. Existing users were preserved.");
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});

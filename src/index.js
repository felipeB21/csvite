import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import passport from "passport";
import SteamStrategy from "passport-steam";
import session from "express-session";
import cors from "cors";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import indexRouter from "./routes/index.router.js";
import User from "./models/User.js";

dotenv.config();

const app = express();

app.use(express.static(path.join(__dirname, "../public")));
app.use(
  session({
    secret: "lama",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));

app.use(
  cors({
    origin: `http://localhost:${process.env.PORT ?? 3000}`,
    credentials: true,
  })
);

app.use("/", indexRouter);

// Steam passport strategy
passport.use(
  new SteamStrategy(
    {
      returnURL: "http://localhost:3000/auth/steam/return",
      realm: "http://localhost:3000/",
      apiKey: process.env.STEAM_API_KEY,
    },
    async function (identifier, profile, done) {
      try {
        let user = await User.findOne({ steamId: profile.id });
        if (!user) {
          user = new User({
            steamId: profile.id,
            username: profile.displayName,
            avatar: profile._json.avatar,
            profileUrl: profile._json.profileurl,
            visibility: profile._json.communityvisibilitystate,
            findTradeUrl: profile._json.profileurl
              .split("/")
              .filter(Boolean)
              .pop(),
          });
          await user.save();
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);

    done(null, user);
  } catch (error) {
    done(error);
  }
});

app.get("/auth/steam", passport.authenticate("steam"), function (req, res) {});

app.get(
  "/auth/steam/return",
  passport.authenticate("steam", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/");
  }
);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to mongo");
  })
  .catch((error) => {
    console.log(error);
  });

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`PORT: ${PORT}`);
});

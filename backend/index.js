require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

/* ---------------------------------------------------
   1. Arbitrage Calculation Function
--------------------------------------------------- */
function findArbitrageForGame(game) {
  const results = [];

  game.bookmakers.forEach((bookA) => {
    const marketA = bookA.markets.find((m) => m.key === "h2h");
    if (!marketA) return;

    game.bookmakers.forEach((bookB) => {
      if (bookA.key === bookB.key) return;
      const marketB = bookB.markets.find((m) => m.key === "h2h");
      if (!marketB) return;

      const awayA = marketA.outcomes.find((o) => o.name === game.away_team);
      const homeB = marketB.outcomes.find((o) => o.name === game.home_team);
      if (!awayA || !homeB) return;

      const oddsAway = awayA.price;
      const oddsHome = homeB.price;

      const pAway = 1 / oddsAway;
      const pHome = 1 / oddsHome;
      const totalProb = pAway + pHome;

      if (totalProb < 1) {
        const profitPct = (1 - totalProb) * 100;

        const awayStake = (100 * pAway / totalProb).toFixed(2);
        const homeStake = (100 * pHome / totalProb).toFixed(2);

        results.push({
          game: `${game.away_team} @ ${game.home_team}`,
          bookAway: bookA.title,
          bookHome: bookB.title,
          oddsAway,
          oddsHome,
          profitPct: profitPct.toFixed(2),
          stakeSplit: {
            awayStake,
            homeStake
          }
        });
      }
    });
  });

  return results;
}

/* ---------------------------------------------------
   2. TEST ROUTE
--------------------------------------------------- */
app.get("/", (req, res) => {
  res.send("Backend running");
});

/* ---------------------------------------------------
   3. Fetch NBA Odds
--------------------------------------------------- */
app.get("/api/nba", async (req, res) => {
  try {
    const response = await axios.get("https://api.the-odds-api.com/v4/sports/basketball_nba/odds", {
      params: {
        regions: "us",
        markets: "h2h",
        apiKey: process.env.ODDS_API_KEY
      },
      timeout: 5000
    });

    res.json(response.data);
  } catch (err) {
    console.error("NBA ERROR:", err.message);
    res.status(500).json({ error: "Failed to fetch NBA odds" });
  }
});

/* ---------------------------------------------------
   4. Arbitrage for NBA Only
--------------------------------------------------- */
app.get("/api/arbs/nba", async (req, res) => {
  try {
    const response = await axios.get("https://api.the-odds-api.com/v4/sports/basketball_nba/odds", {
      params: {
        regions: "us",
        markets: "h2h",
        apiKey: process.env.ODDS_API_KEY
      },
      timeout: 5000
    });

    const games = response.data;
    let allArbs = [];

    games.forEach((game) => {
      const gameArbs = findArbitrageForGame(game);
      allArbs = allArbs.concat(gameArbs);
    });

    res.json(allArbs);
  } catch (err) {
    console.error("ARB NBA ERROR:", err.message);
    res.status(500).json({ error: "Failed to compute NBA arbitrage" });
  }
});

/* ---------------------------------------------------
   5. List All Sports
--------------------------------------------------- */
app.get("/api/sports", async (req, res) => {
  try {
    const response = await axios.get("https://api.the-odds-api.com/v4/sports", {
      params: {
        apiKey: process.env.ODDS_API_KEY
      },
      timeout: 5000
    });

    res.json(response.data);
  } catch (err) {
    console.error("SPORTS ERROR:", err.message);
    res.status(500).json({ error: "Failed to fetch sports" });
  }
});

/* ---------------------------------------------------
   6. Arbitrage for ALL Sports (Main Feature)
--------------------------------------------------- */
app.get("/api/arbs/all", async (req, res) => {
  try {
    const sportsRes = await axios.get("https://api.the-odds-api.com/v4/sports", {
      params: { apiKey: process.env.ODDS_API_KEY },
      timeout: 5000
    });

    const sports = sportsRes.data;
    let allArbs = [];

    for (const sport of sports) {
      if (!sport.has_outrights) {
        try {
          const oddsRes = await axios.get(
            `https://api.the-odds-api.com/v4/sports/${sport.key}/odds`,
            {
              params: {
                regions: "us",
                markets: "h2h",
                apiKey: process.env.ODDS_API_KEY
              },
              timeout: 6000
            }
          );

          const games = oddsRes.data;

          games.forEach((game) => {
            const arbs = findArbitrageForGame(game);
            if (arbs.length > 0) {
              allArbs = allArbs.concat(
                arbs.map((a) => ({
                  ...a,
                  sport: sport.title
                }))
              );
            }
          });

        } catch (err) {
          console.log(`Skipping ${sport.key} → ${err.message}`);
        }
      }
    }

    res.json(allArbs);
  } catch (err) {
    console.error("ARB ALL ERROR:", err.message);
    res.status(500).json({ error: "Failed to compute all-sports arbitrage" });
  }
});

/* ---------------------------------------------------
   7. START SERVER  (VERY IMPORTANT: MUST BE LAST)
--------------------------------------------------- */
app.listen(5000, () =>
  console.log("Backend running on http://localhost:5000")
);

import { useEffect, useState } from "react";
import axios from "axios";

export default function NbaOdds() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/nba")
      .then(res => setGames(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>NBA Odds</h1>
      {games.map(game => (
        <div key={game.id} style={{ marginBottom: "20px", padding: "10px", border: "1px solid #ddd" }}>
          <h2>{game.away_team} @ {game.home_team}</h2>
          <p>{new Date(game.commence_time).toLocaleString()}</p>

          {game.bookmakers.map(book => {
            const h2h = book.markets.find(m => m.key === "h2h");
            if (!h2h) return null;

            return (
              <div key={book.key}>
                <h4>{book.title}</h4>
                {h2h.outcomes.map(o => (
                  <div key={o.name}>{o.name}: {o.price}</div>
                ))}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

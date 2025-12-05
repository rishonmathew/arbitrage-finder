import { useEffect, useState } from "react";
import axios from "axios";
import "./arbs.css";

export default function Arbs() {
  const [arbs, setArbs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("https://arbitrage-finder-enkv.onrender.com/api/arbs/all")
<<<<<<< HEAD

=======
>>>>>>> b071577a543899b08849291e58290718ff5032a2

      .then(res => {
        setArbs(res.data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  if (loading)
    return <div className="loading">Loading arbitrage opportunities...</div>;

  return (
    <div className="arb-page">
      <h1 className="arb-title">Arbitrage Finder</h1>

      {arbs.length === 0 && (
        <p className="no-arbs">No arbitrage available right now</p>
      )}

      <div className="arb-grid">
        {arbs.map((arb, index) => (
          <div className="arb-card" key={index}>
            <h2 className="arb-game">{arb.game}</h2>
            <p className="arb-sport">{arb.sport}</p>

            <div className="arb-odds">
              <div>
                <strong>{arb.bookAway}</strong>  
                <span>{arb.oddsAway}</span>
              </div>
              <div>
                <strong>{arb.bookHome}</strong>  
                <span>{arb.oddsHome}</span>
              </div>
            </div>

            <div className="arb-profit">
              Profit: <span>{arb.profitPct}%</span>
            </div>

            <div className="arb-stakes">
              <p>Away Stake: ${arb.stakeSplit.awayStake}</p>
              <p>Home Stake: ${arb.stakeSplit.homeStake}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

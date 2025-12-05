Real-time sports betting arbitrage detector (React + Node.js)

This project is a small full-stack application I built to automatically scan sports bookmakers and find arbitrage opportunities. Arbitrage betting is when odds between two different sites allow you to bet on both outcomes and still lock in a guaranteed profit, no matter who wins.

The app pulls live odds from the OddsAPI, compares prices across different bookmakers, and shows any games where an arbitrage exists, along with the recommended stake split and the expected profit percentage.

Tech Used: 

Frontend

React (Vite)
Axios for API calls
Custom CSS for styling
Hooks (useState, useEffect)
Hosted on Vercel

Backend
Node.js + Express
Axios for API requests
CORS
dotenv for environment variables
REST API endpoints for odds + arbitrage
Hosted on Render
REST API endpoints for odds + arbitrage


What the App Does

Fetches live odds for NBA (and any other supported sport)
Compares each bookmaker’s head-to-head markets
Detects arbitrage using the formula:

(1 / oddsTeamA) + (1 / oddsTeamB) < 1


Calculates:

Profit %
Optimal stake split
Bookmakers used
Game information
Displays opportunities in a clean UI with cards

📚 What I Learned / Skills Demonstrated

Building a full stack project from scratch
Calling an external API and handling rate limits
Cleaning, validating, and transforming JSON data
Building arbitrage detection logic (math + loops)
Using async/await and error handling properly
Deploying a backend on Render and frontend on Vercel
Dealing with CORS, environment variables, and HTTPS
Debugging real-world issues (timeouts, API failures, merge conflicts)

🛠️ How to Run Locally

Backend
cd backend
npm install


Create a .env file:

ODDS_API_KEY=your_api_key

Run the server:

npm start

Backend runs at:

http://localhost:5000

Frontend
cd frontend
npm install
npm run dev

Future Improvements

Add more sports + filters
Add auto-refresh
Add notifications for new arbitrage
Better error handling
Cache odds to reduce API usage
Cleaner animations and UI updates

🙋 About This Project

I built this mainly to learn more about API integrations, backend logic, and deploying full-stack apps. Arbitrage is something I’ve always been curious about, so I thought it would be a fun challenge to automate the math and make a small interface for it.

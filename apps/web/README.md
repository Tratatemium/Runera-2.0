# Runera

Frontend app for tracking and managing runs.

Live: https://runera.vercel.app/

## Core Features

- Authentication flow (sign up, log in, protected user routes)
- Personal dashboard and user info page
- Run tracking: create, view, edit, and delete runs
- Run form with pace preview, weather tags, effort level, and notes
- Profile editing (name, date of birth, height, weight)

## Setup

1. Install dependencies:
	npm install
2. Create a .env file in the project root:
	REACT_APP_API_BASE_URL=https://runners-api-lac.vercel.app/api/v1/
3. Start the app:
	npm start

## Scripts

- npm start: Run in development mode (http://localhost:3000)
- npm test: Run tests
- npm run build: Build production bundle
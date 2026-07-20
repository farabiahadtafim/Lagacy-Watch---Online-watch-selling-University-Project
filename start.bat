@echo off
echo Starting the Backend...
start cmd /k "cd backend && npm run dev"

echo Starting the Frontend...
start cmd /k "cd frontend && npm run dev"

echo Both servers are starting up!
echo The website should be available at http://localhost:3000 shortly.

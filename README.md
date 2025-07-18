# BiteCult – Global Recipe Discovery Platform

BiteCult is a full-stack web application designed to provide a seamless experience for discovering, creating, and managing recipes from across the globe. Developed with a modern technology stack, this project aims to serve culinary enthusiasts with an elegant, responsive, and feature-rich platform.

## Project Description

BiteCult was created out of personal necessity. As a passionate food lover, I often found it frustrating to search for recipes across multiple platforms and blogs. There was no single place that catered to all of my needs – filtering by allergens, exploring cuisines, viewing tips, or uploading personal recipe ideas. Thus, I built BiteCult – an intuitive, community-focused recipe platform to help fellow foodies discover global flavours in one place.

## Features

User registration and login system with JWT authentication  
Create, edit, and delete personal recipes  
Upload images to accompany each recipe  
Categorise recipes by origin, dietary suitability, allergens, tags, and difficultylevel  
Search and filter through all available recipes  
Responsive interface optimised for both desktop and mobile devices  
User-friendly form validation and error handling  
Favourite feature to save preferred recipes  
Image hosting through static uploads

## Technology Stack

### Frontend  
Next.js with App Router  
Tailwind CSS  
React Select for country and tag selection  
Framer Motion for smooth animations  

### Backend  
FastAPI (Python)  
PostgreSQL with SQLAlchemy  
JWT-based authentication  
Pydantic for schema validation  
Image storage with static file serving  

### Deployment  
Frontend: Vercel  
Backend: Render  
Database: PostgreSQL (Render)

## Installation Instructions

1. Clone the repository  
2. Navigate to the `backend` folder and create a virtual environment  
3. Install dependencies from `requirements.txt`  
4. Run FastAPI using `uvicorn main:app --reload`  
5. Navigate to the `frontend` folder and run `npm install`  
6. Start the frontend with `npm run dev`  
7. Create appropriate `.env` files for both frontend and backend with your keys, URLs, and database connection details

## Screenshots

`![Homepage](screenshots/lending_page.png)`
`![Loginpage](screenshots/login_signup.png)`
`![Dashboard](screenshots/dashboard.png)`

## Live Demo

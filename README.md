# UITOP Technical Assignment  
A full-stack web application built for a technical assignment at UITOP.  
This project includes a frontend, backend, and Docker Compose configuration to bring everything up easily.

---

## Overview  
This repository contains the implementation of the technical assignment for UITOP:  
- The **frontend** (written in TypeScript + React, plus TailwindCSS)  
- The **backend** (API, business logic, database layer)  
- A `docker-compose.yml` file to orchestrate the services together  

The application aims to showcase clean architecture, modular design, and a full deployment workflow.

---

## Features  
- Responsive UI built with modern web technologies  
- RESTful backend API with endpoints for required data handling  
- Persistent storage (database) for application data  
- Dockerised setup for local development and easy deployment  
- TypeScript used throughout for type safety and clarity  
- CSS for styling, maintainable and modular  

---

## Tech Stack  
- **Frontend**: React, TypeScript, CSS  
- **Backend**: Nest.js, TypeScript  
- **Database**: SQLite
- **Containerisation**: Docker & Docker Compose  
- **Build tools**: Vite 
- **Deployment**: Vercel, Heroku

---

## API Documentation  

The backend API is available at:  http://localhost:3000

## Environment Variables

This project requires environment variables for both backend and frontend.  
Create `.env` files in the respective directories (`backend/` and `frontend/`) using the examples below.

---

### Backend (`backend/.env`)

| Variable         | Description                                     | Example                     |
|-----------------|-------------------------------------------------|----------------------------|
| `NODE_ENV`       | Environment mode (`development` or `production`) | `development`              |
| `PORT`           | Port on which the backend runs                  | `3000`                     |
| `SQLITE_PATH`    | Path to the SQLite database file               | `database.sqlite`          |
| `CORS_ORIGINS`   | Allowed origins for CORS                        | `http://localhost:5173`    |
| `SWAGGER`        | Enable or disable Swagger UI (`true`/`false`)  | `true`                     |
| `VERCEL`         | Flag for Vercel deployment (`true`/`false`)   | `false`                    |

### Frontend (`frontend/.env`)

| Variable         | Description                                     | Example                     |
|-----------------|-------------------------------------------------|----------------------------|
| `VITE_API_URL`       | Base URL                                   |    http://localhost:3000 |

## Getting Started  

### Prerequisites  
- [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/) installed

 ## Docker Compose Rules for `docker-compose up --build`

When using the command:

```bash
docker-compose up --build
```

## Known Weak Points & Self-Reflection

Basically my solution around aborting (undo) requests was kind of not the best.  
The approach I've taken could be really simplified.  
So I got kind of lost around three approaches:

1. **Current one**, having something like timeout that is going to manipulate data in memory before sending the request.  
2. **Having something like AbortableRequests**, can be implemented through axios, didn’t like this approach, cause looked too overcomplicated for this problem.  
3. **Having soft delete records in db** with property called (`deletedAt`) and deleting item from db, and when it is aborted send undo request.

So why I've chosen first one — on paper it looked more easier than abortable request approach, and more suitable than soft delete.  
The cons of approach that if you're going to delete some record, and then create new record, refetch function can retrieve this item and update the whole state.  
So basically approach was a little bit bad due to having issue with one source of truth.

I'd like you to explain to me how you'd approach this problem and give the feedback on that one, cause it might improve my skills.  
It would be very much appreciated.

---

## To Answer Your Questions

### 1) Did you use AI at any stage while working on this task? Why? What kind of problems or uncertainties AI helps you resolve during the process?

(I guess these questions are related so they're grouped in one answer)

So yes, I've used AI during the stage of developing but mostly it was for deployment and tests.  
Cause I think test cases are important part of a job, but it can be simplified with AI, cause it easily covers some test cases.  
Also of course, when I had a doubt about implementing some part of logic (such as `useUndoableDelete`) I was using it in order to have some kind of discussion which approach can be better, and which cases I should cover.  
The same was with `useFetch` hook (note: I'd love to use TanStack Query, as it provides more easier approach to retrieve data).



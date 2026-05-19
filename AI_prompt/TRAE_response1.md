## What to do (step-by-step)

### Phase 1 — Mock APIs (Mockoon)

1. Create 4 endpoints in Mockoon:
   - `POST /api/login` → returns `{ accessToken, refreshToken, user }`
   - `POST /api/logout` → returns `{ success: true }`
   - `GET /api/product` → returns **≥ 100** products (I used 120)
   - `GET /api/product/:id` → returns a single product
2. Export the Mockoon environment JSON as `mockoon-data.json`.
3. Make sure the API listens on a fixed port (I used **3001**).

### Phase 2 — Frontend (Next.js)

4. Build 3 screens:
   - **Login**: submit username/password → call `/api/login` → store tokens
   - **Product list**: call `/api/product`, render cards (name/image/description + “View detail”)
   - **Product detail**: call `/api/product/{id}`
5. Add **Search** (by product name) + **Filter** (select any product field + enter value).
6. Add **Logout**: call `/api/logout` → clear tokens → go back to `/login`.
7. Make it responsive for desktop (≥1280px) and mobile.

### Phase 3 — Containerization

8. Create `Dockerfile` for the frontend.
9. Create `docker-compose.yml` with two services:
   - `frontend` (Next.js)
   - `mock-api` (official `mockoon/cli`)
10. Ensure FE can talk to Mock API (I used **Next rewrites** so the frontend can always call `/api/...` and Next proxies to the mock container).

### Phase 4 — Submission docs

11. Add `DECISION_LOG.md` (Vietnamese allowed) describing key decisions and progress.

---

## Your completed implementation (source code)

[View README (how to run)](computer:///sessions/6a0b0c7c477385a64cc1bbfa/workspace/product-showcase/README.md)  
[View DECISION_LOG.md](computer:///sessions/6a0b0c7c477385a64cc1bbfa/workspace/product-showcase/DECISION_LOG.md)  
[View mockoon-data.json](computer:///sessions/6a0b0c7c477385a64cc1bbfa/workspace/product-showcase/mockoon-data.json)  
[View Dockerfile](computer:///sessions/6a0b0c7c477385a64cc1bbfa/workspace/product-showcase/Dockerfile)  
[View docker-compose.yml](computer:///sessions/6a0b0c7c477385a64cc1bbfa/workspace/product-showcase/docker-compose.yml)

To run it with Docker on your machine: `docker compose up --build` inside the `product-showcase` folder.

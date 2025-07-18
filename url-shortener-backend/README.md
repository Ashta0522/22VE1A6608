# URL Shortener Microservice (Node.js + TypeScript)

A robust, production-grade HTTP URL Shortener microservice with custom logging, JWT authentication for logs, and full API for shortening, redirecting, and analytics.

## Features
- Shorten any valid URL with optional custom shortcode
- Default expiry: 30 minutes (customizable)
- Unique, alphanumeric shortcodes
- Redirect endpoint with click tracking
- Analytics endpoint: total clicks, click details, creation, expiry
- Custom logging middleware (logs sent to evaluation API, not console)
- JWT-based authentication for logging
- In-memory storage (easy to swap for DB)
- Proper error handling (400, 404, 409, 410, 500)

## Setup & Run

1. **Clone or download this folder**
2. **Install dependencies:**
   ```
   npm install
   ```
3. **Fill in your credentials** in `src/utils/auth.ts` (companyName, clientID, clientSecret, ownerName, ownerEmail, rollNo)
4. **Start the server (dev mode):**
   ```
   npm run dev
   ```
   Or build and run production:
   ```
   npm run build
   npm start
   ```
5. **API is available at:**
   - `http://localhost:8000`

## API Endpoints

### Create Short URL
- **POST** `/shorturls`
- **Body:**
  ```json
  {
    "url": "https://example.com/very/long/url",
    "validity": 30,         // optional, minutes
    "shortcode": "mycode"  // optional, must be unique
  }
  ```
- **Response:**
  ```json
  {
    "shortLink": "http://localhost:8000/mycode",
    "expiry": "2025-01-01T00:30:00Z"
  }
  ```

### Redirect to Original URL
- **GET** `/:shortcode`
- Redirects to the original URL if valid and not expired
- Tracks click (timestamp, referrer, IP)

### Get Short URL Statistics
- **GET** `/shorturls/:shortcode`
- **Response:**
  ```json
  {
    "url": "https://example.com/very/long/url",
    "created": "2025-01-01T00:00:00Z",
    "expiry": "2025-01-01T00:30:00Z",
    "totalClicks": 2,
    "clicks": [
      { "timestamp": "2025-01-01T00:05:00Z", "referrer": "...", "ip": "..." }
    ]
  }
  ```

## Notes
- All logs are sent to the evaluation API with JWT auth (see `src/middleware/logger.ts`)
- No user registration/login for API usage (only for logging)
- In-memory storage resets on server restart

---

**For any issues, check your credentials and network access to the evaluation API.** 
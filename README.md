# XBZ Intelligence — Courier Delivery Intelligence & Risk Analysis Platform
**Branded by Naim Xbz** | *Smarter. Safer. Faster.*

XBZ Intelligence is a Bangladesh-focused courier delivery intelligence and transparent delivery-risk analysis platform engineered for e-commerce merchants and visitors. It enables merchants to inspect historical Cash-on-Delivery (COD) performance, cancellation ratios, and delivery-risk indicators backed exclusively by authorized courier API endpoints.

---

## 🚀 Key Features

1. **Public Phone Number History Lookup**
   - No mandatory login required for public queries.
   - Strict 11-digit Bangladesh phone validation (`013`–`019`) and normalization (`+880` strip and clean).
   - Consumer privacy protection via automatic phone masking (`01712-***456`).

2. **Honest Courier Adapter Architecture**
   - Dedicated adapters for **Steadfast**, **Pathao**, **REDX**, **Paperfly**, and **eCourier**.
   - Transparent capability declarations: phone lookup is distinguished from order tracking.
   - Never fabricates fake connection statuses, delivery counts, or fraud scores.
   - Strictly respects `scoring_disabled: true` without inventing synthetic scores.

3. **Transparent Mathematical Risk Analysis**
   - **Low Risk**: Delivery Rate $\ge 85\%$ with at least 3 historical records.
   - **Moderate Risk**: Delivery Rate $60\%–84\%$ or Cancellation Rate $20\%–39\%$.
   - **High Review Recommended**: Cancellation Rate $\ge 40\%$ or Delivery Rate $< 60\%$.
   - **Insufficient Data**: Less than 2 recorded orders (avoids false profiling).
   - Clear disclaimer that courier history is an operational review indicator, not a consumer blacklist.

4. **Bilingual Experience (Bengali & English)**
   - Bengali is the default language with natural, authentic copy.
   - Instant language switching to English across all cards, forms, and results.

5. **Merchant Accounts & Personal Dashboard**
   - Secure login & registration (`/login`, `/signup`).
   - Saved lookup history with CSV export capability (`/account`).

6. **Protected Administrator Portal**
   - Secure server-side authorization via `ADMIN_PASSKEY`.
   - Real-time system health, uptime, active rate-limiting IP monitor, and diagnostic probe runner.
   - Redacted audit log ledger.

---

## 🛠️ Courier API Integration Checklist

| Provider | Phone History Lookup | Order Tracking | Official Endpoint Pattern | Capability Status |
| :--- | :--- | :--- | :--- | :--- |
| **Steadfast** | ✅ Supported | ✅ Supported | `GET /fraud_check/score/{phone}` | Configured / Key-Dependent |
| **Pathao** | ⚠️ Enterprise Partner Only | ✅ Supported | `POST /aladdin/api/v1/orders/{id}/info` | Consignment Tracking Only |
| **REDX** | ❌ Unsupported in Public API | ✅ Supported | `GET /v1.0.0-beta/parcels/{id}` | Parcel Tracking Only |
| **Paperfly** | ❌ Unsupported in Public API | ✅ Supported | `POST /API-Order-Tracking` | Reference Tracking Only |
| **eCourier** | ❌ Unsupported in Public API | ✅ Supported | `GET /api/track/{airway_bill}` | Airway Bill Tracking Only |

---

## 💻 Local Development & Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your courier credentials (or test immediately with the built-in Sandbox Scenarios):
```ini
# Steadfast Courier (Live API)
STEADFAST_API_BASE_URL="https://portal.steadfast.com.bd/api/v1"
STEADFAST_API_KEY="your_api_key_here"
STEADFAST_SECRET_KEY="your_secret_key_here"

# Admin & Session Security
ADMIN_PASSKEY="admin123"
SESSION_SECRET="your_secure_session_secret"
PORT=3000
```

### 3. Run Development Server
```bash
npm run dev
```
The server will start at `http://0.0.0.0:3000` with the Express API and Vite frontend.

### 4. Run Automated Test Suite
```bash
npm run test
```

---

## 🧪 Built-In Sandbox & Demonstration Scenarios

To enable testing without requiring paid production courier keys, the interface provides quick scenario buttons under the search form:

- **01711000001 (Clean Record)**: 25 delivered, 1 cancelled (96% delivery rate) $\rightarrow$ Low Risk.
- **01711000002 (High Cancellation)**: 4 delivered, 11 cancelled (73% cancellation rate) $\rightarrow$ High Review Recommended.
- **01711000003 (Scoring Disabled)**: 12 delivered, 2 cancelled, provider has `scoring_disabled: true` $\rightarrow$ No score hallucinated.
- **01711000004 (New Customer)**: 0 recorded orders $\rightarrow$ Insufficient Data.
- **01711000005 (Timeout Simulation)**: Demonstrates partial results and provider gateway timeout recovery.

---

## 🔐 Credentials for Testing

- **Demo Merchant Account**:
  - Email: `merchant@xbz.intelligence`
  - Password: `merchant123`
- **Admin Portal**:
  - Passkey: `admin123` (Access via the Lock icon in the header or `/admin`)

---

## ⚖️ Legal & Privacy Compliance

- **No Public Blacklists**: Consumers are never labeled as fraudulent.
- **Phone Masking**: Complete phone numbers are masked in all standard reports.
- **Server Secrets**: API credentials are kept strictly server-side and never exposed to client bundles.

© 2026 XBZ Intelligence. Branded by Naim Xbz. All rights reserved.

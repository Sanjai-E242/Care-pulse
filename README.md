# CarePulse AI
### AI-Agent-Powered Caregiver Intelligence and Burnout Prevention System

CarePulse AI is a full-stack, production-style healthcare decision-support and coordination platform connecting **Family Caregivers**, **Professional Caregivers (CNAs)**, **Care Coordinators**, and **Clinical Staff (MDs/RNs)**.

The system translates everyday voice and text observations into structured clinical signals, predicts caregiver burnout before critical exhaustion occurs, detects longitudinal patient patterns, coordinates family care circles, and synthesizes intelligent shift handovers.

---

## 🌟 Key Features

1. **Smart Observation Capture ("Tell Us What Happened")**:
   - Voice-first via browser Web Speech API or natural text input.
   - Dual-mode AI extraction (local rule-based NLP + LLM abstraction) classifying observations into categories (Fall, Confusion, Appetite, Mobility, etc.), severity, sentiment, and recommended actions.
   - Safety confirmation step: *"We understood this as... Is this correct?"* before saving to MySQL.

2. **Emergency Triage & Safety System**:
   - Immediate red-flag detection (severe dyspnea, unconsciousness, chest pain, stroke signs).
   - Prominent Emergency Modal and 108 direct call action.
   - Clinical disclaimer across all decision-support views: *AI-generated guidance — never a clinical diagnosis.*

3. **Caregiver Burnout Prediction & Prevention**:
   - Dynamic 0–100 strain index based on task load, overdue tasks, negative observation sentiment, consecutive care days, and self-reported wellbeing.
   - Interactive Wellbeing Check-in modal (*Doing okay, A little overwhelmed, Very overwhelmed, Struggling*).
   - High-strain intervention panel with instant task redistribution.

4. **Intelligent Shift Handover**:
   - Automatically synthesizes top 3–5 important shift observations, emerging multi-day patterns, watch list items, and completed vs. pending tasks.
   - Copy, Print, and "Mark Reviewed" workflows for seamless staff transitions.

5. **Family Care Coordination**:
   - Shared synchronized patient chart for family members.
   - Task assignment, completion, and rebalancing.
   - Family discussion board with neutral AI consensus summarization.

6. **Longitudinal Trends & Analytics**:
   - Interactive Recharts visualization tracking Appetite, Sleep Restfulness, Mood, and Mobility over 7-day windows.

7. **Role-Tailored Portals**:
   - **Family Caregiver**: Daily care overview, patient status cards, quick wellbeing check-in, recent signals timeline.
   - **Professional CNA**: Active shift monitor (Morning: 04:00 - 12:00 / Afternoon: 12:00 - 20:00 / Night: 20:00 - 04:00), watch items, shift tasks, handover generator.
   - **Care Coordinator**: Systemwide overview, burnout monitoring table, high-risk flags, task rebalancing.
   - **Clinical Staff**: 72-hour AI synthesized clinical summary, behavioral/functional changes, and escalation recommendations.

---

## 🛠 Technology Stack

- **Frontend**: React 18, Vite, TypeScript, React Router v6, Tailwind CSS, Lucide React icons, Recharts, Axios.
- **Backend**: Java 17, Spring Boot 3.2.5, Spring Security, Spring Data JPA, Hibernate, Bean Validation, JJWT (HMAC-SHA256).
- **Database**: MySQL 8.0 (`carepulse_db`).
- **AI Architecture**: 6 dedicated Spring AI agent services (`ObservationAgent`, `PatternDetectionAgent`, `HandoverAgent`, `BurnoutAgent`, `GuidanceAgent`, `FamilyCoordinationAgent`).
- **API Documentation**: Springdoc OpenAPI / Swagger UI.

---

## 👥 Seeded Demo Accounts

You can immediately explore the system using the pre-seeded demo accounts (all passwords securely hashed with BCrypt):

| Role | Email | Password | Pre-configured Persona |
| :--- | :--- | :--- | :--- |
| **Family Caregiver** | `family@carepulse.com` | `password123` | Sarah Johnson (Daughter to Mary Johnson, 78) |
| **Professional Caregiver** | `professional@carepulse.com` | `password123` | David Miller, CNA (Assigned to Mary, Robert, Susan) |
| **Care Coordinator** | `coordinator@carepulse.com` | `password123` | Elena Vance, RN (System monitoring & task rebalancing) |
| **Clinical Staff** | `clinical@carepulse.com` | `password123` | Dr. Robert Chen, MD (Clinical summaries & trends) |

*Tip: A 1-click Demo Role Switcher is also embedded in the top navigation bar for rapid inspection during reviews.*

---

## 🚀 Getting Started

### Prerequisites
- **Java 17** (verified: Eclipse Adoptium OpenJDK 17)
- **Node.js 18+** (verified: v24.18.0)
- **MySQL 8.0** running on `localhost:3306`

### 1. Database Setup
Ensure MySQL is running and the database exists:
```sql
CREATE DATABASE IF NOT EXISTS carepulse_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Run Backend
```powershell
cd backend
# Using Maven wrapper or local Maven
mvn clean spring-boot:run
```
The backend starts on `http://localhost:8080`.
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

### 3. Run Frontend
```powershell
cd frontend
npm install
npm run dev
```
The frontend starts on `http://localhost:5173`.

---

## 🚀 Production Deployment (Vercel & Supabase)

### Database: Supabase PostgreSQL
1. Create a project on [Supabase](https://supabase.com).
2. Go to **Project Settings** → **Database** → **Connection String** → **Session Pooler (Port 5432)**.
3. Configure your backend environment variables:
   ```env
   SUPABASE_DB_URL=jdbc:postgresql://<db-host>:5432/<db-name>?sslmode=require
   SUPABASE_DB_USERNAME=postgres.<project-ref>
   SUPABASE_DB_PASSWORD=<your-supabase-db-password>
   ```

### Backend Deployment (Container / Cloud)
- Multi-stage Dockerfile provided: `Dockerfile.vercel`.
- Listens dynamically on `${PORT:8080}` and binds to `0.0.0.0`.
- Health endpoint: `GET /api/health` returns `{"status": "UP", "database": "UP"}`.
- Configure `CORS_ALLOWED_ORIGINS=https://care-curse.vercel.app`.

### Frontend Deployment (Vercel)
1. Import repository into Vercel.
2. In Project Settings → **Environment Variables**, set:
   ```env
   VITE_API_BASE_URL=https://<your-deployed-backend-url>/api
   ```
3. Deploy! Vite will bundle the API client pointing to your live backend, with automatic fallback to `/api` (same origin) when deployed.
4. `vercel.json` provides SPA routing rewrites so direct navigation to `/dashboard`, `/patients`, etc. never returns 404.
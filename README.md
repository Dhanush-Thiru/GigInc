# 🛡️ GigInc - AI- Powered Insurance for India's Gig Economy

> *trigger-based weekly insurance, Powered by AI*

---

## 📑 Table of Contents

1. [Project Overview](#project-overview)
2. [Persona-Based Scenarios & Workflow](#persona-based-scenarios--workflow)
3. [Weekly Premium Model & Parametric Triggers](#weekly-premium-model--parametric-triggers)
4. [Platform Choice: Web vs. Mobile](#platform-choice-web-vs-mobile)
5. [AI/ML Integration](#aiml-integration)
6. [Tech Stack](#tech-stack)
7. [Development Plan](#development-plan)
8. [Additional Considerations](#additional-considerations)
9. [Team & Contact](#team--contact)

---

## 📌 Project Overview

**GigInc** is a [describe the type of insurance — e.g., crop, health, gig-worker, vehicle] insurance platform designed for **delivery partners**. Unlike traditional insurance, this platform uses a **parametric model** — meaning claims are triggered automatically based on measurable, predefined conditions, with no lengthy claim process.

### Problem Statement

> *To protect their livelihoods from uncontrollable external disruptions (weather, app crashes, curfews) that cause immediate loss of daily wages.*

### Solution

> *[Summarize your solution in 2–3 sentences. e.g., "We offer a ₹[X]/week premium plan where payouts are automatically triggered when [specific parametric event — e.g., rainfall drops below X mm, temperature exceeds Y°C]. The entire experience — enrolment, payment, and payout — happens via [Web/Mobile App]."]*

---

## 👤 Persona-Based Scenarios & Workflow

### Persona 1: Arjun — Swiggy Delivery Partner (Rural Fringe)

| Attribute | Details |
|-----------|---------|
| **Name** | Arjun Kumar, 31 |
| **Occupation** | Swiggy Delivery Partner (Two-Wheeler) |
| **Location** | Tambaram, Chennai outskirts |
| **Tech Literacy** | Medium — uses smartphone for Swiggy app, UPI payments |
| **Pain Point** | No accident or income-loss coverage; one road mishap means zero earnings and out-of-pocket hospital bills |
| **Goal** | Affordable weekly accident + income-protection coverage he can activate before his shift starts |

**Scenario:**

> *Arjun hears about the platform through a WhatsApp forward in his Swiggy delivery partner group. He signs up using his Aadhaar number and links his bank account in under 5 minutes. He selects a ₹25/week plan that covers accidental hospitalisation up to ₹10,000 and daily income loss of ₹300 for up to 7 days. He pays via UPI auto-debit every Monday morning. One evening, Arjun skids on a wet road and fractures his wrist. He taps "Report Incident" in the app, uploads a photo of the hospital discharge summary, and within 48 hours receives ₹2,100 (7 days × ₹300) as income-loss cover directly to his bank account — no agent visit, no paper forms required.*

**Workflow:**
```
[WhatsApp/Partner Group Referral] → [Aadhaar-based Sign-Up] → [Plan Selection (Accident + Income Loss)]
     → [Weekly UPI Auto-Debit] → [Incident Reported via App]
          → [Document Verification (48 hrs)] → [Automatic Payout] → [One-tap Renewal]
```

---

### Persona 2: Divya — Zomato Delivery Partner (Urban, Tech-Savvy)

| Attribute | Details |
|-----------|---------|
| **Name** | Divya Ramesh, 26 |
| **Occupation** | Zomato Delivery Partner (Part-time, Two-Wheeler) |
| **Location** | Anna Nagar, Chennai |
| **Tech Literacy** | High — uses smartphone daily, comfortable with apps and digital payments |
| **Pain Point** | Works gig shifts 4 days a week; doesn't want to pay for coverage on days she's not riding |
| **Goal** | Flexible per-shift or weekly coverage she can pause and resume instantly based on her schedule |

**Scenario:**

> *Divya discovers the platform through an in-app banner on the Zomato partner dashboard. She completes KYC in minutes via DigiLocker and selects a flexible ₹10/shift micro-plan that activates the moment she goes online on Zomato and pauses automatically when she logs off. During a busy Saturday shift, a car rear-ends her at a signal. She taps "Claim" in the platform app, and since her shift was active at the time of the incident, the system auto-validates the coverage window. She receives a ₹5,000 hospitalisation payout within 36 hours, with a WhatsApp notification confirming each step of the process.*

**Workflow:**
```
[In-App Discovery (Zomato Partner Dashboard)] → [KYC via DigiLocker] → [Select Per-Shift Micro-Plan]
     → [Auto-Activate on Shift Start / Pause on Logout] → [Incident Reported]
          → [Coverage Window Auto-Validated] → [Instant Payout Notification] → [One-tap Renewal]
```

---

### Persona 3: Murugan — Multi-Platform Delivery Rider (Veteran Partner)

| Attribute | Details |
|-----------|---------|
| **Name** | Murugan Selvaraj, 44 |
| **Occupation** | Delivery Partner across Swiggy, Zomato & Dunzo (Full-time, primary income) |
| **Location** | Velachery, Chennai |
| **Tech Literacy** | Low-Medium — relies on voice prompts and Tamil-language UI |
| **Pain Point** | Rides 10–12 hours daily with no health or life cover; family has no financial backup if he's hospitalised or worse |
| **Goal** | Comprehensive weekly plan covering accident, hospitalisation, and a small life cover component — in Tamil |

**Scenario:**

> *Murugan's son helps him sign up after seeing a regional-language YouTube ad about the platform. The app interface is set to Tamil, and an IVR helpline in Tamil walks Murugan through plan selection. He chooses a ₹50/week comprehensive plan covering accidental death (₹1,00,000 nominee payout), hospitalisation (₹15,000), and 10-day income loss (₹350/day). Premiums are deducted every Sunday via UPI. Six months later, Murugan is hospitalised after a severe accident. His wife calls the Tamil helpline, submits documents via WhatsApp, and receives a ₹15,000 hospitalisation payout within 3 days and a ₹2,500 income-loss transfer — without Murugan needing to navigate a single English-language form.*

**Workflow:**
```
[Regional Language Ad / IVR Onboarding (Tamil)] → [Son-Assisted Aadhaar Sign-Up] → [Comprehensive Plan Selection]
     → [Weekly UPI Auto-Debit (Sunday)] → [Incident Reported via WhatsApp / Helpline]
          → [Document Submission & Verification] → [Hospitalisation + Income-Loss Payout] → [Family-Assisted Renewal]
```
### General Application Workflow

```
User Registration
      │
      ▼
Identity Verification (KYC)
      │
      ▼
Risk Profile Assessment (AI-powered)
      │
      ▼
Plan Selection & Weekly Premium Quote
      │
      ▼
Payment (UPI / Wallet / Bank Auto-debit)
      │
      ▼
Active Coverage Period Begins
      │
      ▼
Parametric Trigger Monitoring (Real-time / Daily)
      │
      ├── NO TRIGGER → Continue Coverage / Auto-renew
      │
      └── TRIGGER DETECTED → Validate → Auto Payout → Notify User
```

---

## 💰 Weekly Premium Model & Parametric Triggers

### Why Weekly?

> *Daily wage earners and gig workers earn irregularly — income varies day to day and week to week. A weekly premium of ₹25–₹40 removes the single biggest barrier to insurance adoption: upfront cost. Unlike annual or monthly plans that require a lump sum, weekly micro-premiums align with how this population actually earns and spends. Users can also pause or skip a week between jobs, making it flexible rather than a fixed obligation.*

### Premium Pricing Model

| Plan Tier | Weekly Premium | Coverage Amount | Target User |
|-----------|---------------|-----------------|-------------|
| Basic | ₹25 | ₹500 | [e.g., Subsistence farmers] |
| Standard | ₹35 | ₹600 | [e.g., Gig workers] |
| Premium | ₹40 | ₹700 | [e.g., Small business owners] |

**Premium Calculation Factors:**
Geographic risk zone — users in flood-prone or high-heat districts (e.g., coastal Chennai, interior Coimbatore) pay a slightly higher base rate reflecting historical trigger frequency in that pincode.

Disruption type selected — environmental triggers (rain, heat) and social triggers (bandh, curfew) carry different historical frequencies and are priced accordingly.

Historical trigger frequency — zones where triggers have fired more than 4 times in the past 12 months attract a loading factor on the base premium.

Coverage duration — users who maintain uninterrupted weekly coverage for 8+ consecutive weeks receive a 5% loyalty discount, reducing churn and rewarding consistency.

Onboarding channel — users enrolled through NGO or SHG partners receive a subsidised entry premium for the first 4 weeks, funded through the partner programme, to lower the initial adoption barrier.

Prior payout history — users with no triggered payouts over a rolling 6-month period are eligible for a no-claim discount of up to 10% on renewal, incentivising retention without punishing genuine claims.

---

### Parametric Triggers

Unlike traditional insurance, **no claim filing is required**. Payouts are triggered automatically when a measurable condition crosses a defined threshold.

| Trigger Type | Data Source | Threshold Example | Payout Condition |
|---|---|---|---|
| [e.g., Rainfall Deficit] | [e.g., IMD / NASA CHIRPS] | [e.g., < 50mm in 7 days] | [e.g., Full payout if < 30mm, partial if 30–50mm] |
| [e.g., Flood Index] | [e.g., Satellite / River gauge data] | [e.g., Water level > X metres] | [e.g., Full payout] |
| [e.g., Temperature Spike] | [e.g., Weather API] | [e.g., > 45°C for 3+ days] | [e.g., Tiered payout] |
| [e.g., Accident / GPS event] | [e.g., App telemetry] | [e.g., Sudden deceleration event] | [e.g., Partial payout] |
| [Add your trigger] | [Data source] | [Threshold] | [Payout logic] |

**Trigger Justification:**
Objective — all triggers use third-party data (IMD, government alerts) with no subjective judgment. The threshold is either crossed or it is not.

Directly tied to income loss — rain stops riders, heat shuts construction sites, curfews ground auto drivers. The trigger is the loss event itself, not an approximation of it.

No moral hazard — payouts are driven by external data, not user-reported claims. Users cannot influence whether a trigger fires.

Fast payout — full automation means funds reach the user within hours, not days — critical for workers with zero savings buffer.

---

## 📱 Platform Choice: Web vs. Mobile

**Chosen Platform: [Web / Mobile / Both]**

| Criteria | Web App | Mobile App |
|----------|---------|------------|------------|
| Target user device access | ✅ Desktop & Mobile browser | ✅ Smartphone only |
| Offline capability | ❌ Limited | ✅ Better via PWA/native |
| Distribution | ✅ No app store needed | ❌ App store required |
| Push Notifications | ❌ Limited | ✅ Native |
| Development cost | ✅ Lower | ❌ Higher (iOS + Android) |
| UPI / Payment integration | ✅ Feasible | ✅ Better UX |

**Justification:**
> *[Explain your choice. e.g., "We chose a Mobile-first Progressive Web App (PWA) because our target users primarily access the internet via smartphones, the app store barrier is eliminated, and we can still deliver push notifications and offline-first functionality. Native apps for Android will follow in Phase 2."]*

---

## 🤖 AI/ML Integration

### 1. Dynamic Premium Calculation

**Model Type:** [e.g., Gradient Boosting Regressor / Random Forest]

**Inputs:**
- [e.g., Historical weather data for the user's pincode]
- [e.g., Crop type and acreage]
- [e.g., Historical trigger frequency in the region]
- [e.g., User's prior claim history]

**Output:** Personalized weekly premium quote

**Justification:** *[e.g., "Static premium tables fail to capture micro-level risk variation. An ML model trained on 10 years of IMD data enables hyper-local, fair pricing."]*

---

### 2. Fraud Detection

**Model Type:** [e.g., Anomaly Detection / Isolation Forest / Rule-based + ML hybrid]

**Signals Monitored:**
- [e.g., Unusual claim patterns relative to peer cohorts]
- [e.g., Sign-up spikes prior to known weather events]
- [e.g., Mismatched GPS location vs. registered farm location]
- [e.g., Identity duplication via Aadhaar hash check]

**Output:** Risk score flagging suspicious accounts for manual review

---

### 3. Trigger Validation & Verification

**Approach:**
> *[e.g., "We cross-validate trigger events across at least two independent data sources — e.g., IMD rainfall data + satellite NDVI index — before processing payouts. An ML classifier trained on historical false-positive triggers helps filter noisy data."]*

---

### 4. Churn Prediction & Retention

**Model Type:** [e.g., Logistic Regression / XGBoost Classifier]

**Use Case:** *[e.g., "Identify users at risk of dropping their weekly plan and trigger targeted re-engagement nudges via SMS or push notification."]*

---

## 📸 Snippets of Prototype

<img width="959" height="353" alt="1" src="https://github.com/user-attachments/assets/e68e5f69-a41a-4d2d-833b-ffa887e72a47" />
<img width="959" height="356" alt="2" src="https://github.com/user-attachments/assets/0948d49c-e805-4f54-adfa-843e400c0622" />
<img width="550" height="151" alt="3" src="https://github.com/user-attachments/assets/a423670a-eab5-403c-a7cd-256c61d512d0" />
<img width="959" height="358" alt="4" src="https://github.com/user-attachments/assets/f0d0db8c-f6f0-4f1a-8da4-bd09a58af14c" />
<img width="959" height="359" alt="5" src="https://github.com/user-attachments/assets/1dd8fa07-386d-4404-bd99-efec5b07b112" />



## 🛠️ Tech Stack

### Frontend

| Layer | Technology |
|-------|-----------|
| UI Framework | React |
| Styling | Tailwind CSS |

### Backend

| Layer | Technology |
|-------|-----------|
| API Framework |  Django |
| Authentication | Firebase Auth |

### AI/ML

| Component | Technology |
|-----------|-----------|
| Model Training | Python, scikit-learn |

### Infrastructure & Integrations

| Component | Technology |
|-----------|-----------|
| Cloud Provider | [e.g., AWS / GCP / Azure] |
| Payment Gateway | [e.g., Razorpay / PayU for UPI] |
| Weather Data API | [e.g., IMD, OpenWeatherMap, NASA POWER] |
| KYC / Identity | [e.g., DigiLocker, Aadhaar eKYC] |
| Notification Service | [e.g., Firebase Cloud Messaging / Twilio SMS] |
| CI/CD | [e.g., GitHub Actions] |
| Monitoring | [e.g., Grafana / Sentry] |

---

## 🗓️ Development Plan

### Phase 1 — Foundation *(Weeks 1–4)*

- [ ] Requirements finalization & regulatory research (IRDAI guidelines)
- [ ] UI/UX wireframes and user testing with target personas
- [ ] Core backend setup: authentication, user profile, database schema
- [ ] Payment gateway integration (UPI/auto-debit)

### Phase 2 — Core Product *(Weeks 5–8)*

- [ ] Parametric trigger engine: data ingestion + threshold logic
- [ ] Premium calculation engine (rule-based v1)
- [ ] Payout processing workflow
- [ ] MVP web/mobile app launch (internal testing)

### Phase 3 — AI/ML Integration *(Weeks 9–12)*

- [ ] ML-based premium pricing model (train + deploy)
- [ ] Fraud detection model (baseline)
- [ ] Trigger cross-validation with dual data sources
- [ ] A/B test ML pricing vs. rule-based pricing

### Phase 4 — Scale & Compliance *(Weeks 13–16)*

- [ ] IRDAI / regulatory compliance audit
- [ ] Reinsurance partner integration
- [ ] Performance optimization & load testing
- [ ] Public beta launch with 500 pilot users

### Phase 5 — Growth *(Post Week 16)*

- [ ] Churn prediction & retention model
- [ ] NLP chatbot for customer support
- [ ] Expansion to additional risk types / geographies
- [ ] Native Android app (if applicable)

---

## 📎 Additional Considerations

### Regulatory & Compliance

*The platform will operate under the IRDAI Regulatory Sandbox framework, allowing us to pilot parametric insurance products before full licensing. We will partner with a licensed insurer as the risk carrier, with GigShield acting as the technology and distribution layer.*

### Data Privacy

> *All user PII is encrypted at rest and in transit. Aadhaar-based KYC follows UIDAI prescribed norms — only a tokenised reference is stored, never raw Aadhaar numbers or biometrics. Users can request data deletion at any time.*

### Reinsurance Strategy

> *When a large-scale event (citywide flood, regional heatwave) triggers simultaneous payouts across thousands of users, our aggregate exposure spikes. We will partner with a reinsurer to underwrite any aggregate payout that exceeds a predefined threshold, protecting the platform from catastrophic loss events.*

### Financial Inclusion Goals

> *Our primary target is the unbanked and underbanked gig workforce. We support UPI, UPI Lite, and USSD-based payments for users without smartphones. Onboarding is available in Tamil, Telugu, and Hindi. NGO and SHG partners handle assisted enrolment in low-literacy communities, with subsidised entry premiums for the first four weeks.*

### Partnerships

| Partner Type | Purpose |
|-------------|---------|
| Gig Platforms | Last-mile enrollment & Data Sync |
| Licensed Insurers | Risk carrier / regulatory compliance |
| Weather data provider | Trigger data feed |
| Payment Gateway | Instant Payout Infrastructure |

---

## 👥 Team & Contact

| Name | Role | Contact |
|------|------|---------|
| Haina kumari | Tech Lead | hainakumari1@gmail.com |
| Bipin Kumar | Full Stack Development | bipinkumar620013@gmail.com |
| Dhanush Thirunavukkarasu | AI Development | dhanushthiru@proton.me |
| Harsh Thakur | Domain Expert | harsh06072006@gmail.com |

---

*Last updated: [3/18/2026] | Version: 1.0*

# SmartCommunication CRM

> **One Platform. Every Customer. Smarter Communication.**

SmartCommunication CRM is a production-grade Customer Relationship Management platform designed to help businesses manage their customers, leads, sales opportunities, customer support, communications, workflows, and business activities through one unified platform.

The platform combines traditional CRM operations with an **Omnichannel Smart Communication Hub**, **Visual Workflow Automation**, and **AI-Powered Customer Intelligence** (Sentiment Analysis, Intent Detection, Conversation Summaries, Next-Best Action, and Smart Customer Memory).

---

## 🌟 Key Features

- **Multi-Tenant Architecture**: Complete data isolation and RBAC for multiple organizations, departments, and teams.
- **360-Degree Customer Profile**: Centralized view of customer data, contacts, custom fields, tags, and a unified chronological activity timeline.
- **Lead Management & Scoring**: Complete lead lifecycle tracking (New, Contacted, Qualified, Proposal, Converted, Lost) with automated lead scoring.
- **Sales Pipelines & Deal Management**: Interactive Kanban deals board, stage management, win/loss tracking, and sales revenue forecasting.
- **Smart Communication Hub**: Unified inbox for Email, WhatsApp, SMS, WebChat, and Internal Call Notes with real-time WebSockets.
- **Customer Support & SLA**: Ticket management with automated SLA timers (First Response & Resolution), escalation rules, and agent metrics.
- **Task, Calendar & Reminders**: Comprehensive task assignment, priority tagging, and calendar view integrations.
- **Workflow Automation Engine**: Visual event-driven workflow engine with custom triggers, conditions, and automated actions (emails, task assignments, status changes).
- **AI Intelligence & Smart Customer Memory**:
  - Automatic conversation summaries.
  - Contextual Smart Reply suggestions.
  - Sentiment analysis (Positive, Neutral, Negative, Urgent).
  - Intent detection & Next-Best Action recommendations.
  - **Smart Customer Memory**: Persisted preferences, channel choices, and interaction patterns.
- **Campaigns & Analytics**: Targeted email campaigns, segmentation, sales performance, communication analytics, and audit logging.

---

## 🏗️ Architecture & Technology Stack

### Frontend
- **Framework**: Next.js 14 (App Router) + React + TypeScript
- **Styling**: Tailwind CSS + Lucide Icons + Radix UI / Shadcn UI components
- **State & Data Fetching**: TanStack Query (React Query) + Zustand
- **Form Management**: React Hook Form + Zod validation

### Backend
- **Framework**: Java 21 / Spring Boot 3
- **Security**: Spring Security + JWT Authentication + BCrypt + Role-Based Access Control (RBAC) + Tenant Isolation Filter
- **Persistence**: Spring Data JPA + Hibernate + PostgreSQL
- **Caching & WebSockets**: Redis + Spring WebSocket (STOMP/SockJS)

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Database**: PostgreSQL 16 + Redis 7

---

## 🚀 Quick Start with Docker

```bash
# Clone the repository
git clone https://github.com/lingamallusaikumar/smart-communication.git
cd smart-communication

# Start the full stack with Docker Compose
docker-compose up -d --build
```

Access services:
- **Frontend App**: `http://localhost:3000`
- **Backend API**: `http://localhost:8080/api/v1`
- **Swagger Documentation**: `http://localhost:8080/swagger-ui.html`

---

## 📂 Repository Structure

```text
smart-communication/
├── docker-compose.yml              # Container orchestration for Postgres, Redis, App services
├── frontend/                       # Next.js 14 App Router Frontend
├── backend/                        # Java Spring Boot 3 Backend
├── database/                       # PostgreSQL migrations & initial seed data
└── docs/                           # Architecture specs and user guides
```

---

## 🔒 Security & Data Privacy

SmartCommunication enforces strict password hashing (BCrypt), JWT token rotation, HTTPS enforcement readiness, CORS protection, SQL injection prevention via JPA parameterization, XSS sanitation, and row-level multi-tenant organization filtering.

---

## 📄 License

Original branding and custom code implementation. All rights reserved.

## Installation
Run `npm install` in the frontend directory.
Run `mvn clean install` in the backend directory.

## Run
Run `npm start` in the frontend directory.
Run `mvn spring-boot:run` in the backend directory.

## Build
Run `npm run build` in the frontend directory.

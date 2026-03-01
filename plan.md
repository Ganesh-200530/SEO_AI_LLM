# SEO AI LLM — Implementation Plan

## Tech Stack

- **Frontend:** Vite + React
- **Backend:** Express.js (Node.js)
- **Database:** Supabase (PostgreSQL + Auth)
- **AI:** Google Gemini 3.1 (core AI brain powering all agents)
- **Deployment:** Vercel (frontend) + Railway/Render (backend)

---

## Phase 1: Project Setup

- [ ] Initialize monorepo structure (`/client`, `/server`)
- [ ] Set up Vite + React frontend with Tailwind CSS
- [ ] Set up Express.js backend with folder structure
- [ ] Configure Supabase project (database + auth)
- [ ] Set up environment variables (`.env`) for API keys
- [ ] Configure CORS, rate limiting, error handling middleware
- [ ] Set up Google Gemini 3.1 API client (`@google/generative-ai` SDK)

---

## Phase 2: Database Design (Supabase)

### Tables

- **users** — id, email, name, created_at
- **reports** — id, user_id, content, keyword, industry, result, seo_score, created_at
- **keywords** — id, report_id, keyword, type (related / long-tail / semantic)
- **suggestions** — id, report_id, agent, category, suggestion_text

### Auth

- [ ] Supabase Auth (email/password + Google OAuth)
- [ ] Row Level Security (RLS) policies per user

---

## Phase 3: Backend — API & Agent Architecture

### API Routes

| Method | Route | Description |
|--------|---------------------------|--------------------------------------|
| POST | `/api/analyze` | Submit content for SEO analysis |
| GET | `/api/reports` | List all reports for logged-in user |
| GET | `/api/reports/:id` | Get single report detail |
| DELETE | `/api/reports/:id` | Delete a report |

### Multi-Agent System

Each agent is an independent prompt module that receives context and returns structured JSON.

- [ ] **SEO Audit Agent** — scores content (0–100), evaluates keyword density, readability, structure
- [ ] **Keyword Intelligence Agent** — analyzes keyword usage, suggests related/long-tail/semantic keywords
- [ ] **Content Optimization Agent** — generates SEO title, meta description, structural improvements
- [ ] **LLM Optimization Agent** — AI discoverability, FAQ suggestions, schema type, entity clarity
- [ ] **Technical SEO Agent** — internal linking, external references, formatting, schema markup

### Orchestrator

- [ ] Runs all 5 agents in parallel (Promise.all)
- [ ] Aggregates individual agent outputs into unified report JSON
- [ ] Stores final report in Supabase
- [ ] Returns structured response to frontend

### Agent-to-Agent Communication (Full Team Flow)

```
┌─────────────────────────────────────────────────────────┐
│                    ORCHESTRATOR                          │
│          (Central coordinator & message bus)             │
└────────────┬────────────────────────────────┬───────────┘
             │  Distributes input context     │
             ▼                                ▼
┌────────────────────┐          ┌────────────────────────┐
│  SEO Audit Agent   │──────▶   │ Keyword Intel Agent    │
│  (scores content)  │ shares   │ (keyword strategy)     │
│                    │ score +  │                        │
│  Output:           │ gaps     │  Output:               │
│  - SEO score       │          │  - Related keywords    │
│  - Keyword density │          │  - Long-tail keywords  │
│  - Readability     │◀──────── │  - Semantic entities   │
│  - Structure depth │ feeds    │  - Search intent       │
└────────┬───────────┘ keywords └───────────┬────────────┘
         │                                  │
         │  score + density data            │ keyword list
         ▼                                  ▼
┌────────────────────────────────────────────────────────┐
│              Content Optimization Agent                 │
│              (on-page SEO expert)                       │
│                                                        │
│  Receives from Audit Agent:                            │
│    → SEO score, readability gaps, structure issues      │
│  Receives from Keyword Agent:                          │
│    → Target keywords, semantic entities                 │
│                                                        │
│  Output:                                               │
│    - Optimized SEO title (uses top keywords)           │
│    - Meta description (uses intent + entities)         │
│    - Structural improvements                           │
│    - Missing content sections                          │
└────────────────────────┬───────────────────────────────┘
                         │
                         │ title, meta, content gaps
                         ▼
┌────────────────────────────────────────────────────────┐
│              LLM Optimization Agent                     │
│              (AI search specialist)                     │
│                                                        │
│  Receives from Content Agent:                          │
│    → Title, meta, missing sections                     │
│  Receives from Keyword Agent:                          │
│    → Semantic entities, long-tail queries              │
│                                                        │
│  Output:                                               │
│    - AI discoverability improvements                   │
│    - FAQ additions (based on long-tail queries)        │
│    - Schema.org type recommendation                    │
│    - Entity clarity suggestions                        │
│    - Conversational query rewrites                     │
└────────────────────────┬───────────────────────────────┘
                         │
                         │ schema type, FAQs, entity map
                         ▼
┌────────────────────────────────────────────────────────┐
│              Technical SEO Agent                        │
│              (site architecture consultant)             │
│                                                        │
│  Receives from all previous agents:                    │
│    → SEO score + gaps (Audit)                          │
│    → Keywords + entities (Keyword Intel)               │
│    → Title + structure fixes (Content)                 │
│    → Schema type + FAQs (LLM)                          │
│                                                        │
│  Output:                                               │
│    - Internal linking strategy (uses keywords)         │
│    - External authority references                     │
│    - Content formatting improvements                   │
│    - Full schema markup implementation                 │
└────────────────────────┬───────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────┐
│              ORCHESTRATOR — Final Assembly              │
│                                                        │
│  Collects all agent outputs                            │
│  Resolves conflicts (e.g. duplicate suggestions)       │
│  Merges into unified report JSON                       │
│  Calculates final weighted SEO score                   │
│  Stores in Supabase → Returns to frontend              │
└────────────────────────────────────────────────────────┘
```

#### Communication Rules

| Rule | Description |
|------|-------------|
| **Message Bus** | Orchestrator acts as central message bus — agents never call each other directly |
| **Shared Context** | Each agent receives the original input (content, keyword, industry) + outputs from upstream agents |
| **Execution Order** | Round 1: Audit + Keyword (parallel) → Round 2: Content → Round 3: LLM → Round 4: Technical |
| **Data Format** | All agents return structured JSON with a fixed schema |
| **Conflict Resolution** | Orchestrator deduplicates overlapping suggestions across agents |
| **Fallback** | If any agent fails, Orchestrator continues with remaining agents and flags partial report |

#### Agent Dependency Map

```
SEO Audit ──────────┐
                     ├──▶ Content Optimization ──▶ LLM Optimization ──▶ Technical SEO
Keyword Intel ──────┘         │                          │                    │
       │                      │                          │                    │
       └──────────────────────┴──────────────────────────┴────────────────────┘
                                         │
                                    ORCHESTRATOR
                                   (final merge)
```

#### What Each Agent Shares

| From Agent | Shares With | Data Passed |
|------------|-------------|-------------|
| SEO Audit | Content, Technical | score, keyword_density, readability_score, structure_issues |
| Keyword Intel | Content, LLM, Technical | related_keywords[], long_tail[], semantic_entities[] |
| Content Optimization | LLM, Technical | seo_title, meta_description, missing_sections[] |
| LLM Optimization | Technical | faqs[], schema_type, entity_map, conversational_queries[] |
| Technical SEO | Orchestrator (final) | internal_links[], external_refs[], schema_markup, formatting[] |

---

## Phase 4: Frontend — Dashboard UI

### Pages

- [ ] **Landing Page** — Hero, features, CTA
- [ ] **Login / Register** — Supabase Auth integration
- [ ] **Dashboard** — List of past reports, quick stats
- [ ] **New Analysis** — Input form (content, keyword, industry)
- [ ] **Report View** — Full rendered report with sections

### Report View Sections

- Overall SEO Score (visual gauge/progress bar)
- Keyword Intelligence (tag chips)
- Optimized Title & Meta Description (copy-to-clipboard)
- Content Improvements (checklist)
- LLM Optimization Strategy (bullets)
- Technical SEO Strategy (bullets)
- FAQ Section (accordion)

### UI Components

- [ ] Score gauge component
- [ ] Keyword tag chips
- [ ] Copy-to-clipboard buttons
- [ ] Collapsible FAQ accordion
- [ ] Report export (PDF / Markdown)
- [ ] Loading skeleton during analysis

---

## Phase 5: Integration & Flow

1. User logs in → Dashboard loads past reports
2. User submits content + keyword + industry
3. Backend receives request → builds prompt from `seo.md` template
4. Orchestrator dispatches to all 5 agents (parallel API calls)
5. Agents return structured JSON → Orchestrator merges
6. Result saved to Supabase → returned to frontend
7. Frontend renders full interactive report

---

## Phase 6: Polish & Extras

- [ ] Input validation (frontend + backend)
- [ ] Error handling with user-friendly messages
- [ ] Rate limiting per user (prevent API abuse)
- [ ] Dark mode support
- [ ] Responsive design (mobile-friendly)
- [ ] Report sharing via public link (optional)
- [ ] Export report as PDF / Markdown
- [ ] Usage analytics (report count, avg score)

---

## Folder Structure

```
/client
  /src
    /components
    /pages
    /hooks
    /lib          ← Supabase client, API helpers
    /styles
    App.jsx
    main.jsx

/server
  /agents
    seoAudit.js
    keywordIntel.js
    contentOptimizer.js
    llmOptimizer.js
    technicalSeo.js
  /routes
    analyze.js
    reports.js
  /middleware
    auth.js
    rateLimit.js
  /utils
    orchestrator.js
    promptBuilder.js
    supabase.js
  server.js

.env
package.json
```

---

## Key Decisions

| Decision | Choice | Reason |
|------------------------|------------------------------|------------------------------------------|
| Frontend framework | React + Vite | Fast builds, modern DX |
| Styling | Tailwind CSS | Rapid UI development |
| Database | Supabase | Built-in auth, realtime, PostgreSQL |
| AI provider | Google Gemini 3.1 | High-quality reasoning, large context window, cost-effective |
| Agent execution | Parallel (Promise.all) | Faster response, independent agents |
| Report storage | Supabase `reports` table | Persistent history, user-scoped |

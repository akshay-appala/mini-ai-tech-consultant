# DESIGN

## 1. Project overview

AI Tech Consultant is a prototype web application with three Gemini-powered features:

1. **Knowledge Brain** — answers a question using knowledge text supplied by the user.
2. **Inbox Agent** — drafts an email reply using the email and context supplied by the user.
3. **Meeting-to-Scope** — turns meeting notes into structured planning information, including requirements, priorities, estimated tasks, risks, questions, and next steps.

This document describes the current prototype, not every capability in the larger capstone brief.

## 2. Current architecture

`Browser UI → Express server → Gemini service → Gemini API → response shown in browser`

- **Frontend:** HTML, CSS, and browser JavaScript in `public/`.
- **Backend:** `server.js`, using Express to serve the frontend and expose API endpoints.
- **Gemini integration:** `services/gemini.js`, which calls the Google Gemini API.
- **Configuration:** environment variables, including `GEMINI_API_KEY` and optionally `GEMINI_MODEL` and `PORT`.
- **Dependencies:** declared in `package.json` and locked in `package-lock.json`.

Current API endpoints: `/api/knowledge`, `/api/inbox`, `/api/scope`, and `/api/health`.

## 3. Feature design

### Knowledge Brain

The user supplies knowledge text and a question. The backend sends the provided material to Gemini with instructions to answer from that material. This is a simple context-based prototype, not a crawler or retrieval-augmented generation (RAG) system.

### Inbox Agent

The user supplies an email and supporting context. Gemini drafts a reply based on those inputs. The prototype does not connect to a real mailbox, send email, or record an approval workflow.

### Meeting-to-Scope

The user supplies meeting notes. Gemini is asked to return structured planning output, including requirements, priorities, estimated tasks, risks, questions, and next steps. These are AI-generated suggestions and need human review.

## 4. Configuration and privacy

The Gemini API key is configured in a local `.env` file and should not be committed to Git. `.env.example` documents the expected configuration without containing the real key. `.gitignore` should exclude `.env` and `node_modules`.

Text submitted to these features is sent to the Gemini API. Do not enter confidential, personal, or customer-sensitive information into the demo.

## 5. Current limitations and future work

The current prototype does not implement the following full-capstone capabilities:

- Website crawling, sitemap ingestion, document parsing, chunking, embeddings, persistent indexing, or semantic retrieval.
- Evidence-backed answers with source citations from a maintained knowledge collection.
- Integration with a real email inbox, automatic email sending, or persistent human-edit/approval feedback.
- A multi-agent workflow, feasibility checking, version-to-version scope comparison, or persistent follow-up change tracking.
- A database, production deployment, authentication, or a comprehensive automated test suite.
- The required evaluation set and comparison of multiple models using measured quality, latency, and cost.

These capabilities may be future work. They should only be described as complete after implementation and verification.

## 6. Human review

Gemini output can be incomplete or incorrect. Users should review generated answers, email drafts, requirements, risks, and estimates before relying on them. This is a demonstration prototype, not a production-ready system.

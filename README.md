
A simple, accessible portfolio-style web app that demonstrates dynamic content, data handling, animations, error handling.

Features
Personalized greeting based on time of day and an optional stored username (localStorage).
-Theme toggle (light/dark) saved in localStorage.
-Projects list with filter, sort, and live search.
-Tabbed sections (About, Projects, Contact) with smooth transitions.
-Optional API fetch demo (with loading, error, and retry).


Run locally
Just open `index.html` in your browser. No build tools required.

Documentation
-`docs/ai-usage-report.md` – AI usage (tools, edits, learnings).
-`docs/technical-documentation.md` – architecture, data flow, components, and performance notes.


Testing
-Test filtering, sorting, and search combos.
-Validate the form with empty/invalid fields and valid submission.
-Toggle themes, refresh to confirm persistence.
-Disable network to test API error + retry.

Commit conventions
-Use present tense, imperative mood (e.g., `add project filter`, `fix form validation`).  
-Reference scope + intent when helpful (e.g., `feat(projects): add live search`).


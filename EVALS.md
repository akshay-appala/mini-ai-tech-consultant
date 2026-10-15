# EVALS

## 1. Evaluation scope

This document records the tests performed on the current AI Tech Consultant prototype. It does not claim that the full capstone evaluation requirements have been completed.

## 2. Tests performed

The developer started the application locally, confirmed that the UI detected the configured Gemini API key, and manually tested each of the three main features. The developer reported that all three features worked.

| Feature | Manual test | Observed result |
|---|---|---|
| Knowledge Brain | Submitted knowledge text and a question | Feature returned a response |
| Inbox Agent | Submitted an email and supporting context | Feature returned a draft reply |
| Meeting-to-Scope | Submitted meeting notes | Feature returned structured planning output |
| Local startup and API configuration | Started the app and checked the UI's API-key status | App ran locally and detected the key |

These are manual smoke tests. No formal accuracy score, latency benchmark, cost measurement, or independent test report was recorded as part of these checks.

## 3. Known evaluation gaps

The following work has not been established as completed:

- At least 20 evaluation cases for each task.
- A repeatable evaluation dataset with expected results and scoring criteria.
- A comparison of at least two models on quality, latency, and cost.
- Systematic tests for unsupported questions, misleading input, malformed model output, API failures, rate limits, and network failures.
- Automated regression tests and reproducible evaluation commands.
- Measured latency and cost results.

Do not report numerical scores or claim these evaluations passed unless the tests are run and results recorded.

## 4. Suggested next tests

These are proposed tests, not tests claimed to have been completed:

1. Ask Knowledge Brain a question answered explicitly by the supplied text.
2. Ask Knowledge Brain a question whose answer is absent from the supplied text; inspect whether the response admits the limitation.
3. Give Inbox Agent a clear email and relevant context; check whether the draft uses the context.
4. Give Inbox Agent insufficient or conflicting context; inspect whether the draft makes unsupported promises.
5. Give Meeting-to-Scope concise notes and check that the output includes expected planning fields.
6. Give Meeting-to-Scope ambiguous notes and check whether uncertainty or follow-up questions are represented.
7. Test behavior when the API key is missing or invalid.
8. Test behavior when the Gemini API is unavailable or returns an error.

For each test, record the input, expected behavior, actual output, and pass/fail decision when performed.

## 5. Evaluation conclusion

The current evidence supports the limited conclusion that all three features were manually exercised and returned responses in a local run. It does not establish production readiness, a particular accuracy level, full compliance with the capstone brief, or completion of formal evaluation requirements.

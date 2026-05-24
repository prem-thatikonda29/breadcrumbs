# Breadcrumbs — Software Testing Assignment

Tests against: **https://breadcrumbs-rose.vercel.app**

| ID | Tool | What it tests |
|---|---|---|
| TC-SE-01 | Selenium (Java) | Sign-in page renders heading + Google button |
| TC-SE-02 | Selenium (Java) | Unauthenticated `/app` visit redirects to `/sign-in` |
| TC-CY-01 | Cypress | Sign-in page heading and button (same as SE-01, different runner) |
| TC-CY-02 | Cypress | Protected route redirect + post-redirect UI check |
| TC-JM-01 | JMeter | `/sign-in` page: 10 concurrent users, HTTP 200, < 3 s |
| TC-JM-02 | JMeter | `/` landing page: 10 concurrent users, HTTP 200, < 3 s |

---

## Selenium (Java + Maven)

**Prerequisites:** Java 11+, Maven 3.8+, Brave Browser installed at `/Applications/Brave Browser.app`.  
Selenium 4 manages ChromeDriver automatically — no manual driver download needed.

```bash
cd tests/selenium
mvn test
```

Tests run headless. Output appears in the terminal and in `target/surefire-reports/`.

---

## Cypress (JavaScript)

**Prerequisites:** Node.js 18+.

```bash
cd tests/cypress
npm install
npm test            # headless (CI mode)
npm run test:open   # interactive browser mode
```

---

## JMeter

**Prerequisites:** [Apache JMeter 5.6+](https://jmeter.apache.org/download_jmeter.cgi).

1. Launch JMeter GUI: run `jmeter` (or open `bin/jmeter.bat` on Windows).
2. **File → Open** → select `tests/jmeter/sign_in_load_test.jmx` (or `landing_page_load_test.jmx`).
3. In the left tree, expand **Summary Report** → set the **Filename** field to `results/sign-in-results.csv` (or `results/landing-results.csv`). Create the `results/` folder first if it doesn't exist.
4. Click the green **Run** (▶) button in the toolbar.
5. Watch results populate live in the **Summary Report** node — columns show # samples, avg/min/max response time, throughput, and error %.

Both test plans are pre-configured with:
- 10 concurrent users, 5 s ramp-up, 1 loop each
- An HTTP 200 assertion
- A 3000 ms duration assertion (fails any sample over 3 s)

> **Note:** Convex uses a WebSocket-based sync protocol for real-time data — there are no REST endpoints to hit directly. The JMeter tests measure the Next.js HTTP layer (page loads) which is the appropriate layer for HTTP performance testing of this stack.

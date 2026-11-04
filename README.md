# Inter Books Book Oracle

The quiz at https://oracle.interbooks.com.au

- **Books, tags and oracle lines live in the Google Sheet**, not here. Edit the sheet; the quiz picks up changes within about five minutes.
- When a book sells, set its Status to `Sold` in the sheet. Only `Available` books are drawn.
- `index.html` is the page (header, footer, sheet link). `oracle.js` is the quiz itself.
- Hosted free on GitHub Pages from the `main` branch. `CNAME` holds the custom address; the matching DNS record is a CNAME `oracle` -> `internan.github.io` at GoDaddy.

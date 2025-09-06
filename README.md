# SPS lovų priežiūros programa

A simple React program for managing hospital bed assignments. The main component `LovuValdymoPrograma.jsx` contains the dashboard logic.

## Setup

1. Install [Node.js](https://nodejs.org/) and `npm`.
2. Install dependencies:
   ```sh
   npm install
   ```
3. Run the tests to ensure everything works:
  ```sh
  npm test
  ```

4. Build the static files for GitHub Pages (output in the `docs/` folder):
   ```sh
   npm run build
   ```

## Usage

### Toggling Filters
Use the filter buttons above the zones to show all beds or only those needing attention for toilets, cleaning, or overdue checks.
Example:
1. Click **Tualetas** to show beds awaiting the toilet.
2. Press <kbd>Tab</kbd> to focus a filter button and <kbd>Enter</kbd> to activate it.

### Moving Beds Between Zones
Drag a bed card to a different zone to reassign it.
Example: drag bed **IT-01** from *Zone A* to *Zone B*.
Keyboard: press <kbd>Space</kbd> on a focused bed to start moving, use arrow keys to choose a zone, then press <kbd>Space</kbd> again to drop.

### Exporting Logs
The activity log in the right pane can be downloaded for auditing.
Example: after filtering the log, click **Eksportuoti CSV** to save `lovu_zurnalas_YYYY-MM-DD.csv`.

### Dark Mode Toggle
A button in the header switches between light and dark themes.
Example: click **Dark** to enable the darker palette; click again to return to light mode.
Accessibility: the toggle button is focusable via keyboard and preserves contrast for better readability.


## Legacy Layouts

Older versions stored bed layouts in your browser's local storage. If you previously used a layout with names like "P" or "S" and the dashboard looks incorrect, clear the site's local storage to reset the beds.



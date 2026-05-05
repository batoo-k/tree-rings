# Deployment

This document defines how to run, build, and deploy the Tree Rings project.

Tree Rings should be built as a Next.js web app and deployed to Vercel.

Use the existing Next.js project in this folder.
Do not deploy a separate static `index.html` prototype from the repository root.

---

## 1. Deployment Goal

The goal is to deploy Tree Rings as a public web prototype using Vercel.

The deployed version must support the following core features:

- START, PAUSE, and RESET controls
- Count-up timer display in `mm:ss` format, starting at `00:00`
- Concentric dotted rings
- Accent arcs for active focus segments
- Paused intervals remaining dotted
- Mouse-wheel zoom interaction
- Responsive display on desktop browsers

---

## 2. Recommended Stack

Use the following stack unless there is a strong reason to change it.

| Item | Choice |
|---|---|
| Framework | Next.js |
| Language | TypeScript |
| Styling | CSS Modules, Tailwind CSS, or plain CSS |
| Rendering | SVG |
| Package Manager | npm |
| Deployment Platform | Vercel |
| Version Control | GitHub |

---

## 3. Local Development

Run the project locally before deploying.

Primary app files:

- `app/page.tsx`
- `app/globals.css`

Do not replace the existing App Router structure with a separate static site.

### Install dependencies

```bash
npm install
```

### Start local development server

```bash
npm run dev
```

After running the command, open the local development URL in the browser.

Usually, the URL is:

```text
http://localhost:3000
```

---

## 4. Development Check

Before building for production, confirm that the core prototype works locally.

Check the following:

- The page loads without runtime errors.
- The START button begins the count-up timer.
- The PAUSE button does not stop the global elapsed timer.
- During PAUSE, no new accent arc is drawn.
- Pressing START again draws a new accent arc from the current elapsed-time position.
- RESET returns the timer and rings to the initial dotted state.
- The rings begin from the innermost circle and progress outward.
- Accent arcs start from the 12 o'clock position and move clockwise.
- Mouse-wheel zoom works around the cursor position.
- The layout remains visually stable after zooming.

---

## 5. Production Check

Before deployment, run the production build command.

```bash
npm run build
```

The project must build successfully before being deployed to Vercel.

If the build fails, fix all errors before deployment.

Do not deploy a broken build.

---

## 6. Vercel Deployment

Deploy the project by connecting the GitHub repository to Vercel.

### Recommended Vercel settings

| Setting | Value |
|---|---|
| Framework Preset | Next.js |
| Build Command | `npm run build` |
| Output Directory | Default |
| Install Command | `npm install` |
| Development Command | `npm run dev` |

In most cases, Vercel will automatically detect that the project is a Next.js app.

---

## 7. GitHub Workflow

Use GitHub as the source repository for Vercel deployment.

Recommended workflow:

```bash
git add .
git commit -m "Initial Tree Rings prototype"
git push
```

After pushing to GitHub, Vercel can automatically build and deploy the latest version.

---

## 8. Environment Variables

Tree Rings does not require environment variables for the MVP version.

Do not add unnecessary environment variables unless a future feature requires them.

Possible future environment variables may include:

- Analytics keys
- User account system keys
- Database connection strings
- External API keys

For the MVP, no environment variable is required.

---

## 9. Deployment Checklist

Before deploying, confirm the following:

- The project runs locally with `npm run dev`.
- The project builds successfully with `npm run build`.
- No TypeScript errors remain.
- No console errors appear during normal use.
- The visual rings render correctly.
- The timer logic follows the global elapsed-time rule.
- Paused intervals remain dotted.
- Restarting after PAUSE begins drawing from the current elapsed-time position.
- RESET returns the app to the default state.
- The app is usable in a desktop browser.
- The project has been pushed to GitHub.

---

## 10. Important Timer Rule for Deployment Review

Before deploying, verify this core product rule carefully:

Tree Rings must not draw arcs by simply connecting accumulated focus time.

Tree Rings must draw active focus periods on the global elapsed timeline.

Example:

- START from 0s to 10s: draw accent arc from 0s to 10s.
- PAUSE from 10s to 20s: keep this section dotted.
- START again from 20s onward: draw the next accent arc from the 20s position onward.

The second accent arc must not begin at the 10s position.

This rule must be preserved in the deployed version.

---

## 11. Post-Deployment Check

After deployment, open the live Vercel URL and test the following:

- Page loads correctly.
- Timer starts from `00:00`.
- START begins active focus recording.
- PAUSE keeps the timer running but stops arc drawing.
- START after PAUSE resumes arc drawing from the current elapsed-time position.
- RESET clears all visual progress.
- Dotted rings remain visible.
- Accent arcs are visually distinct from dotted rings.
- Mouse-wheel zoom works as expected.
- The page does not crash after several minutes of use.

---

## 12. Notes for Future Versions

Future versions may include:

- Custom focus session labels
- Save history of completed sessions
- Export visual tree ring record as an image
- Daily or weekly time-ring archive
- Color theme selection
- Mobile pinch zoom
- Sound or haptic feedback
- User account and cloud sync

These features are not required for the first Vercel prototype.

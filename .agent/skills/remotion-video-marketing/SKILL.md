---
name: remotion-video-marketing
description: Toolkit for creating marketing video scenarios and scripts for Remotion based on website analysis. Use this when the user wants to analyze their current web application, capture its UI/UX flow and style, and write a professional marketing video script for Remotion. Capabilities include analyzing repository UI/UX style, finding media assets, taking screenshots of running pages, establishing marketing patterns for digital/physical products, and drafting a comprehensive Remotion video scenario.
---

# Remotion Video Marketing Toolkit

This skill transforms an AI agent into an expert video marketer and technical analyst. It bridges the gap between an existing codebase and high-converting marketing content by analyzing a web application's frontend, capturing its essence, and structuring a highly effective marketing video scenario for Remotion.

## Core Capabilities

1. **Repository Analysis:** Understands the project's purpose, structure, and design tokens (colors, typography, spacing).
2. **Media Discovery:** Locates and assesses existing assets (logos, images, videos) for use in the video.
3. **Application Interaction:** Launches the application locally to analyze functionality and capture screenshots.
4. **Marketing Strategy:** Applies world-class marketing frameworks (AIDA, PAS, Storytelling) customized for digital or physical products.
5. **Remotion Scenario Drafting:** Produces a detailed, frame-by-frame blueprint optimized for implementation in Remotion.

## Execution Workflow

When tasked with creating a Remotion video scenario, follow this exact sequence:

### 1. Launch & Technical Analysis
- Review `package.json` to understand the tech stack and identify start commands.
- Use `run_command` to start the local development server (e.g., `npm run dev`). *Note: Always use non-interactive flags (e.g., `-y` or set environment variables to avoid prompts).*
- Wait for the local server to be accessible.
- Analyze the core routing and component structure to understand the user journey (e.g., Landing Page -> Product Details -> Checkout).

### 2. Capture UI/UX Style and Media Assets
- Extract the design system: Review files like `tailwind.config.ts`, `globals.css`, or specific styling modules. Document primary colors, fonts, border radiuses, and shadow definitions.
- Discover visual assets: Search directories like `public/`, `src/assets/`, or `images/` for SVGs, PNGs, and videos. Note their paths.
- Capture Screenshots: Use Playwright (or relevant browser interaction tools like `webapp-testing` if available) to capture high-quality screenshots or screencasts of key user flows. Focus on distinct UI components (cards, forms, hero sections).

### 3. Establish Marketing Strategy
Before writing the scene sequence, explicitly state the marketing framework being applied:
- **For Digital Products / SaaS:** Rely on **PAS (Problem, Agitation, Solution)**. Highlight user pain points, agitate the difficulty, and present the UI as the seamless solution.
- **For Physical Products:** Rely on **AIDA (Attention, Interest, Desire, Action)** or Feature-Advantage-Benefit. Focus on striking visuals, lifestyle integration, and clear CTAs.
- **The Hook:** Determine the crucial first 3-second visual and audio hook to maximize viewer retention (e.g., Pattern interrupt, bold claim, or striking animation).

### 4. Create the Remotion Video Scenario
Produce a structured document/script that acts as a blueprint for Remotion compositions. **Do not write the entire Remotion React code unless explicitly asked.** Instead, provide the architectural blueprint:

* **Composition Meta:** Recommended framerate (e.g., 30fps or 60fps), duration (frames/seconds), and dimensions (e.g., 1080x1920 for short-form, 1920x1080 for widescreen).
* **Scene-by-Scene Breakdown:**
  - **Scene # (Timecode / Frame Range)**
  - **Visual Action:** Describe explicitly how UI components, screenshots, and assets will be animated using Remotion primitives (e.g., "The Hero section screenshot scales up from 0.8 to 1.0 using a `spring` animation").
  - **Text / Kinetic Typography:** Specify exactly what text appears and its entrance/exit animations.
  - **Audio & VO:** The script for the voiceover and notes on sound effects (risers, whooshes, clicks).
  - **Marketing Rationale:** Why this specific scene drives the chosen marketing framework forward.

## Integration Notes

- Treat the web application's UI components as "actors" in the video. The script should describe how to isolate and animate these specific React/Vue/HTML components within the Remotion sequence.
- Ensure all styled elements in the sequence strictly adhere to the extracted design tokens from Step 2.
- For capturing advanced interactions, recommend specific Remotion techniques (like screen recording CSS hover states or using Remotion's `<IFrame>` to render live components).

## Advanced Resources
- View `references/marketing-patterns.md` for deep dives into specific marketing psychological triggers.
- View `scripts/capture.js` for an example of automated screenshot extraction via Playwright.

# CreatorFlow Design Specification (2025 Baseline)

## Purpose & Usage

**This document defines the current baseline design for CreatorFlow and serves as the authoritative reference for all UI decisions.**

### How to Use This Document
- **Before making any UI changes, check this spec first**
- **If a component isn't covered here, follow the nearest similar pattern**
- **When in doubt, maintain the current baseline rather than introducing new patterns**
- **This is NOT just a record of what we've done - it IS the guide for future decisions**
- **The current implementation represents the baseline - any changes should either maintain this baseline or be explicitly approved deviations**

### Design Philosophy
CreatorFlow follows a **clean, minimal aesthetic** with:
- High contrast for accessibility
- Consistent color system across light/dark modes
- Blue-to-purple gradients for accent elements
- Removed unnecessary containers for cleaner interface
- Unified theming using CSS variables

---

## Overview
This document defines the **current design system** for CreatorFlow, reflecting the implementation as of July 2025. It covers the landing page, navigation, theme toggle, cards, buttons, gradients, and overall color system.

---

## 1. Color System

### Light Mode
- **Background:** Pure white (`#fff`)
- **Foreground/Text:** Black (`#171717` or `#000`)
- **Card Background:** White (`#fff`)
- **Muted/Secondary Background:** `#f5f5f5`
- **Primary Color:** Black (`#262626`)
- **Accent/Highlight:** Blue-to-purple gradients (`from-blue-500 to-purple-600`)

### Dark Mode
- **Background:** Very dark gray (`#171717`)
- **Foreground/Text:** White (`#fafafa`)
- **Card Background:** Dark gray (`#262626`)
- **Muted/Secondary Background:** `#404040`
- **Primary Color:** Light gray (`#e5e5e5`)
- **Accent/Highlight:** Blue-to-purple gradients (`from-blue-500 to-purple-600`)

---

## 2. Navigation Bar (Landing Page)
- **Background:**
  - Light mode: White (`bg-white`)
  - Dark mode: Dark gray (`bg-[#18181b]`)
- **Text:**
  - Light mode: Black (`!text-black`)
  - Dark mode: White (`dark:text-white`)
- **Logo:** Always black in light mode, white in dark mode
- **Links:** No underline by default, underline on hover
- **No gradients or shadows**

---

## 3. Theme Toggle (Light/Dark Mode Switch)
- **Icon-only:** No square or circle background, just the sun/moon/monitor icon
- **Icon color:**
  - Light mode: Black
  - Dark mode (landing page): Black
  - Dark mode (other pages): White
- **Hover:** Subtle color change only, no background
- **Accessible:** Has a title for screen readers

---

## 4. Hero Section (Landing Page)
- **Background:** Inherits from page (white or dark gray)
- **Heading:** Large, bold, black in light mode, white in dark mode
- **Subtitle:** Muted foreground color
- **Buttons:**
  - Primary: Black background, white text (light mode); white background, black text (dark mode)
  - Secondary: White background, black text, black border (light mode); dark background, white text (dark mode)
  - No gradients

---

## 5. Cards (Features, Plans, Testimonials)
- **Background:**
  - Light mode: White or muted blue for feature cards
  - Dark mode: Dark gray or muted blue for feature cards
- **Borders:** Subtle, no heavy outlines
- **Text:**
  - Headings: Black (light), white (dark)
  - Body: Muted foreground
- **No gradients or drop shadows**

---

## 6. Dashboard & Content Areas

### Quick Actions Buttons
- **Background:** Match scheduled post content area background
  - Light mode: White (`bg-white`)
  - Dark mode: Dark gray (`bg-gray-800`)
- **Text:** 
  - Light mode: Black (`text-black`)
  - Dark mode: White (`dark:text-white`)
- **Hover:** Subtle background change
  - Light mode: `hover:bg-gray-100`
  - Dark mode: `hover:bg-gray-700`

### AI Buttons (Content, Captions, Hashtags)
- **Background:**
  - Light mode: White (`bg-white hover:bg-gray-100`)
  - Dark mode: Black (`dark:bg-black dark:hover:bg-gray-800`)
- **Text:**
  - Light mode: Black (`text-black`)
  - Dark mode: White (`dark:text-white`)

### Post Now Button
- **Background:** Blue-to-purple gradient (`bg-gradient-to-r from-blue-500 to-purple-600`)
- **Hover:** Darker gradient (`hover:from-blue-600 hover:to-purple-700`)
- **Text:** White (`text-white`)
- **Disabled State:** Full opacity (`disabled:opacity-100`)

### Graph Bars & Progress Bars
- **Background:** Blue-to-purple gradient (`bg-gradient-to-t from-blue-500 to-purple-600`)
- **Hover:** Darker gradient (`hover:from-blue-600 hover:to-purple-700`)
- **Direction:** Vertical for bars (`bg-gradient-to-t`), horizontal for progress (`bg-gradient-to-r`)

---

## 7. Calendar Toolbar
- **Button Background:** Black (`background-color: black !important`)
- **Button Text:** White (`color: white !important`)
- **Hover:** Dark gray (`background-color: #1f2937 !important`)
- **Disabled:** Gray with reduced opacity
- **Layout:** Title first, navigation buttons center, view buttons right

---

## 8. Content Areas & Containers

### Scheduled Post Content Area
- **Background:** Card background color
  - Light mode: White (`--card: #ffffff`)
  - Dark mode: Dark gray (`--card: #262626`)

### Removed Containers
- **Draft Posts, Scheduled, Media Files:** No containers, content only
- **Content Calendar:** No container, calendar content only
- **Content Table/Grid:** No container, table content only
- **Recent Activity:** No container, content only
- **AI Analytics Summary:** No containers, cards only
- **Profile Sections:** No containers, content only
- **Billing Sections:** No containers except main tabs and plan cards

### Text Colors
- **Light Mode:** Black text for all content
- **Dark Mode:** White text for all content
- **Placeholder Text:** Black in light mode, white in dark mode

---

## 9. Section Dividers & Spacing
- **Dividers:** Use subtle border lines (`border-border`)
- **Spacing:** Generous padding and margin for clarity

---

## 10. Footer
- **Background:** Inherits from page
- **Text:** Muted foreground
- **Links:** No underline by default, underline on hover

---

## 11. Security Page
- **Delete Account:** Button only, no label
- **Clean Interface:** Minimal labels and containers

---

## 12. General Rules
- **Gradients:** Use blue-to-purple gradients (`from-blue-500 to-purple-600`) for:
  - Graph bars
  - Progress bars
  - Post Now button
  - Other accent elements
- **No drop shadows except for subtle card shadow**
- **All icons use solid color, no gradients**
- **All text is high-contrast for accessibility**
- **All interactive elements have clear hover/focus states**
- **Containers removed where possible for cleaner interface**

---

## 13. Recent UI/UX Improvements (July 2025)

### Applied Gradients
- **Billing Page Graphs:** All usage statistics bars use blue-to-purple gradient
- **AI-Powered Insights:** Progress bars use blue-to-purple gradient
- **Post Now Button:** Blue-to-purple gradient background

### Button Styling Updates
- **AI Buttons:** White backgrounds in light mode for better readability
- **Quick Actions:** Match scheduled post content area background colors
- **Calendar Toolbar:** Black backgrounds with white text

### Interface Cleanup
- **Container Removal:** Removed unnecessary containers while keeping content
- **Text Colors:** Ensured proper contrast in both light and dark modes
- **Calendar Toolbar:** Reorganized for better UX (title first, navigation center, views right)

---

## 14. Reference Screenshots
- See attached screenshots for exact visual reference of light and dark modes.

---

## 15. Decision-Making Framework

### When Making UI Changes
1. **First:** Check this design spec for existing patterns
2. **Second:** If no pattern exists, find the most similar component and follow its styling
3. **Third:** If still unsure, maintain the current baseline rather than introducing new patterns
4. **Fourth:** Document any deviations and get approval before implementing

### Consistency Rules
- **Color System:** Always use the defined light/dark mode colors
- **Gradients:** Only use blue-to-purple gradients for accent elements
- **Containers:** Remove unnecessary containers unless they serve a specific purpose
- **Typography:** Maintain high contrast and readability
- **Spacing:** Use consistent padding and margins

### Baseline Maintenance
- The current implementation represents the **baseline design**
- Changes should either **maintain this baseline** or be **explicitly approved deviations**
- When in doubt, **preserve the current design language**

---

## 16. Recent UI/UX Improvements (July 2025)

### Applied Gradients
- **Billing Page Graphs:** All usage statistics bars use blue-to-purple gradient
- **AI-Powered Insights:** Progress bars use blue-to-purple gradient
- **Post Now Button:** Blue-to-purple gradient background

### Button Styling Updates
- **AI Buttons:** White backgrounds in light mode for better readability
- **Quick Actions:** Match scheduled post content area background colors
- **Calendar Toolbar:** Black backgrounds with white text

### Interface Cleanup
- **Container Removal:** Removed unnecessary containers while keeping content
- **Text Colors:** Ensured proper contrast in both light and dark modes
- **Calendar Toolbar:** Reorganized for better UX (title first, navigation center, views right)

---

_Last updated: 2025-07-08_

---

## Dark Mode Styling Requirements

### 1. Text & Typography
- **All text:** White color
- **Font:** System default (inherit from Tailwind)

### 2. UI Elements - Gradient Applications
**Blue-to-purple gradients applied to:**
- Graph bars in billing page
- Progress bars in AI-Powered Insights
- Post Now button
- Other accent elements

### 3. Quick Actions Section
- **Buttons:** Match scheduled post content area background (dark gray)
- **Purpose:** Must stand out against the black page background
- **Border:** Remove border from Quick Actions box

### 4. Scheduled Posts Box
- **Background:** Black (not brown)
- **Border:** Yellow
- **Text:** White

### 5. Connected Accounts Box
- **Background:** Black (not brown)
- **Border:** Green
- **Text:** White

### 6. "How are we doing?" Section
- **Box and "Send feedback" button:** Match Quick Actions button styling
- **Background:** Dark color (closer to black than grey)
- **Purpose:** Stand out against black page background

### 7. Status Icons
- **"Post published" and "Account connected" icons:**
  - Color: White
  - Style: Icon only (no circle or background around icon)

---

## Light Mode Styling Requirements

### 1. Text & Typography
- **All text:** Black color
- **Font:** System default (inherit from Tailwind)

### 2. UI Elements - Gradient Applications
**Blue-to-purple gradients applied to:**
- Graph bars in billing page
- Progress bars in AI-Powered Insights
- Post Now button
- Other accent elements

### 3. Quick Actions Section
- **Buttons:** White backgrounds to match scheduled post content area
- **Border:** Remove border from Quick Actions box

### 4. Recent Activity Section
- **Border:** Remove border from Recent Activity box

### 5. Scheduled Posts Box
- **Background:** Yellow pastel
- **Border:** None
- **Text:** Black

### 6. Connected Accounts Box
- **Background:** Green pastel
- **Border:** None
- **Text:** Black

### 7. Status Icons
- **"Post published" and "Account connected" icons:**
  - Color: Black
  - Style: Icon only (no circle or background around icon)

### 8. Feedback Buttons
- **"Send feedback" and "Clear" buttons:**
  - Remove gradients
  - Both buttons: Black backgrounds

---

## Implementation Notes

### Design Baseline Reference
- **This document serves as the single source of truth for CreatorFlow's visual design**
- **Before implementing any UI changes, reference this document first**
- **The current implementation represents the baseline - maintain consistency with these specifications**
- **Any deviations from these specifications must be documented and approved**

### Color Definitions
- **Dark Mode Background:** Black (#000000)
- **Light Mode Background:** White (#FFFFFF)
- **Dark Mode Text:** White (#FFFFFF)
- **Light Mode Text:** Black (#000000)
- **Yellow Pastel:** Soft yellow (define specific hex)
- **Green Pastel:** Soft green (define specific hex)
- **Dark Grey (for buttons):** Dark grey that stands out from black background
- **Gradient Colors:** Blue (#3b82f6) to Purple (#9333ea)

### Design Principles
1. **Consistency:** All similar elements must follow the same styling rules
2. **Contrast:** Elements must have sufficient contrast against their backgrounds
3. **Gradients:** Use blue-to-purple gradients for accent elements
4. **Simplicity:** Remove unnecessary containers while maintaining functionality
5. **Accessibility:** Maintain readability and usability standards
6. **Baseline Preservation:** Maintain the current design language unless explicitly approved to change

### Maintenance
- This document should be updated whenever new styling requirements are added
- All developers must reference this document before making styling changes
- Screenshots should be taken after major styling updates to verify compliance
- **This document guides UI decisions - it is not just documentation**

---

## Version History

- **v1.2 (August 2025):** Updated to emphasize baseline reference purpose and decision-making framework
- **v1.1 (July 2025):** Updated to reflect current UI/UX improvements including gradients, button styling, and container removals
- **v1.0 (January 2025):** Initial design specification based on user feedback

---

**Note:** This document serves as the **authoritative reference** for CreatorFlow's visual design. Any deviations from these specifications must be documented and approved. The current implementation represents the baseline design that should be maintained unless explicitly changed. 
# CreatorFlow Design Specification (2025 Base)

## Overview
This document defines the **base design system** for CreatorFlow, reflecting the current implementation and screenshots for both light and dark modes. It covers the landing page, navigation, theme toggle, cards, buttons, and overall color system.

---

## 1. Color System

### Light Mode
- **Background:** Pure white (`#fff`)
- **Foreground/Text:** Black (`#171717` or `#000`)
- **Card Background:** White (`#fff`)
- **Muted/Secondary Background:** `#f5f5f5`
- **Primary Color:** Black (`#262626`)
- **Accent/Highlight:** No gradients, use solid colors only

### Dark Mode
- **Background:** Very dark gray (`#171717`)
- **Foreground/Text:** White (`#fafafa`)
- **Card Background:** Dark gray (`#262626`)
- **Muted/Secondary Background:** `#404040`
- **Primary Color:** Light gray (`#e5e5e5`)
- **Accent/Highlight:** No gradients, use solid colors only

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

## 6. Section Dividers & Spacing
- **Dividers:** Use subtle border lines (`border-border`)
- **Spacing:** Generous padding and margin for clarity

---

## 7. Footer
- **Background:** Inherits from page
- **Text:** Muted foreground
- **Links:** No underline by default, underline on hover

---

## 8. General Rules
- **No gradients anywhere**
- **No drop shadows except for subtle card shadow**
- **All icons use solid color, no gradients**
- **All text is high-contrast for accessibility**
- **All interactive elements have clear hover/focus states**

---

## 9. Reference Screenshots
- See attached screenshots for exact visual reference of light and dark modes.

---

_Last updated: 2025-07-01_

---

## Dark Mode Styling Requirements

### 1. Text & Typography
- **All text:** White color
- **Font:** System default (inherit from Tailwind)

### 2. UI Elements - Remove Gradients
**NO gradient backgrounds on:**
- User profile dropdown menu
- Notification display
- Light/dark mode toggle
- Section headers:
  - "+ Quick Actions"
  - "Recent Activity" 
  - "How are we doing?"

### 3. Quick Actions Section
- **Buttons:** Dark color (closer to black than grey, but not pure black)
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

### 2. UI Elements - Remove Gradients
**NO gradient backgrounds on:**
- User profile dropdown menu
- Notification display
- Light/dark mode toggle
- Section headers:
  - "Recent Activity"
  - "Quick Actions"
  - "How are we doing?"

### 3. Quick Actions Section
- **Buttons:** Black backgrounds
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

### Color Definitions
- **Dark Mode Background:** Black (#000000)
- **Light Mode Background:** White (#FFFFFF)
- **Dark Mode Text:** White (#FFFFFF)
- **Light Mode Text:** Black (#000000)
- **Yellow Pastel:** Soft yellow (define specific hex)
- **Green Pastel:** Soft green (define specific hex)
- **Dark Grey (for buttons):** Dark grey that stands out from black background

### Design Principles
1. **Consistency:** All similar elements must follow the same styling rules
2. **Contrast:** Elements must have sufficient contrast against their backgrounds
3. **Simplicity:** No unnecessary gradients or decorative elements
4. **Accessibility:** Maintain readability and usability standards

### Maintenance
- This document should be updated whenever new styling requirements are added
- All developers must reference this document before making styling changes
- Screenshots should be taken after major styling updates to verify compliance

---

## Version History

- **v1.0 (January 2025):** Initial design specification based on user feedback

---

**Note:** This document serves as the single source of truth for CreatorFlow's visual design. Any deviations from these specifications must be documented and approved. 
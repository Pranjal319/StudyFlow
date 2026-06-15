# StudyFlow Design System
**Premium Minimal Dark Dashboard** inspired by Notion, Linear, and modern productivity apps.

---

## 🎨 Color Palette

### Core Colors
| Name | Hex | Usage |
|------|-----|-------|
| **Background Primary** | `#0B0F1A` | Main page/body background |
| **Background Secondary** | `#111827` | Cards, panels |
| **Background Tertiary** | `#1F2937` | Hover states, borders, muted backgrounds |
| **Background Hover** | `#27313F` | Component hover states |

### Text Colors
| Name | Hex | Usage |
|------|-----|-------|
| **Text Primary** | `#E5E7EB` | Main text, headings |
| **Text Secondary** | `#9CA3AF` | Descriptions, metadata |
| **Text Muted** | `#6B7280` | Labels, helper text, secondary info |

### Accent Colors
| Name | Hex | Usage |
|------|-----|-------|
| **Accent Green** | `#22C55E` | Primary actions, active states, emphasis |
| **Accent Blue** | `#3B82F6` | Secondary actions, information |
| **Accent Emerald** | `#10B981` | Alternative accent |

### Border & Dividers
| Name | Hex |
|------|-----|
| **Border** | `#1F2937` |

---

## 📐 Component Patterns

### Cards & Panels
```css
.panel {
  @apply rounded-lg border border-[#1F2937] bg-[#111827] shadow-subtle;
}
```
- **Border Radius**: `rounded-lg` (medium, not pill-shaped)
- **Padding**: `p-4` (small) or `p-6` (standard)
- **Shadow**: Subtle, minimal elevation
- **Hover**: Slight border color change to `border-[#22C55E]/30`

### Buttons

#### Primary Button
```css
.btn-primary {
  @apply inline-flex items-center justify-center rounded-md bg-[#22C55E] px-4 py-2.5 font-medium text-white transition duration-200 hover:bg-[#16A34A] active:scale-95;
}
```
- **Color**: Accent Green
- **Hover**: Darker green
- **Active**: Scale down to 0.95

#### Secondary Button
```css
.btn-secondary {
  @apply inline-flex items-center justify-center rounded-md border border-[#374151] bg-transparent px-4 py-2.5 font-medium text-[#E5E7EB] transition duration-200 hover:bg-[#1F2937];
}
```
- **Border**: Subtle gray border
- **Hover**: Slight background tint

### Forms & Inputs
```css
.field {
  @apply w-full rounded-md border border-[#374151] bg-[#111827] px-3.5 py-2.5 text-sm text-[#E5E7EB] outline-none transition duration-200 placeholder-[#6B7280] focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E]/30;
}
```
- **Focus**: Accent green border + subtle ring
- **Placeholder**: Muted text color

### Icons
- **Size**: 18px (standard), 20px (large)
- **Color**: Inherit from text color or explicit accent
- **Library**: React Icons (FiXxx - Feather icons) or Lucide

---

## 📏 Typography

### Heading Hierarchy
```css
/* Page heading */
h1: font-display text-4xl font-semibold text-[#E5E7EB]

/* Section heading */
h2: font-display text-2xl font-semibold text-[#E5E7EB]

/* Subsection */
h3: font-display text-lg font-semibold text-[#E5E7EB]
```

### Text Styles
```css
/* Primary text (default) */
p: text-base text-[#E5E7EB]

/* Secondary text (descriptions) */
p: text-sm text-[#9CA3AF]

/* Muted text (labels, metadata) */
p: text-xs font-medium uppercase tracking-[0.1em] text-[#6B7280]

/* Meta/helper text */
span: text-xs text-[#6B7280]
```

### Font Families
- **Display/Headings**: "Sora", system fonts
- **Body**: "Manrope", system fonts
- **Weights**: 400, 500, 600, 700, 800

---

## 🎬 Interactions & Animations

### Hover Effects
- **Cards**: Border glow with `border-[#22C55E]/30`
- **Buttons**: Background/color shift, smooth transition
- **Icons**: Slight scale up (1.02) or color change

### Active/Selected States
- **Buttons**: Scale down to 0.95
- **Form inputs**: Accent green border + ring
- **Navigation**: Accent green background fill

### Transitions
```css
transition: all 200ms ease
/* or specific properties: */
transition duration-200
```

### Disabled States
```css
opacity-50 cursor-not-allowed bg-[#1F2937] text-[#6B7280]
```

---

## 🏗️ Layout Patterns

### Sidebar Navigation
- **Width**: `w-64` (16rem)
- **Position**: `fixed left-0 top-0 h-screen`
- **Content**: Logo at top, menu items, pro-tip at bottom
- **Border**: Right border with `#1F2937`

### Main Content Area
- **Left offset**: `lg:ml-64` on main content
- **Padding**: `px-6 py-10` for spacing
- **Max-width**: `max-w-7xl` for readability

### Grid Layouts
```css
/* Stat cards */
grid gap-6 md:grid-cols-3

/* Chart layout */
grid gap-6 lg:grid-cols-[1.4fr,0.9fr]

/* Settings options */
grid gap-4 md:grid-cols-2 xl:grid-cols-3
```

---

## 🎨 Color Usage by Component

| Component | Primary | Secondary | Muted |
|-----------|---------|-----------|-------|
| **Text** | `#E5E7EB` | `#9CA3AF` | `#6B7280` |
| **Background** | `#0B0F1A` | `#111827` | `#1F2937` |
| **Accent** | `#22C55E` | `#3B82F6` | `#10B981` |
| **Borders** | — | `#1F2937` | — |
| **Hover** | — | `#27313F` | — |

---

## ✅ Implementation Checklist

When updating/creating components:
- [ ] Use new color hex values (not old Tailwind variables)
- [ ] Apply proper typography hierarchy
- [ ] Add hover effects where applicable
- [ ] Use `rounded-lg` not `rounded-full` or `rounded-3xl`
- [ ] Test focus states (especially forms)
- [ ] Ensure sufficient contrast for accessibility
- [ ] Use accent green for primary actions
- [ ] Add 200ms smooth transitions
- [ ] Remove any gradient backgrounds
- [ ] Test on dark background (no light mode needed)

---

## 🚀 Future Enhancements

- [ ] Micro-animations with Framer Motion
- [ ] Task completion fade + strikethrough animation
- [ ] Hover lift effect on cards (scale 1.02)
- [ ] Animated progress bars
- [ ] Loading spinners with accent color
- [ ] Success/error toast notifications

---

## 📁 File References

**Config Files:**
- `tailwind.config.js` - Color definitions
- `app/globals.css` - Global styles & utility classes
- `app/layout.js` - Body background

**Component Files:**
- `components/sidebar.js` - Navigation sidebar
- `components/site-header.js` - Top navbar
- `components/dashboard-shell.js` - Main layout wrapper
- `components/pomodoro-timer.js` - Timer component
- `components/task-board.js` - Task list
- `components/analytics-charts.js` - Charts
- `components/subject-form.js` - Form example

---

**Last Updated:** April 2026  
**Version:** 1.0 - Premium Minimal Dark Theme

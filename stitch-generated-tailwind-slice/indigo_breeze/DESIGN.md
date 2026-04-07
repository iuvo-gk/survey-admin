# Design System Strategy: The Conversational Canvas

## 1. Overview & Creative North Star
The "Conversational Canvas" is the creative North Star of this design system. We are moving away from the rigid, data-heavy density of traditional SaaS and toward an **Editorial Survey Experience**. The goal is to make data collection feel like a high-end, guided conversation rather than a digital chore.

To break the "template" look, this system utilizes **intentional asymmetry** and **tonal layering**. We prioritize breathing room (white space) as a functional element that reduces cognitive load. By combining the approachable geometry of `plusJakartaSans` for displays with the hyper-legibility of `inter` for data, we create a rhythmic hierarchy that feels both premium and welcoming.

## 2. Colors & Surface Architecture
Our palette transitions from deep, authoritative Indigos (`primary`) to refreshing, organic Teals (`secondary`). This creates a "trust-meets-innovation" spectrum.

### The "No-Line" Rule
**Borders are a design failure.** To achieve a high-end aesthetic, designers are prohibited from using 1px solid borders to section content. Boundaries must be defined through background shifts or tonal transitions.
- Use `surface_container_low` for the main canvas.
- Use `surface_container_lowest` (pure white) for interactive cards to create a natural "pop."
- Use `surface_container_high` for persistent sidebars or navigation anchors.

### Surface Hierarchy & Nesting
Treat the UI as physical layers of fine, semi-translucent paper.
- **Level 0 (Base):** `surface`
- **Level 1 (Sectioning):** `surface_container`
- **Level 2 (Interaction):** `surface_container_lowest` (The "active" card level)

### The Glass & Gradient Rule
To inject "soul" into the SaaS experience, utilize **Glassmorphism** for floating headers or modal overlays. 
- **Backdrop Blur:** Use 12px–20px blur on `surface` colors at 80% opacity.
- **Signature Gradients:** For primary CTAs and Hero moments, use a linear gradient from `primary` (#3525cd) to `primary_container` (#4f46e5). This adds a subtle 3D "sheen" that flat colors cannot replicate.

## 3. Typography Scale
We employ a dual-font strategy to balance personality with utility.

| Level | Token | Font | Size | Intent |
| :--- | :--- | :--- | :--- | :--- |
| **Display** | `display-lg` | Plus Jakarta Sans | 3.5rem | Hero survey questions; bold brand moments. |
| **Headline** | `headline-md` | Plus Jakarta Sans | 1.75rem | Section headers; welcoming prompts. |
| **Title** | `title-md` | Inter | 1.125rem | Card titles; question labels. |
| **Body** | `body-lg` | Inter | 1rem | Default response text; paragraph content. |
| **Label** | `label-md` | Inter | 0.75rem | Metadata; micro-copy; "Required" tags. |

**Editorial Note:** Use `display` tokens with `-0.02em` letter spacing to create a high-fashion, "tight" editorial look for short headings.

## 4. Elevation & Depth
Depth is achieved through **Tonal Layering**, not structural scaffolding.

- **The Layering Principle:** Place a `surface_container_lowest` card on a `surface_container_low` background. The slight shift in hex value creates a soft, sophisticated lift.
- **Ambient Shadows:** For floating elements (Modals/Popovers), use a custom shadow: `0px 24px 48px rgba(27, 27, 36, 0.06)`. Note the use of `on_surface` (#1b1b24) as the shadow tint rather than pure black; this ensures the shadow feels like natural ambient light.
- **The "Ghost Border" Fallback:** If a divider is functionally required for accessibility, use the `outline_variant` at **15% opacity**. It should be felt, not seen.

## 5. Components

### Buttons & Interaction
- **Primary:** Gradient fill (`primary` to `primary_container`) with `DEFAULT` (1rem) rounded corners. Text is `on_primary`.
- **Secondary:** Surface-toned with a `secondary` text color. No border.
- **The "Squircle" Factor:** All interactive elements must use the `DEFAULT` (1rem) or `md` (1.5rem) corner radius to maintain the "friendly" aesthetic.

### Cards (The Core Unit)
- **Styling:** `surface_container_lowest` background, no border, `md` (1.5rem) corner radius.
- **Spacing:** Use 32px (2rem) internal padding to ensure content feels "airy."
- **Nesting:** Do not use dividers inside cards. Use vertical white space or `surface_variant` backgrounds to separate header from body.

### Form Inputs
- **State Change:** On focus, the input should not just show a ring; it should transition from `surface_container_highest` to `surface_container_lowest` with a subtle `primary` glow.
- **Affordance:** Use `xl` (3rem) rounding for search bars and `sm` (0.5rem) for multi-line text areas to differentiate intent.

### Custom Survey Components
- **Progress Steppers:** Use a thick `secondary_container` track with a `secondary` fill. Avoid thin lines; go for a "pill" look with `full` (9999px) rounding.
- **Selection Cards:** For multiple-choice questions, the card should scale by 1.02x on hover and transition to a `primary_fixed` background when selected.

## 6. Do’s and Don’ts

### Do
- **Do** use `display-lg` for single-word emphasis within a sentence.
- **Do** lean into asymmetry. Off-center a survey card to the left to leave room for an illustrative "Glass" element on the right.
- **Do** use `secondary` (Teal) for success states and positive reinforcement.

### Don't
- **Don't** use 100% black (#000000). Always use `on_surface` (#1b1b24) for text to maintain a premium, soft-contrast feel.
- **Don't** use "Drop Shadows" on standard grid items. Reserve elevation for true "floating" overlays.
- **Don't** use the `none` roundedness token. Even "square" elements should have at least the `sm` (0.5rem) radius to stay "friendly."
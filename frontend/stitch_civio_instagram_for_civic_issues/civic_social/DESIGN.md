---
name: Civic Social
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1b1b1d'
  surface-container: '#201f21'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#c7c4d7'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#303032'
  outline: '#918fa0'
  outline-variant: '#464554'
  surface-tint: '#c3c0ff'
  primary: '#c3c0ff'
  on-primary: '#1e00a5'
  primary-container: '#5851db'
  on-primary-container: '#e4e0ff'
  inverse-primary: '#5149d4'
  secondary: '#ffb1c0'
  on-secondary: '#660029'
  secondary-container: '#b7004f'
  on-secondary-container: '#ffc6d0'
  tertiary: '#ffb86b'
  on-tertiary: '#492900'
  tertiary-container: '#935800'
  on-tertiary-container: '#ffdfc1'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#382cbb'
  secondary-fixed: '#ffd9df'
  secondary-fixed-dim: '#ffb1c0'
  on-secondary-fixed: '#3f0017'
  on-secondary-fixed-variant: '#90003d'
  tertiary-fixed: '#ffdcbc'
  tertiary-fixed-dim: '#ffb86b'
  on-tertiary-fixed: '#2c1700'
  on-tertiary-fixed-variant: '#683d00'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '700'
    lineHeight: '1.2'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.4'
  label-bold:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.05em
  stat-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '800'
    lineHeight: '1'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  margin-mobile: 16px
  margin-desktop: 24px
  gutter: 12px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The design system adopts a **Premium Dark-Mode Social** aesthetic, intentionally stripping away the bureaucratic visual language typically associated with civic engagement. It targets a younger, mobile-first demographic that expects high-fidelity interactions and social-media-grade storytelling.

The brand personality is **urgent, high-energy, and prestigious**. By mirroring the "Instagram" mental model, the interface shifts the perception of civic reporting from a chore to a social contribution. The visual style leverages **Glassmorphism** for overlays and **High-Contrast Bold** elements for critical calls to action, ensuring that "social" features feel lush while "issue" features feel pressing.

## Colors
The palette is rooted in true black (`#000000`) to maximize OLED efficiency and visual depth. Surface colors use a slightly warmer grey-black to distinguish interactive containers. 

The **Accent Gradient** (Purple-to-Pink) is reserved for high-engagement moments: new report indicators, active story rings, and primary action highlights. The **Support Button** uses a high-visibility Amber-Orange to signify "taking action" or "funding," providing a sharp contrast to the social-heavy gradient. Links use an Electric Blue to maintain standard web/app accessibility conventions within a dark UI.

## Typography
This design system utilizes **Inter** exclusively for its systematic, neutral, and highly legible characteristics. To achieve the "premium" social feel, we rely on extreme weight contrast.

- **Headlines:** Use Bold (700) or ExtraBold (800) with tight letter-spacing for a modern, editorial impact.
- **Stats:** Local metrics and support counts are treated as primary visual elements using `stat-lg`.
- **Labels:** Small metadata (location, time-stamps) should use the `label-bold` token with increased tracking to maintain legibility against dark backgrounds.

## Layout & Spacing
The layout follows a **Mobile-First Fluid Grid**. On mobile devices, the layout is edge-to-edge for media content, with a standard 16px horizontal margin for text-heavy content. 

- **Feed Structure:** Cards span 100% of the viewport width on mobile to mimic the Instagram feed. On larger screens, the feed is centered with a max-width of 600px.
- **Rhythm:** Use an 8px base grid. Content within cards uses 12px gutters between the media and the descriptive text.
- **Safe Areas:** Ensure the bottom navigation bar accounts for device notches and has a background blur (Backdrop Filter) to allow content to scroll underneath.

## Elevation & Depth
Depth is created through **Tonal Layering** and **Backdrop Blurs** rather than traditional drop shadows.

1.  **Level 0 (Base):** Pure Black (#000000).
2.  **Level 1 (Cards):** Surface-Container (#121214) with a subtle 1px stroke of #FFFFFF at 10% opacity.
3.  **Level 2 (Modals/Overlays):** Semi-transparent surfaces (80% opacity) with a 20px background blur to maintain context of the feed underneath.
4.  **Indicators:** Active states use the primary gradient as a "glow" (shadow with high spread, low opacity) to signify urgency.

## Shapes
The shape language is overtly modern and friendly. 
- **Cards & Modals:** Use a strict 24px (`rounded-xl` equivalent) corner radius.
- **Avatars:** Strictly circular (50% radius) to fit the social media paradigm.
- **Action Buttons & Chips:** Use pill-shaped (fully rounded) geometry to distinguish interactive elements from content containers.
- **Media:** Photography within cards should inherit the card's 24px radius only on the top corners if it is part of a combined card, or all corners if it is a standalone post.

## Components
- **Primary Feed Card:** A container with `#121214` background, 24px corner radius, and edge-to-edge imagery at the top. Engagement icons (Upvote, Comment, Share) are placed immediately below the media.
- **Support Button:** A pill-shaped button using the `#FF9F1C` (Amber-Orange) background with black text. This is used for "Boost" or "Resolve" actions.
- **Story Rings:** User avatars featuring an active civic report are wrapped in a 2px stroke using the Purple-to-Pink gradient.
- **Civic Chips:** Small, pill-shaped tags used for categorizing issues (e.g., "Infrastructure," "Safety"). Use a semi-transparent white background (15% opacity) with white text.
- **Input Fields:** Search and comment bars should be dark grey (#1C1C1E) with 12px padding and 12px corner radius. No borders, unless focused (then use the Electric Blue link color).
- **Progress Bars:** For "Community Goals," use the primary gradient for the fill and a dark grey for the track.
# Design Review: Abivan Portfolio Contact Placement
**Date**: 2026-09-23
**URL**: http://127.0.0.1:5174/

## Overall Impression
The contact section is in the right place: after the selected projects and immediately before the footer. This lets the work establish context before the email call to action asks visitors to reach out. The dark section also gives the page a clear visual close.

## Findings

### High
- None.

### Medium
- **Contact is only discoverable at the bottom of the page** — the header links to About, Selected work, and GitHub, while the email address appears in the closing section. Add a `Contact` header link that targets this section so visitors can reach the email directly.

### Low
- The contact area is a large closing panel, but its two actions remain visually clear: email is primary and GitHub is secondary. Keep this hierarchy.

## Responsive Review
The stylesheet stacks the closing headline and contact links on narrow screens. The email link stays first, preserving the primary action. This assessment is based on the responsive CSS; a mobile viewport was not captured during this review.

## What Looks Good
- Contact follows the selected work and precedes the footer, giving the page a natural ending.
- The dark background distinguishes the closing section from the project area.
- The email button has the strongest visual weight, with GitHub presented as a secondary option.

## Top 3 Fixes
1. Add a `Contact` link to the header, targeting the existing closing section.
2. Keep the closing section after the projects.
3. Preserve the email-first visual hierarchy.

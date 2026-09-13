# Section transition review

Reviewed the local Home, About, Services and Luniky project pages on 13 September 2026, alongside their section/background code.

## Applied

The Projects overview and both light sections in each project detail now fade vertically: `#d7c6b9` at the top to `#fbf8f6` at the bottom. The project CTA fade was subsequently refined into a separate 160–256px eased transition with exact ivory/dark endpoints. The gallery finishes before the fade begins, and CTA top padding is reduced to balance the longer blend. Verified at desktop and 390px mobile width.

## Recommended next pass

1. **Keep reading backgrounds stable.** Home's Pulse Effect and About's Values animate a full dark layer upward and reduce its opacity over a beige base. Text retains its light color as the background lightens. On About, the lower cards visibly sit against a grey intermediate background during exit. Replace those whole-section background animations with solid reading surfaces; put any fade in a content-free boundary area. Keep the hero video's delayed exit and restrained content reveals.
2. **Use one consistent finish into the CTA.** Project details now have a 160–256px eased fade, while Projects overview, Home and About cut directly from light to dark. Use a shared transition treatment at those light-to-dark CTA boundaries, with the correct incoming color and a restrained responsive height. Where Services already ends dark, let that background continue into the dark CTA.
3. **Preserve clear chapter boundaries.** The crisp dark/light changes between service categories, and the project hero/scope/gallery boundaries, provide useful separation. Keep these deliberate cuts. Consistency means using the same treatment for the same purpose; it does not require a gradient between every section.
4. **Simplify redundant layers and spacing.** Home's Services teasers and About's Story/Team animate layers over identical base colors, so the backgrounds do not meaningfully transition. Remove these redundant layers in the next pass. Use a shared spacing scale for content-to-boundary and boundary-to-heading distances; reserve full-screen minimum heights for the hero and layouts that need them. The CTA currently receives different vertical padding on About versus other pages.

The broader transition recommendations have now been applied in the subsequent [health and theme pass](2026-09-13-health-and-theme-implementation.md): stable reading backgrounds, shared CTA fades, reusable gradient surfaces, and simplified section spacing. Check any subsequent change at desktop and mobile widths, mid-scroll as well as settled positions, and with reduced motion. Fades should not overlap text or carousel controls.

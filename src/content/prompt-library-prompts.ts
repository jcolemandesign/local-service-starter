export type PromptLibraryPrompt = {
  id: string;
  title: string;
  description: string;
  inputs: string[];
  prompt: string;
};

export const promptLibraryWorkflow = [
  "Generate the source packet and strategy digest from the client intake.",
  "Run Phase 1 when the client has an existing website, then paste its output into Supplemental research.",
  "Paste the strategy digest plus Supplemental research into Phase 2.",
  "Paste the Strategy Brief plus strategy digest into Phase 3.",
  "Choose a page template, then copy its Template Copy Contract from the Template Library.",
  "Run Phase 4 once per page using the strategy digest, selected page context from the Strategy Workspace, and Template Copy Contract.",
  "Review the output manually, move approved fields into the page content editor, then stage the page.",
];

export const promptLibraryPrompts: PromptLibraryPrompt[] = [
  {
    id: "current-website-scrape",
    title: "Current Website Research Notes",
    description:
      "Scrapes the client's existing website for factual inputs to paste into the Strategy Workspace before writing strategy.",
    inputs: [
      "Client website URL",
      "Optional strategy digest or intake notes",
      "Optional list of priority pages to inspect",
    ],
    prompt: String.raw`You are researching a local service business's existing website so the strategy workspace can be filled with accurate, supported information.

Use the client's current website as a factual source. If a strategy digest or intake notes are provided, use them only to understand context and identify conflicts. Do not invent claims or fill gaps from assumptions.

Visit and inspect the homepage plus any important public pages you can find, especially:

- Services
- Service detail pages
- About
- Contact
- Service areas / locations
- Financing, warranties, memberships, coupons, specials, or guarantees
- Reviews/testimonials
- FAQ
- Blog/resource pages only if they contain current business facts

If the website is very large, prioritize pages that affect website strategy, conversion, service positioning, proof, contact flow, and sitemap/content planning.

---

# Output Format

Return concise notes that can be pasted into the Strategy Workspace Supplemental research field.

Do not write final website copy.
Do not recommend templates.
Do not rewrite the brand.
Do not add unsupported facts.
Add source URLs next to important facts, not only in the source list at the end.
Separate facts the site explicitly states from strategy observations the site merely suggests.
Only summarize reviews/testimonials that are visible on the business's own website. Do not scrape or summarize Google, Yelp, Facebook, Angi, BBB, or other third-party review platforms unless the client separately provides that material.

Use this exact structure:

## Current Website Research Notes

Website URL:

Date reviewed:

## 1. Business Facts Found

List only facts explicitly supported by the website.

Include:

- Business name
- Business type
- Primary services
- Secondary services
- Service area / locations
- Phone
- Email
- Address
- Hours
- License numbers, credentials, certifications, affiliations, or insurance claims
- Years in business or founding date
- Financing, warranties, guarantees, memberships, coupons, specials, or discounts

For each important fact, include the source URL in parentheses immediately after the fact.

Example:

- Licensed and insured. (Source: https://example.com/about)

If a fact is not found, write "Not found."

## 2. Current Site Structure

List the visible sitemap or important pages.

For each page include:

- Page title / nav label
- URL
- Purpose of page
- Any important content or conversion points

## 3. Old URLs Worth Preserving

List existing URLs that should probably be preserved, redirected, or reviewed during rebuild/migration.

Include:

- Homepage and primary nav URLs
- High-value service pages
- Location/service-area pages
- Contact/booking pages
- Pages that may have backlinks or search value
- URLs with clear conversion or ranking importance
- Any URLs that look outdated but may still need redirects

For each URL include:

- URL
- Why it may matter
- Recommended handling: preserve, redirect, merge, or verify

## 4. Service Inventory

Group the services mentioned on the site.

Use these groups:

### Prominent services

Services that are featured in navigation, homepage sections, hero copy, major cards, or repeated calls to action.

### Supporting services

Services that are present but less emphasized.

### Lightly mentioned or buried services

Services mentioned only briefly, in lists, footers, FAQs, or older resource content.

For each service, include the page URL(s) where it appears.

Separate:

- Site says: explicit service language or claim from the site, with source URL
- Site suggests: strategy observation based on prominence, repetition, nav position, or page depth

Example:

- Site says: "24/7 emergency AC repair" appears on the AC repair page. (Source: URL)
- Site suggests: AC repair appears prominent because it is in the main nav and homepage hero.

## 5. Positioning And Differentiators

Extract the real positioning language from the website.

Include:

- Taglines or repeated claims
- Differentiators
- Tone/personality
- Customer promises
- Proof points
- Review/testimonial themes
- Local/community language

Quote only short phrases when useful. Keep quotes brief.

For each important claim or differentiator, include the source URL.

## 6. Conversion Flow

Describe how the current website asks visitors to take action.

Include:

- Primary CTA text
- Secondary CTA text
- Phone/call path
- Booking/scheduling path
- Contact form path
- Form fields requested
- Emergency/urgent service path, only if explicitly stated
- Thank-you or confirmation messaging, if visible

## 7. Mobile And CTA Friction

Review the site like a conversion audit, especially on mobile if possible.

Call out:

- Buried or unclear phone/call CTA
- Missing sticky call path
- Weak or inconsistent primary CTA
- Confusing nav labels
- Contact form hard to find
- Too many form fields
- Unclear service area before contacting
- Important proof hidden too low
- Emergency/urgent path missing or unclear
- Mobile header problems
- Tap targets, readability, or spacing issues

Separate:

- Confirmed issue: directly visible problem
- Strategy observation: likely conversion improvement to consider

## 8. Trust And Proof

List trust signals found on the site.

Include only supported:

- Reviews/testimonials visible on the business's own site
- Review platform mentions
- Certifications
- Awards
- Associations
- Before/after examples
- Project photos
- Team photos
- Guarantees/warranties
- Financing/payment options
- Safety/background/license language

Do not visit, scrape, or summarize third-party review pages. If the business website links to Google/Yelp/etc., note only that the link exists and include the page URL where the link appears.

## 9. Customer Questions The Site Already Answers

List questions the current website answers clearly.

Examples:

- What services do they offer?
- Where do they work?
- How do I book?
- Do they offer emergency service?
- Do they provide financing?
- What happens after I submit a form?

## 10. Gaps, Risks, And Conflicts

List anything that should be verified before using it in strategy or copy.

Include:

- Missing contact/service area details
- Outdated pages or offers
- Conflicting claims
- Unsupported credentials
- Unclear service priorities
- Claims that appear risky or legally sensitive
- Broken links or inaccessible pages

If strategy digest or intake notes conflict with the website, call that out clearly.

## 11. Suggested Strategy Workspace Placement

Tell the user where to paste or use the findings.

Use:

- Supplemental research:
- Strategy brief facts to consider:
- Content plan facts to consider:
- Page copy facts to consider:
- Items requiring verification:

## 12. Source URL Notes

List all URLs reviewed with a one-line summary of what each contributed. This is a complete source log, but important facts above should still have source URLs beside them.

---

# Accuracy Rules

- Preserve the business's real facts and terminology.
- Distinguish "site says" confirmed facts from "site suggests" strategy observations.
- Do not infer licenses, guarantees, emergency availability, service areas, financing, pricing, or years in business unless explicitly stated.
- Treat "emergency service" as confirmed only when the website explicitly says emergency, 24/7, same-day urgent service, after-hours, or equivalent language.
- If information appears in an image and cannot be read reliably, mark it as uncertain.
- If pages cannot be accessed, list them under gaps.
- Do not use third-party review platforms as review sources in this prompt.
- Keep the output practical and compact enough to paste into a strategy workspace.`,
  },
  {
    id: "strategy-brief",
    title: "Strategy Digest to Website Strategy Brief",
    description:
      "Turns the generated strategy digest and optional research into the strategy layer.",
    inputs: [
      "Strategy digest",
      "Optional website, GBP, review, competitor, or asset notes",
    ],
    prompt: String.raw`You are creating a website strategy brief for a local service business.

Use the provided source material:

- Generated strategy digest from the client intake source packet
- Existing website notes or scraped content, if provided
- Google Business Profile details, if provided
- Reviews/testimonials, if provided
- Competitor references, if provided
- Asset notes, if provided

Treat the generated strategy digest as the primary factual source of truth.

Use public/existing materials only to:

- Fill gaps
- Match the business's real language
- Identify proof points or service patterns
- Clarify services, locations, tone, and customer concerns

Do not invent unsupported factual claims, certifications, pricing, guarantees, review counts, years in business, emergency availability, financing, warranties, service areas, credentials, or proof points.

Do not write final polished website copy yet.

Your job is to translate the source material into a concise, practical website strategy brief that can guide the sitemap, homepage plan, service content, lead capture flow, and later copywriting.

If the strategy digest marks something as missing, conflicted, risky, uncertain, "Non-priority," or "Do not promote," handle it carefully and call that out in the appropriate section.

---

# Website Strategy Brief

## 1. Business Snapshot

Business name:

Business type:

Short description:

Primary customer:

Service model:

Examples: residential, commercial, mobile service, service-area business, storefront, appointment-based, emergency service, etc.

Primary service area:

Important contact details:

Include phone, email, hours, address/service-area details, website, and Google Business Profile if provided.

---

## 2. Core Offer

Summarize what this business mainly provides, who it serves, and what the website should make obvious within the first few seconds.

Keep this concise and practical.

---

## 3. Service Strategy

Group the services using the same treatment language as the strategy digest:

### Feature heavily

Services the website should emphasize most.

### Standard Service

Services that matter and should be easy to find, but are not the main sales focus.

### Non-priority

Services that exist but should not dominate the site.

### Do not promote

Services the business does not want to advertise or attract more of.

For each category, briefly explain why based on the strategy digest.

Do not upgrade a service into a higher-priority category unless the strategy digest clearly supports it.

---

## 4. Primary Website Goal

State the main conversion goal.

Include:

- Primary CTA
- Secondary CTA
- Urgent-service path, if relevant
- Whether the site should push quote requests, calls, bookings, lead forms, consultations, memberships, or another action

---

## 5. Trust & Positioning

Identify the strongest trust angle.

Include only supported:

- Credentials or proof points
- Customer compliments or review themes
- Differentiators
- Tone/personality the site should convey
- Reputation signals worth using

Do not exaggerate.

---

## 6. Customer Questions & Friction

List the main questions, hesitations, or objections the website needs to answer.

Focus on:

- Pricing/process concerns
- Timing/availability concerns
- Service area concerns
- Repair vs. replacement or option-comparison concerns
- Trust concerns
- "Am I a good fit?" concerns

---

## 7. Lead Capture Direction

Recommend the best contact/form flow.

Include:

- Recommended primary form CTA
- Suggested form fields
- Fields to avoid for now
- What urgent visitors should do
- What the thank-you message should reassure them about
- What the owner notification should emphasize
- Any simple automation ideas suggested by the source material

Keep the form low-friction.

---

## 8. Website Emphasis

List the top 5-8 strategic priorities for the website.

Examples:

- Mobile-first lead capture
- Clear service area
- Always-visible phone number
- Emergency call path
- Priority service promotion
- Maintenance plan/membership positioning
- Local trust/reviews
- Quote request clarity
- Repair-vs-replace education
- Seasonal offer support

---

## 9. Copy Guardrails

List everything the website should avoid saying, promising, implying, or overemphasizing.

Include:

- Unsupported claims
- Services not to promote
- Customer types to avoid attracting
- Pricing limitations
- Emergency/service availability limitations
- Tone issues
- Anything that could create bad leads or unrealistic expectations

---

## 10. Content Opportunities

List practical opportunities for later website content.

Include only ideas supported by the strategy digest or provided source material.

Examples:

- Dedicated service pages
- Location pages
- Seasonal promo pages
- Maintenance plan page
- Referral page
- FAQ topics
- Before/after or project photo sections
- Review/testimonial sections
- Landing pages

---

## 11. Missing Info

Separate missing details into:

### Must confirm before final copy

Important facts that could affect accuracy or claims.

### Nice to have

Helpful but not required.

### Can safely draft without it

Things that can be reasonably handled with placeholders or generic structure.

---

## 12. Final Condensed Brief

End with a tight summary in this exact format:

Business:

[Business name + short description]

Primary offer:

[Core service promise / what they mainly provide / who they serve]

Priority services:

[Services, packages, offers, or project types the website should emphasize most]

Primary CTA:

[Main action the website should push, plus any urgent/secondary action]

Trust angle:

[Most important proof points, differentiators, customer compliments, credentials, or reputation signals]

Avoid:

[Claims, services, customer types, promises, or wording to avoid]

Website emphasis:

[What the site should prioritize: lead capture, booking, service area clarity, emergency path, recurring plans, premium positioning, project estimates, etc.]

---

Keep the output clear, concise, and website-focused. Do not over-explain. Do not write final page copy yet.

---

Strategy Digest:

[paste strategy-digest.md here]

---

Optional Existing/Public Materials:

[paste existing site notes, GBP notes, reviews, competitor notes, or asset notes here if available]`,
  },
  {
    id: "content-plan",
    title: "Strategy Digest + Strategy Brief to Website Content Plan",
    description:
      "Turns the strategy brief into a sitemap, homepage flow, page map, and copy plan.",
    inputs: ["Strategy digest", "Website Strategy Brief"],
    prompt: String.raw`You are creating a practical website content plan for a local service business.

Use the Website Strategy Brief as the planning guide.

Use the strategy digest as the factual boundary.

If the Website Strategy Brief conflicts with the strategy digest, follow the strategy digest and flag the conflict.

Do not re-invent the strategy. Do not add unsupported claims, certifications, pricing, guarantees, review counts, emergency availability, service areas, financing, warranties, years in business, credentials, or proof points unless they are clearly supported by the strategy digest.

Do not write final polished website copy yet. This is a planning document for building the website, choosing sections, and writing final copy later.

Your job is to turn the strategy brief into:

- Recommended sitemap
- Homepage section plan
- Page-by-page content map
- Core messaging options
- Services content plan
- FAQ direction
- Lead capture/form flow
- Copywriting guardrails
- Missing info checklist

---

# Website Content Plan

## 1. Site Strategy Summary

Write one concise paragraph explaining:

- What kind of website this business needs
- Who it should speak to
- What services or offers it should emphasize
- What action visitors should be pushed toward
- What trust or positioning angle should shape the copy

Keep this practical, direct, and website-focused.

---

## 2. Recommended Sitemap

Create a recommended sitemap.

Always include:

- Home
- Services
- About
- Contact / Request Quote
- Thank You

Also recommend optional pages if they make sense based on the brief and strategy digest:

- Priority service pages
- Location/service-area pages
- Seasonal promo pages
- Maintenance/membership page
- Emergency service page
- Referral page
- Booking page
- Landing pages

For each page, include:

- Page name
- Suggested URL slug
- Purpose
- Priority: Essential, Recommended Later, or Optional

Use this format:

| Page | Suggested URL | Priority | Purpose |
| --- | --- | --- | --- |

---

## 3. Homepage Flow / Wireframe Plan

Create a section-by-section homepage outline.

For each section, include:

- Section name
- Semantic role
- Purpose
- Draft copy direction
- Content needed
- Suggested CTA, if relevant

Use these semantic roles where useful:

- Navigation
- Scan
- Narrative
- Proof
- Decision
- Conversion
- Footer

Start with this practical local-service structure, then adjust if the brief suggests a better flow:

1. Navigation
2. Hero
3. Trust bar / proof strip
4. Main services
5. Priority service or offer section
6. Why choose us
7. Process / how it works
8. Service area
9. FAQ
10. Final CTA
11. Footer

Make clear what should appear high on the page, what can appear later, and what CTA should repeat.

Use this format:

| Order | Section | Semantic Role | Purpose | Copy Direction | Content Needed | CTA |
| --- | --- | --- | --- | --- | --- | --- |

---

## 4. Page-by-Page Content Map

Break down what content should appear on each major page.

Include at minimum:

- Homepage
- Services overview
- About
- Contact / Request Quote
- Thank You
- Footer

For optional pages, include only if recommended in the sitemap.

For each page, include:

- Purpose
- Main sections
- Copy angle
- CTA direction
- Notes / proof needed

Use concise bullets.

---

## 5. Core Messaging

Create practical messaging options based on the brief and strategy digest.

Include:

### Hero headline options

Write 5 options.

They should be clear, local, specific, and conversion-focused.

Avoid generic hype like:

- "Best service in town"
- "Quality you can trust"
- "Your comfort is our priority"

Unless the strategy digest strongly supports that kind of phrasing.

### Homepage subhead options

Write 2 options.

Each should explain:

- What they do
- Who they serve
- Why the business is credible or easier to work with
- What action to take next

### Trust/proof bullets

Write 6-8 short bullets using only supported proof points.

### CTA labels

Provide:

- Primary CTA label
- Secondary CTA label
- Urgent CTA label, if relevant
- 5 alternate CTA labels

Keep CTA labels short, usually 2-4 words.

---

## 6. Services Content Plan

Create a service content plan.

Use the strategy digest's service treatment categories as the boundary:

- Feature heavily
- Standard Service
- Non-priority
- Do not promote

Include:

- Recommended priority order
- Service card titles
- Short 1-2 sentence copy direction for each service
- Which services deserve dedicated pages later
- Which services should be mentioned lightly or not promoted
- Suggested form dropdown options

Do not overemphasize services marked as "Non-priority" or "Do not promote."

Use this format:

| Priority | Service | Website Treatment | Card / Section Direction | Dedicated Page? | Notes |
| --- | --- | --- | --- | --- | --- |

---

## 7. FAQ Plan

Write 6-10 FAQ questions and answer directions.

Base them on:

- Customer questions from the brief
- Pricing/process concerns
- Timing/availability concerns
- Service area concerns
- Comparison concerns
- Trust concerns
- Bad-fit/customer-fit concerns

For each FAQ, include:

- Question
- Answer direction

Do not write overly polished final answers yet. Keep answers accurate and cautious.

Use this format:

| Question | Answer Direction |
| --- | --- |

---

## 8. Lead Capture / Form Flow Recommendation

Recommend the best form and contact flow.

Include:

- Primary form CTA
- Secondary contact path
- Urgent-service path
- Recommended form fields
- Fields to avoid for now
- Thank-you page message direction
- Owner notification priorities
- Customer confirmation message direction
- Simple follow-up automation ideas
- Any routing or qualification notes

Keep the form low-friction.

For form fields, separate into:

### Recommended fields

### Optional later fields

### Avoid for now

---

## 9. Visual / Asset Direction

Based on the strategy brief and strategy digest, recommend:

- Best image types
- Where real photos should be used
- What visual proof matters most
- Any logo/team/truck/project photo opportunities
- Any image types to avoid

Do not invent assets. Use placeholders if assets are missing.

---

## 10. SEO / Local Content Direction

Create a simple local SEO content direction.

Include:

- Homepage local language
- Service area section direction
- Recommended service pages
- Recommended location pages, if appropriate
- Page title/meta direction
- Internal linking opportunities
- Google Business Profile alignment notes

Do not promise rankings.

Keep this practical and lightweight.

---

## 11. Copy Guardrails

List what the final copy must avoid.

Include:

- Unsupported claims
- Services not to promote
- Pricing limitations
- Emergency/availability limitations
- Bad-fit customers
- Tone issues
- Overpromising risks
- Any language that could create bad leads

This section should be strict and specific.

---

## 12. Missing Info Before Final Copy

Separate missing information into:

### Must confirm

Facts needed before final polished copy.

### Nice to have

Helpful details that would improve the site.

### Can draft with placeholders

Things that can be safely handled with generic structure or placeholders.

---

## 13. Final Build Notes

End with a short list of practical build notes for the designer/developer.

Include:

- Recommended homepage emphasis
- Repeated CTA pattern
- Mobile-specific priorities
- Form/thank-you behavior
- Sections that should be reusable across pages
- Pages or sections to save for later

Keep this section concise and implementation-minded.

---

Strategy Digest:

[paste strategy-digest.md here]

---

Website Strategy Brief:

[paste Website Strategy Brief here]`,
  },
  {
    id: "final-page-copy",
    title:
      "Strategy Digest + Selected Page Context + Template Contract to Page Copy",
    description:
      "Writes paste-ready field-level copy for one selected page template at a time.",
    inputs: [
      "Strategy digest",
      "Website Strategy Brief",
      "Selected page context from the Strategy Workspace",
      "Template Copy Contract",
      "Manual editor notes, if any",
    ],
    prompt: String.raw`You are writing template-fitted website copy for one local service business page.

Use the Strategy Digest as the factual boundary.
Use the Website Strategy Brief and selected page context from the Strategy Workspace as strategic direction.
Use the Template Copy Contract as the required page structure and field contract.

If the Website Strategy Brief, selected page context, manual notes, or Template Copy Contract conflict with the Strategy Digest, follow the Strategy Digest and flag the conflict.

Write copy for this page only:

Page to write:

[Homepage / Services / About / Contact / Thank You / Specific service page / Landing page]

Selected template:

[paste selected template name here]

Do not invent unsupported claims, certifications, pricing, guarantees, review counts, emergency availability, financing, warranties, years in business, service areas, credentials, or proof points.

Follow all copy guardrails exactly.

Use a clear, practical local service tone:

- Helpful
- Specific
- Confident
- Not hypey
- Not overly clever
- Not corporate filler
- Not scare-tactic sales copy

Write copy that sounds like a real business a homeowner or local customer could trust.

If important information is missing, use cautious wording, a placeholder, or a note for confirmation instead of inventing the detail.

The page template has already been chosen. Do not redesign the page, recommend alternate sections, add new sections, remove sections, or change the section order.

Write to the fields in the Template Copy Contract. Preserve every section ID and field name exactly.

The output must be structured enough for a bulk importer to read safely. Treat every field name as a real destination field, not as a loose writing suggestion.

The primary output must be paste-ready for the matching page copy field in the Strategy Workspace.

If a field is not appropriate for the available source material, write NEEDS REVIEW and explain the missing detail briefly.

---

# Template-Fitted Page Copy

Return the response in this order:

1. Bulk Paste Copy
2. Copy Notes
3. Copy QA

Only the Bulk Paste Copy section should be pasted into the Strategy Workspace page copy field. Copy Notes and Copy QA are for human review only.

---

# Bulk Paste Copy

Write copy section by section using the Template Copy Contract.

Use this exact structure so it can be pasted directly into the matching Strategy Workspace page copy field:

### [section-id]
fieldName: [copy]
fieldName: [copy]

Core rules:

- Use the exact section IDs from the Template Copy Contract.
- Use the exact field names from the Template Copy Contract.
- Do not include Section name, Semantic role, Template intent, Image/content note, or any other labels inside the Bulk Paste Copy section.
- Do not add bullets before field names.
- Do not wrap the Bulk Paste Copy section in a code fence.
- Every requested copy field from the contract must appear once.
- If a field cannot be safely written from the source material, write NEEDS REVIEW: [missing detail].
- Do not put page titles, meta descriptions, SEO notes, CTA notes, internal rationale, QA notes, or strategy commentary inside rendered copy fields.
- Do not use markdown headings inside field values.
- Do not use comma-separated lists for repeatable content fields.

Field formatting rules:

- Each field must start at the beginning of a new line as fieldName: value.
- Short text fields should stay on one line.
- Longer body fields may use multiple sentences, but keep them under the same field label.
- Repeatable list/card fields must use one item per line under the field label.
- If a repeatable item has a title and description, format it as Title — Description.
- If a repeatable item is only a short proof point, write one proof point per line.
- Do not split one repeatable item across multiple lines.
- Do not use semicolons or commas to separate repeatable items.

Special field rules:

- navLinks must use one link per line in this format: Label -> /url-slug
- footerLinks must use one link group or link per line. Use Label -> /url-slug for direct links when possible.
- legalLine must contain only the legal/copyright line. Never place Copy Notes, SEO notes, or page strategy notes in legalLine.
- primaryAction and secondaryAction should be button labels only, unless the contract specifically asks for a URL too.
- proofPoints, items, serviceItems, supportingItems, testimonials, faqItems, and similar repeatable fields should use the repeatable list/card rules above.

Example:

### 02-hero
eyebrow: Serving Huntersville and the Lake Norman Area
heading: HVAC Repair, Replacement, and Maintenance in the Lake Norman Area
body: North Star HVAC helps local homeowners understand repair, replacement, and maintenance options clearly, without pressure.
primaryAction: Request a Quote

### 03-proof
heading: Local service with clear recommendations
items: 12 years in business
Licensed and insured
Clean, respectful service

### 04-services
heading: Services for Lake Norman homes
serviceItems: HVAC Repair — Get help diagnosing AC, heating, and system issues before choosing the next step.
System Replacement — Compare repair and replacement options with clear recommendations.
Maintenance & Tune-Ups — Keep heating and cooling systems checked before peak-season demand.

Keep copy sized to the field targets in the Template Copy Contract.

---

## Copy Notes

Briefly state what this page needs to accomplish.

Then provide concise notes that should not be pasted into Content Editor:

- Suggested page title
- Suggested meta description
- Suggested H1
- Suggested URL slug
- Primary CTA pattern
- Secondary CTA pattern
- Form or interaction notes, if relevant
- FAQ notes, if relevant
- Reusable copy blocks, if useful

Do not keyword-stuff.

Do not use markdown headings that look like section IDs in this notes area.

Do not repeat full Bulk Paste Copy fields in this notes area.

---

## Copy QA

End with a short QA checklist:

- Unsupported claims avoided?
- Service area accurate?
- Emergency availability handled carefully?
- Pricing language cautious?
- Priority services emphasized?
- Services marked "Non-priority" or "Do not promote" not overpromoted?
- CTA clear?
- Mobile visitor needs considered?
- Template field targets followed?
- Every section ID preserved?

---

Strategy Digest:

[paste strategy-digest.md here]

---

Website Strategy Brief:

[paste Website Strategy Brief here]

---

Page-Specific Plan:

[paste page-specific plan from sitemap/content plan here]

---

Template Copy Contract:

[paste Template Copy Contract here]

---

Manual Editor Notes:

[paste optional manual notes here]`,
  },
];

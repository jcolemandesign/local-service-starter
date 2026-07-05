export type PromptLibraryPrompt = {
  id: string;
  title: string;
  description: string;
  inputs: string[];
  prompt: string;
};

export const promptLibraryWorkflow = [
  "Generate the source packet from the client intake.",
  "Paste the source packet plus any research into Prompt 1.",
  "Paste the Strategy Brief plus source packet into Prompt 2.",
  "Run Prompt 3 once per page using the source packet, Strategy Brief, and Content Plan.",
  "Move approved final copy into the project content files.",
];

export const promptLibraryPrompts: PromptLibraryPrompt[] = [
  {
    id: "strategy-brief",
    title: "Prompt 1 - Source Packet to Website Strategy Brief",
    description:
      "Turns the generated source packet and optional research into the strategy layer.",
    inputs: [
      "Source packet JSON",
      "Optional website, GBP, review, competitor, or asset notes",
    ],
    prompt: String.raw`You are creating a website strategy brief for a local service business.

Use the provided source material:

- Generated source packet from the client intake
- Existing website notes or scraped content, if provided
- Google Business Profile details, if provided
- Reviews/testimonials, if provided
- Competitor references, if provided
- Asset notes, if provided

Treat the generated source packet as the primary factual source of truth.

Use public/existing materials only to:

- Fill gaps
- Match the business's real language
- Identify proof points or service patterns
- Clarify services, locations, tone, and customer concerns

Do not invent unsupported factual claims, certifications, pricing, guarantees, review counts, years in business, emergency availability, financing, warranties, service areas, credentials, or proof points.

Do not write final polished website copy yet.

Your job is to translate the source material into a concise, practical website strategy brief that can guide the sitemap, homepage plan, service content, lead capture flow, and later copywriting.

If the source packet marks something as missing, conflicted, risky, uncertain, "Non-priority," or "Do not promote," handle it carefully and call that out in the appropriate section.

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

Group the services using the same treatment language as the source packet:

### Feature heavily

Services the website should emphasize most.

### Standard Service

Services that matter and should be easy to find, but are not the main sales focus.

### Non-priority

Services that exist but should not dominate the site.

### Do not promote

Services the business does not want to advertise or attract more of.

For each category, briefly explain why based on the source packet.

Do not upgrade a service into a higher-priority category unless the source packet clearly supports it.

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

Include only ideas supported by the source packet or provided source material.

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

Source Packet:

[paste source-packet.json here]

---

Optional Existing/Public Materials:

[paste existing site notes, GBP notes, reviews, competitor notes, or asset notes here if available]`,
  },
  {
    id: "content-plan",
    title: "Prompt 2 - Source Packet + Strategy Brief to Website Content Plan",
    description:
      "Turns the strategy brief into a sitemap, homepage flow, page map, and copy plan.",
    inputs: ["Source packet JSON", "Website Strategy Brief"],
    prompt: String.raw`You are creating a practical website content plan for a local service business.

Use the Website Strategy Brief as the planning guide.

Use the source packet as the factual boundary.

If the Website Strategy Brief conflicts with the source packet, follow the source packet and flag the conflict.

Do not re-invent the strategy. Do not add unsupported claims, certifications, pricing, guarantees, review counts, emergency availability, service areas, financing, warranties, years in business, credentials, or proof points unless they are clearly supported by the source packet.

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

Also recommend optional pages if they make sense based on the brief and source packet:

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

Create practical messaging options based on the brief and source packet.

Include:

### Hero headline options

Write 5 options.

They should be clear, local, specific, and conversion-focused.

Avoid generic hype like:

- "Best service in town"
- "Quality you can trust"
- "Your comfort is our priority"

Unless the source packet strongly supports that kind of phrasing.

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

Use the source packet's service treatment categories as the boundary:

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

Based on the strategy brief and source packet, recommend:

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

Source Packet:

[paste source-packet.json here]

---

Website Strategy Brief:

[paste Website Strategy Brief here]`,
  },
  {
    id: "final-page-copy",
    title:
      "Prompt 3 - Source Packet + Strategy Brief + Content Plan to Final Page Copy",
    description:
      "Writes polished final copy for one selected page at a time.",
    inputs: [
      "Source packet JSON",
      "Website Strategy Brief",
      "Website Content Plan",
      "Selected page to write",
    ],
    prompt: String.raw`You are writing final website copy for a local service business.

Use the Website Strategy Brief and Website Content Plan as the planning guide.

Use the source packet as the factual boundary.

If the Website Strategy Brief or Website Content Plan conflicts with the source packet, follow the source packet and flag the conflict.

Write polished, ready-to-use copy for this page only:

Page to write:

[Homepage / Services / About / Contact / Thank You / Specific service page / Landing page]

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

---

# Final Page Copy

## 1. Page Goal

Briefly state what this page needs to accomplish.

---

## 2. SEO Basics

Create:

- Suggested page title
- Suggested meta description
- Suggested H1
- Suggested URL slug

Do not keyword-stuff.

---

## 3. Section-by-Section Copy

Write the page copy section by section.

For each section, include:

- Section name
- Semantic role
- Eyebrow, if useful
- Headline
- Body copy
- Bullets/cards, if useful
- CTA label, if useful
- Image/content note, if useful

Use the section structure from the Website Content Plan unless there is a clear reason to improve the flow.

For the homepage, use this general order unless the plan says otherwise:

1. Navigation / header copy notes
2. Hero
3. Trust bar / proof strip
4. Main services
5. Priority service or offer section
6. Why choose us
7. Process / how it works
8. Service area
9. FAQ
10. Final CTA
11. Footer notes

For service pages, use this general order:

1. Hero
2. Common problem / customer need
3. What the service includes
4. Signs you may need this service
5. Repair/replacement/process guidance, if relevant
6. Trust/proof section
7. Service area mention
8. FAQ
9. Final CTA

For contact/request quote pages, prioritize clarity, reassurance, low-friction form guidance, urgent call path, and what happens after submission.

For thank-you pages, prioritize confirmation, next steps, urgent path, and expectation setting.

---

## 4. CTA Pattern

List the primary and secondary CTAs used on this page.

Include where they should appear.

---

## 5. Form / Interaction Copy

If this page includes a form, write:

- Form headline
- Form helper text
- Field labels
- Placeholder text, if useful
- Submit button label
- Success/thank-you message
- Urgent request note

Keep the form low-friction.

---

## 6. FAQ Copy

If this page includes FAQs, write polished FAQ questions and answers.

Keep answers helpful, specific, and cautious. Do not overpromise.

---

## 7. Reusable Copy Blocks

Pull out any copy blocks that could be reused elsewhere, such as:

- Trust bullets
- Service area blurb
- Emergency service note
- Financing note
- Maintenance plan note
- Repair vs. replacement explanation
- Final CTA block

---

## 8. Copy QA

End with a short QA checklist:

- Unsupported claims avoided?
- Service area accurate?
- Emergency availability handled carefully?
- Pricing language cautious?
- Priority services emphasized?
- Services marked "Non-priority" or "Do not promote" not overpromoted?
- CTA clear?
- Mobile visitor needs considered?

---

Source Packet:

[paste source-packet.json here]

---

Website Strategy Brief:

[paste Website Strategy Brief here]

---

Website Content Plan:

[paste Website Content Plan here]`,
  },
];

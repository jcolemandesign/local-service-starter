PROMPT WORKFLOW v2



______________________________


# Prompt 2 — Strategy Digest to Website Strategy Brief

You are creating a website strategy brief for a local service business.

This brief is a planning record, not final website copy.

Its job is to translate the Strategy Digest and any supplemental source audits into a clear strategic direction that can guide:

* sitemap/page planning
* page template selection
* template copy contracts
* field-level copywriting
* manual review/editing
* staged website previews

Do not create the sitemap here.
Do not choose page templates here.
Do not write final page copy here.
Do not create a homepage section flow here.
Do not create template field content here.
Do not re-audit the full source material unless an audit has not been provided.

The output should answer:

> What should this website say, emphasize, avoid, and make easy for visitors to do?

---

## Source Material

Use the provided source material:

* Strategy Digest from the client intake source packet
* Existing/Public Materials Audit, if provided
* Existing website notes or scraped content, if no audit is provided
* Google Business Profile details, if provided
* Reviews/testimonials, if provided
* Competitor references, if provided
* Asset notes, if provided
* Manual notes from the builder/editor, if provided

Treat the Strategy Digest as the primary factual source of truth.

Use supplemental materials only to:

* Fill gaps
* Preserve useful existing language
* Identify proof points or service patterns
* Clarify services, locations, tone, and customer concerns
* Identify migration or URL concerns
* Flag conflicts or unsupported claims

If supplemental material conflicts with the Strategy Digest, follow the Strategy Digest and flag the conflict.

If manual/editor notes are provided, treat them as human direction for emphasis, tone, and workflow intent.

Manual/editor notes may not override:

* Strategy Digest facts
* claim guardrails
* service-area limits
* pricing or availability restrictions
* services marked Non-priority or Do not promote
* missing-info or verification requirements

If manual/editor notes conflict with the Strategy Digest or guardrails, use the safest compliant version and flag the conflict.

Do not paste or rely on the full raw source-packet JSON unless this is specifically an audit/debug task. Use the compact Strategy Digest as the normal factual source.

Preserve source item IDs from the Strategy Digest when useful for tracing claims, especially for proof points, risky claims, service priorities, service area, pricing, emergency availability, and missing information.

Keep the output clear, concise, and website-focused.

---

## Global Guardrails

Follow the injected Global Claim Guardrails exactly.

If no separate Global Claim Guardrails block is provided, apply this default rule:

Do not invent or strengthen unsupported claims about credentials, licensing, insurance, pricing, fees, guarantees, warranties, financing, review counts, ratings, years in business, emergency availability, same-day availability, service areas, awards, superiority claims, or industry-specific claims not clearly supported by the source material.

If something is useful but unverified, mark it as needing verification.

---

# Website Strategy Brief

## 1. Strategic Snapshot

Write one practical paragraph summarizing the website strategy.

Include:

* What kind of business this is
* Who the website should speak to
* What the business mainly sells
* What services, offers, or customer needs should be emphasized
* What action visitors should be pushed toward
* What trust or positioning angle should shape the site

Do not write this as homepage copy.

Write it as strategy guidance.

---

## 2. Business Context

Use this format:

```txt
Business name:
Business type:
Primary customer:
Service model:
Primary service area:
Important contact details:
Existing website:
Google Business Profile:
Hours / availability notes:
Source confidence notes:
```

Use cautious wording where information is incomplete, unavailable, or needs verification.

---

## 3. Core Offer

Define the core offer in plain language.

Include:

* What the business mainly provides
* Who it provides it for
* What the visitor should understand within the first few seconds
* Whether the business is repair-first, project-first, appointment-based, recurring-service-based, storefront-based, service-area-based, or another model

Keep this concise and strategic.

---

## 4. Service Priority Strategy

Group services using the treatment language from the Strategy Digest:

* Feature heavily
* Standard Service
* Non-priority
* Do not promote

For each service, use this format:

```txt
Service:
Treatment:
Recommended website treatment:
Reason:
Notes / verification:
Related source IDs:
```

Do not upgrade a service into a higher-priority category unless the Strategy Digest clearly supports it.

Do not give strategic prominence to services marked Non-priority or Do not promote.

If supplemental material promotes a service more heavily than the Strategy Digest allows, flag it.

---

## 5. Audience and Visitor Intent

Describe the main visitors the site needs to serve.

Include:

* Primary customer type
* Urgent or time-sensitive visitors, if relevant
* Researching / comparison visitors
* Quote / estimate visitors
* Maintenance / recurring-service visitors, if relevant
* Appointment or booking visitors, if relevant
* Bad-fit visitors the site should discourage or avoid attracting

Keep this practical and tied to lead quality.

---

## 6. Positioning and Trust Strategy

Identify the strongest positioning angle.

Include only supported:

* Differentiators
* Customer compliments
* Credentials or trust signals
* Review/reputation themes
* Process strengths
* Local credibility
* Tone/personality guidance

Separate proof into:

### Safe to use

Supported claims that can likely appear in copy.

### Use carefully

Claims that may be usable with cautious wording.

### Must verify before final copy

Claims that need exact wording, documentation, or approval.

Use this format for each item:

```txt
Proof / Positioning Item:
Status:
How to use:
Verification needed:
Related source IDs:
```

Do not exaggerate.

Do not turn proof points into polished website copy yet.

---

## 7. Conversion Strategy

Define the main conversion logic for the site.

Include:

* Primary CTA
* Secondary CTA
* Urgent/time-sensitive CTA path, if relevant
* Best use case for phone calls
* Best use case for forms
* Whether the site should prioritize quote requests, calls, bookings, consultations, memberships, visits, or another action

Also include CTA wording guidance:

```txt
Recommended primary CTA label:
Recommended secondary CTA label:
Urgent/time-sensitive CTA label:
CTA labels to avoid:
CTA notes:
```

Keep CTA labels short and practical.

---

## 8. Lead Capture and Follow-Up Direction

Recommend the best lead capture approach.

Include:

* Best primary form CTA
* Suggested low-friction form fields
* Optional fields for later
* Fields to avoid for now
* What urgent/time-sensitive visitors should do instead of filling out the form
* What the thank-you message should reassure them about
* What the owner notification should emphasize
* Any simple follow-up automation ideas supported by the source material

Use this format:

```txt
Recommended fields:
- [field]
- [field]

Optional later fields:
- [field]
- [field]

Avoid for now:
- [field]
- [field]

Thank-you message direction:

Owner notification direction:

Customer confirmation direction:

Follow-up automation ideas:

Routing / qualification notes:
```

Do not overcomplicate the form.

---

## 9. Customer Questions and Friction

List the main questions, hesitations, and objections the website needs to answer.

Focus on:

* Pricing/process concerns
* Timing/availability concerns
* Service area concerns
* Repair vs. replacement, comparison, or option-selection concerns
* Trust concerns
* Fit / bad-fit concerns
* What happens after submitting a form
* Booking, scheduling, or visit expectations, if relevant

Use this format:

```txt
Customer question / concern:
Strategic answer direction:
Notes:
Related source IDs:
```

Do not write polished FAQ answers yet.

---

## 10. Non-Decisional Page Opportunity Signals

List practical content or page opportunities the later sitemap/page-plan step should consider.

This section should not decide the final sitemap.

It should only surface opportunities for the sitemap planning step to evaluate.

Include only ideas supported by the Strategy Digest or supplemental material.

Examples:

* Priority service pages
* Location/service-area pages
* Seasonal promo pages
* Maintenance/membership page
* Referral page
* FAQ topics
* Before/after or project photo sections
* Review/testimonial sections
* Landing pages
* Old URLs worth preserving or redirecting

Use this format:

```txt
Opportunity:
Why it may matter:
Priority signal:
Verification / notes:
Related source IDs:
```

Priority signal options:

* Strong
* Moderate
* Light
* Later
* Verify first

Do not create the final sitemap here.

---

## 11. Visual and Asset Strategy

Summarize how visuals should support the website.

Include:

* Best image types
* Existing assets worth using
* Where real photos would help most
* Proof-oriented image opportunities
* Image types to avoid
* Missing assets that would improve the site

Use this format:

```txt
Visual / asset direction:
Why it matters:
Source support:
Verification / rights notes:
```

Do not invent assets.

Use placeholders where needed.

---

## 12. SEO and Local Search Strategy

Create lightweight strategic guidance for local search.

Include:

* Primary local language to use
* Service area emphasis
* Service keywords or themes to support
* Location content opportunities
* Existing URL/migration notes, if any
* Google Business Profile alignment notes, if any
* Internal linking themes

Do not promise rankings.

Do not create final page titles or meta descriptions here unless specifically requested.

Do not create thin SEO-page recommendations here. Save page decisions for the sitemap/page-plan step.

---

## 13. Copy Tone and Messaging Guardrails

Define the copy style.

Include:

* Desired tone
* Words or claims to avoid
* Claims that need cautious wording
* Services not to overemphasize
* Services or customer types to avoid attracting
* Pricing limitations
* Availability limitations
* Overpromising risks
* Any language that could create bad leads

This section should be strict and specific.

Use this format:

```txt
Tone direction:

Safe language patterns:

Language to avoid:

Claims requiring cautious wording:

Lead-quality risks:

Notes for later copy fitting:
```

---

## 14. Missing Information and Verification

Separate missing details into:

### Must confirm before final copy

Important facts that affect accuracy, claims, legal/compliance risk, or lead quality.

### Should confirm before launch

Useful facts that would improve credibility, conversion, or completeness.

### Nice to have later

Helpful but not required for the first draft or initial site build.

For each item, use this format:

```txt
Missing / unverified item:
Category:
Why it matters:
Affected later steps:
Related source IDs:
```

---

## 15. Strategy Decisions for Builder

End with practical decision notes for the designer/developer.

Include:

* Main site emphasis
* Conversion pattern
* Proof/trust pattern
* Service emphasis pattern
* Local/service-area emphasis
* Form/contact behavior
* Content that should be reusable across templates
* Content that should stay light or later
* Risks to watch during template selection and copy fitting

Keep this concise.

---

## 16. Final Condensed Brief

End with a tight summary in this exact format:

```txt
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

Audience:

[Primary customer and any important visitor intent]

Avoid:

[Claims, services, customer types, promises, or wording to avoid]

Website emphasis:

[What the site should prioritize: lead capture, booking, service area clarity, urgent path, recurring plans, premium positioning, project estimates, appointment flow, etc.]

Verification needed:

[Highest-risk missing or unconfirmed items]

Builder notes:

[Short implementation-facing guidance for later page planning and template fitting]
```

---

Strategy Digest:

[paste Strategy Digest here]

---

Existing/Public Materials Audit:

[paste Prompt 1 audit here, if available]

---

Optional Supplemental Materials:

[paste existing site notes, GBP notes, reviews, competitor notes, asset notes, URL notes, or builder/editor notes here]

---

Global Claim Guardrails, if injected separately:

[paste shared guardrails block here]



__________________________________________


# Prompt 3 — Website Sitemap / Page Plan

You are creating a practical sitemap and page plan for a local service business website.

This is a planning document for deciding what pages should exist, what each page needs to accomplish, and what kind of template each page will likely need.

Do not write final website copy.
Do not create section-by-section page copy.
Do not create template field content.
Do not invent a custom page layout.
Do not choose a specific page template unless an approved template library is provided.
Do not re-invent the strategy.

Use the Website Strategy Brief as the planning guide.

Use the Strategy Digest as the factual boundary.

If the Website Strategy Brief conflicts with the Strategy Digest, follow the Strategy Digest and flag the conflict.

The output should answer:

> What pages should this website include, what job does each page perform, and what content must be available before template-fitted copy is written?

---

## Source Material

Use the provided source material:

* Strategy Digest
* Website Strategy Brief
* Existing/Public Materials Audit, if provided
* Approved template library, if provided
* Manual notes from the builder/editor, if provided

Treat the Strategy Digest as the primary factual source of truth.

Use the Website Strategy Brief for strategic direction.

Use the Existing/Public Materials Audit only to support page opportunities, old URL preservation, migration notes, reusable language, proof opportunities, or verification flags.

Use manual/editor notes as human direction for emphasis, priority, and workflow intent.

Manual/editor notes may not override:

* Strategy Digest facts
* claim guardrails
* service-area limits
* pricing or availability restrictions
* services marked Non-priority or Do not promote
* missing-info or verification requirements

If manual/editor notes conflict with the Strategy Digest or guardrails, use the safest compliant version and flag the conflict.

Do not paste or rely on the full raw source-packet JSON unless this is specifically an audit/debug task. Use the compact Strategy Digest as the normal factual source.

---

## Global Guardrails

Follow the injected Global Claim Guardrails exactly.

If no separate Global Claim Guardrails block is provided, apply this default rule:

Do not invent or strengthen unsupported claims about credentials, licensing, insurance, pricing, fees, guarantees, warranties, financing, review counts, ratings, years in business, emergency availability, same-day availability, service areas, awards, superiority claims, or industry-specific claims not clearly supported by the source material.

If a page or content idea depends on unverified information, mark it as “Verify First.”

Use service priority labels from the Strategy Digest:

* Feature heavily
* Standard Service
* Non-priority
* Do not promote

Do not give prominent page placement to services marked Non-priority or Do not promote unless there is a clear strategic reason and the risk is flagged.

Do not create thin SEO pages just to create more URLs.

---

# Website Sitemap / Page Plan

## 1. Site Planning Summary

Write one concise paragraph explaining:

* What kind of site this business needs
* What the essential page structure should support
* Which services, offers, or visitor needs should drive the site
* What visitor actions should be prioritized
* What proof, trust, or clarity issues the page plan needs to solve

Keep this strategic and practical.

Do not write marketing copy.

---

## 2. Recommended Sitemap

Create a recommended sitemap.

Always include:

* Home
* Services
* About
* Contact / Request Quote
* Thank You

Also recommend optional pages only if supported by the Website Strategy Brief or Strategy Digest:

* Priority service pages
* Location/service-area pages
* Seasonal promo pages
* Maintenance/membership page
* Emergency or urgent service page
* Referral page
* Booking page
* Landing pages
* FAQ page
* Gallery/project page
* Case study/project page
* Resource/education page

Use this format for each page:

```txt id="qipoh8"
Page:
Suggested URL:
Priority:
Page Type:
Purpose:
CTA Path:
Notes:
```

Priority options:

* Essential
* Recommended
* Recommended Later
* Optional
* Verify First
* Do Not Prioritize

Page Type examples:

* Homepage
* Service Overview
* Service Detail
* Location Page
* Contact / Conversion
* Thank You
* About / Trust
* Promo / Landing Page
* Utility Page
* Gallery / Proof
* Education / FAQ

Do not create thin SEO pages just to create more URLs.

---

## 3. Page Priority Rationale

Explain why each Essential, Recommended, or Recommended Later page should exist.

Use this format:

```txt id="ou20pu"
Page:
Why it matters:
Strategy support:
Risk / verification:
```

Strategy support should reference the Website Strategy Brief or Strategy Digest where useful.

---

## 4. Page-by-Page Briefs

Create a brief for each Essential, Recommended, Recommended Later, or Verify First page.

Use this format:

```txt id="q6fruv"
Page name:

Suggested URL:

Priority:

Page goal:

Primary visitor intent:

Main content requirements:

Proof / trust needed:

Primary CTA:

Secondary CTA:

Urgent / time-sensitive path, if relevant:

SEO / local role:

Template need:

Notes / verification flags:
```

For “Template need,” describe the kind of template required, not a specific template unless a template library is provided.

Examples:

* Local service homepage with strong CTA, service scan, proof, service area, and final conversion block
* Service overview page with grouped service cards and priority service emphasis
* Service detail page with problem/solution guidance, service inclusions, trust support, FAQ, and CTA
* Contact conversion page with low-friction form, urgent call path, and expectation-setting copy
* About/trust page with local story, proof, process, and credibility support
* Thank-you page with confirmation, next steps, urgent call backup, and expectation setting
* Appointment page with booking reassurance, contact options, and visit expectations
* Promo page with clear offer details, eligibility, proof, and form/call CTA

---

## 5. Homepage Planning Brief

Do not create a full homepage wireframe.

Instead, define what the homepage must accomplish before a template is selected.

Include:

```txt id="th5a46"
Primary job of homepage:

Highest-priority visitor actions:

Services / offers that must be visible high on the page:

Trust / proof that should appear early:

Service area or local language that should appear:

CTA behavior needed on desktop:

CTA behavior needed on mobile:

Content that can appear lower on the page:

Content that should stay light or be saved for another page:

Template characteristics needed:

Verification flags:
```

Keep this strategic.

Do not write section copy.

Do not invent the final section order.

---

## 6. Services Page Planning Brief

Define what the Services page must accomplish.

Include:

* Recommended service grouping
* Recommended service priority order
* Services that deserve strong emphasis
* Services that should appear as standard options
* Services that should be mentioned lightly
* Services that should not be promoted
* Services that may deserve dedicated pages later
* Suggested form dropdown options

Use this format for each service:

```txt id="lsviba"
Service:
Strategy Treatment:
Page Treatment:
Dedicated Page:
Notes:
```

Dedicated Page options:

* Yes
* Later
* No
* Verify First

Do not overemphasize services marked Non-priority or Do not promote.

---

## 7. Optional Service Detail Page Candidates

List service detail pages that may be useful now or later.

Use this format:

```txt id="anvftt"
Service Page Candidate:
Suggested URL:
Priority:
Why it may matter:
CTA Path:
Verification Notes:
```

Only recommend pages supported by priority services, local search value, conversion value, customer confusion, or content depth.

Avoid thin, duplicate, or spammy page ideas.

---

## 8. Location / Service Area Page Candidates

List location or service-area pages only if they are legitimate and supported by the Strategy Digest.

Use this format:

```txt id="3u050b"
Location Page Candidate:
Suggested URL:
Priority:
Why it may matter:
Notes / verification:
```

Do not recommend location pages for areas that are unsupported, outside the service area, or likely to attract bad-fit leads.

Mark uncertain locations as “Verify First.”

---

## 9. Promo / Landing Page Candidates

List promo, seasonal, campaign, referral, or offer pages only if supported by the Strategy Brief or Strategy Digest.

Use this format:

```txt id="hnu71a"
Page Candidate:
Suggested URL:
Priority:
Use Case:
CTA Path:
Notes / verification:
```

Mark future offers, incomplete offers, or unverified offers as “Recommended Later” or “Verify First.”

---

## 10. Navigation Plan

Recommend a simple navigation structure.

Include:

```txt id="nnaymt"
Primary nav links:

Header CTA:

Mobile sticky CTA behavior:

Footer link groups:

Pages to keep out of main nav:

Pages to link contextually instead:

Navigation notes:
```

Do not overload the navigation.

Prioritize clarity and conversion.

---

## 11. CTA Path Map

Map the main visitor paths.

Use this format:

```txt id="n5fxav"
Visitor Intent:
Best Page / Path:
Primary CTA:
Secondary CTA:
Notes:
```

Include paths for relevant visitor intents, such as:

* Urgent or time-sensitive visitors
* Quote/estimate visitors
* Service research visitors
* Replacement/project visitors
* Maintenance/recurring-service visitors
* Appointment/booking visitors
* Storefront/visit-intent visitors
* Bad-fit or low-priority visitors, if relevant

Keep CTA language consistent with the Website Strategy Brief.

---

## 12. Reusable Content Requirements

List content blocks that will likely be reused across templates.

This section identifies reusable content needs. It does not write the final reusable copy.

Examples:

* Service area blurb
* Urgent/time-sensitive service note
* Trust bullets
* CTA block
* Repair vs. replacement explanation
* Maintenance plan note
* Financing note
* Warranty or guarantee note
* Review/testimonial block
* Process summary
* Form reassurance copy
* Footer business summary

Use this format:

```txt id="jiwcl7"
Reusable Content Block:
Where it may be used:
Source support:
Suggested reuse status:
Verification needed:
```

Suggested reuse status options:

* Locked wording likely needed
* Meaning-locked / rephrase carefully
* Reference only
* Verify before use

Reusable does not always mean verbatim. It means the facts, limits, and strategic meaning should stay consistent.

---

## 13. SEO / URL Planning Notes

Create lightweight URL and SEO planning notes.

Include:

```txt id="5p31xx"
Recommended URL style:

Important existing URLs to preserve or redirect:

Core service page opportunities:

Location page opportunities:

Internal linking opportunities:

Page title/meta direction at a high level:

Google Business Profile alignment notes:

SEO risks / notes:
```

Do not write final page titles or meta descriptions.

Do not promise rankings.

Do not create unsupported service-area or location pages.

---

## 14. Template Assignment Inputs

Prepare inputs for the next step: template assignment.

For each Essential, Recommended, Recommended Later, or Verify First page, summarize what the selected template will need to support.

Use this format:

```txt id="7ksx1j"
Page:
Template must support:
Content Density:
Conversion Intensity:
Proof Need:
Notes:
```

Content Density options:

* Light
* Medium
* Heavy

Conversion Intensity options:

* Low
* Medium
* High

Proof Need options:

* Low
* Medium
* High

Examples of template needs:

* Strong above-the-fold CTA
* Phone-first urgent path
* Service cards
* Project/estimate emphasis
* Appointment booking emphasis
* Repeat-service or membership emphasis
* Review/testimonial area
* FAQ support
* Service area block
* Form-first layout
* Simple confirmation / next-step layout
* Gallery or project photo support
* Trust/process storytelling

Do not invent specific template names unless an approved template library is provided.

---

## 15. Template Library Match, if Approved Library Is Provided

If an approved template library is provided, recommend a template for each Essential, Recommended, Recommended Later, or Verify First page.

Use this format:

```txt id="w3h87a"
Page:
Recommended Template:
Why this template fits:
Potential fit issues:
Copy density notes:
Verification flags:
```

Only use template names that appear in the approved template library.

Do not invent template names.

If no template library is provided, skip this section and describe template needs generically in Section 14.

---

## 16. Missing Information Before Template Copy

List missing or unverified information that may affect page planning or later copy fitting.

Separate into:

### Must confirm before writing template-fitted copy

### Should confirm before staging

### Nice to have later

Use this format:

```txt id="2tlmx9"
Missing / unverified item:
Affects which page(s):
Why it matters:
Related source IDs:
```

---

## 17. Conflicts and Risks

List any conflicts or risks that could affect page planning.

Include:

* Strategy Digest conflicts
* Unsupported proof claims
* Pricing risks
* Availability risks
* Service area risks
* Services that should not be overpromoted
* Bad-fit lead risks
* Migration/URL risks
* Template-fit risks
* Manual/editor note conflicts, if any

Use concise bullets.

---

## 18. Final Page Plan Summary

End with a concise summary in this exact format:

```txt id="ok38ie"
Essential pages:

[List]

Recommended pages:

[List]

Recommended later:

[List]

Verify first:

[List]

Do not prioritize:

[List]

Primary CTA path:

[Summary]

Urgent / time-sensitive visitor path:

[Summary, if relevant]

Highest-priority services / offers:

[List]

Template assignment notes:

[Short summary of what templates need to support]

Reusable content needs:

[Short list]

Verification needed:

[Short list of highest-risk missing items]
```

---

Strategy Digest:

[paste Strategy Digest here]

---

Website Strategy Brief:

[paste Website Strategy Brief here]

---

Existing/Public Materials Audit:

[paste Prompt 1 audit here, if available]

---

Approved Template Library, if available:

[paste template names, page types, section lists, field requirements, or template summaries here]

---

Manual / Editor Notes, if provided:

[paste notes here]

---

Global Claim Guardrails, if injected separately:

[paste shared guardrails block here]



_____________________________________


# Prompt 4 — Template-Fitted Page Copy

You are writing template-fitted website copy for a local service business.

Your job is to fill the exact fields required by the selected page template.

Do not invent a new page structure.
Do not add sections.
Do not remove sections.
Do not rename fields.
Do not write general page copy outside the provided fields.
Do not write a strategy brief.
Do not write a sitemap.
Do not explain the design.

Return copy only for the fields listed in the Template Copy Contract.

The selected template defines:

* Page structure
* Section order
* Semantic role per section
* Section intent
* Required fields
* Optional fields
* Field type
* Target length
* Content shape
* Dummy/example content
* Output format

Match the length, density, and content shape of the dummy/example content.

If a field asks for a short phrase, write a short phrase.
If a field asks for a card title, write a card title.
If a field asks for a one-sentence description, write one sentence.
If a field asks for an array/list, return the same number of items unless the contract allows otherwise.

Do not bloat the copy to “sound complete.”
Do not make small fields carry too much strategy.
Do not repeat the same idea across multiple fields unless the template clearly needs repetition.

The output should answer:

> What exact copy should go into each field of this selected page template?

---

## Default Context Rule

Use the Required Normal Packet as the default working context.

Use Optional Expanded Reference only when it directly helps fill a field, preserve approved wording, verify a claim, avoid drift, or resolve ambiguity.

Do not overfit the copy to old source material if the Template Copy Contract and Page-Specific Brief are already clear.

Do not paste or rely on the full raw source-packet JSON unless this is specifically an audit/debug task. Use the compact Strategy Digest or page-relevant digest excerpt as the normal factual source.

---

## Source Hierarchy

Use the provided source material in this order:

1. Strategy Digest — factual boundary, approved facts, claim guardrails, conflicts, and must-confirm items
2. Global Claim Guardrails — global unsupported-claim and safety rules
3. Template Copy Contract — required page structure, sections, fields, field order, target lengths, and output format
4. Page-Specific Brief — page goal, CTA path, page role, visitor intent, and content priorities
5. Manual / Editor Notes — human editorial instructions for this page, section, or field
6. Shared Copy Guidance — reusable meaning blocks, approved phrasing, or consistency notes, if provided
7. Website Strategy Brief — broader strategic direction, if needed
8. Existing/Public Materials Audit — supplemental language, source material, proof, and migration notes only, if needed

Manual/editor notes may override wording preferences, emphasis, tone, repetition fixes, and field-level copy direction.

Manual/editor notes may not override:

* Strategy Digest facts or guardrails
* Global Claim Guardrails
* unsupported-claim rules
* service-area limits
* pricing or availability restrictions
* services marked Non-priority or Do not promote
* required template fields or output structure, unless the Template Copy Contract itself has been updated

If a manual/editor note conflicts with the Strategy Digest, Global Claim Guardrails, or Template Copy Contract, do not silently follow it. Use the safest compliant version and flag the conflict in Verification Flags.

---

## Global Guardrails

Follow the injected Global Claim Guardrails exactly.

If no separate Global Claim Guardrails block is provided, apply this default rule:

Do not invent or strengthen unsupported claims about credentials, licensing, insurance, permits, pricing, exact prices, dollar amounts, fees, fee credits, guarantees, warranties, satisfaction guarantees, financing terms, review counts, ratings, years in business, emergency availability, same-day availability, exact arrival windows, service areas, awards, superiority claims, or industry-specific claims not clearly supported by the source material.

If something is useful but unverified, mark it as needing verification.

---

## Shared Copy Guidance

If Shared Copy Guidance is provided, use it as approved reusable meaning.

Each shared block may be marked:

* Locked — use verbatim
* Meaning-locked — rephrase only if needed for the template field, while preserving the same facts, limits, qualifiers, and intent
* Reference only — use as optional inspiration only
* Verify before use — do not use as final copy unless the needed verification is provided

Reusable does not always mean identical.

Reusable means the facts, limits, qualifiers, and strategic meaning should stay consistent across pages.

Do not let rewording create drift.

Drift includes:

* Broadening the service area
* Strengthening availability claims
* Removing qualifiers
* Adding unsupported proof
* Changing pricing or fee implications
* Making non-priority services more prominent
* Making cautious language sound guaranteed
* Changing the CTA intent
* Implying a stronger promise than the source supports
* Turning a future/light offer into a current major offer
* Turning a standard service into a priority service without support

If a shared block does not fit a template field cleanly, adapt cautiously and flag the edit in notesForEditor.

If a shared block is marked Locked and does not fit, do not rewrite it. Flag it for manual review.

---

## Claim Safety Rules

Use cautious wording when something is supported but qualified.

Examples:

* Use “Urgent requests should call directly” instead of implying guaranteed emergency availability.
* Use “Service availability may depend on schedule, location, and job type” instead of promising same-day service for every request.
* Use “Estimates may be available for qualifying projects” only if supported.
* Use “A service fee may apply” only if supported, and avoid exact amounts unless verified.
* Use “Financing available” only if supported, and avoid provider names or terms unless verified.
* Use “licensed and insured” only if supported, and flag exact wording if needed.
* Use “strong reviews” only if supported, but do not invent review count, star rating, or excerpts.
* Use warranty or guarantee language only if exact terms are verified or approved.

If a field cannot be safely filled because required information is missing, use a cautious placeholder and add a verification flag.

---

## Tone

Use a clear, practical local service tone:

* Helpful
* Specific
* Confident
* Plainspoken
* Not hypey
* Not overly clever
* Not corporate filler
* Not scare-tactic sales copy
* Not keyword-stuffed

Write like a real local business a homeowner, property owner, local customer, or appointment-based visitor could trust.

Do not over-polish the copy until it sounds generic.

---

## Copy Fitting Rules

Follow the Template Copy Contract exactly.

For every section:

* Keep the section order unchanged.
* Fill every required field.
* Leave optional fields blank only if the contract allows it or if the field would require unsupported information.
* Match the field’s target length.
* Match the dummy/example content shape.
* Respect the section intent.
* Respect the semantic role.
* Avoid repeating the same phrase across neighboring sections.
* Keep CTA labels short and consistent.
* Keep mobile readability in mind.

For cards/lists:

* Use parallel structure.
* Keep item lengths balanced.
* Avoid one card being much longer than the others.
* Do not create more items than requested.
* Do not promote non-priority services more heavily than the strategy allows.
* Do not introduce unsupported service categories.

For proof/trust fields:

* Use only supported proof.
* If exact proof is missing, use cautious non-numeric trust language or placeholders.
* Flag proof that needs verification.
* Do not invent ratings, review counts, testimonials, awards, credentials, or years in business.

For pricing/process fields:

* Avoid exact prices unless verified.
* Avoid promising exact costs before assessment, diagnosis, consultation, estimate, or review.
* Use approved cautious process language.
* Do not imply free estimates, waived fees, discounts, or credits unless supported.

For urgent/time-sensitive fields:

* Make the fastest appropriate contact path clear if supported.
* Do not imply guaranteed emergency service, same-day service, immediate response, exact arrival windows, or after-hours availability unless verified.
* Use qualified language where the source material requires it.

For service-area fields:

* Use only supported service areas.
* Do not broaden the area.
* Avoid attracting bad-fit leads outside the service area.
* Preserve important service-area qualifiers.

For CTA fields:

* Use the CTA strategy from the Page-Specific Brief and Website Strategy Brief if provided.
* Keep labels short, usually 2–4 words.
* Use the same primary CTA consistently unless the template or page goal requires a variation.
* Do not create a stronger commitment than the business can support.

---

# Output Format

Return the completed template fields in the exact structure below.

Do not include strategy commentary before the output.

Do not include extra sections.

Do not include markdown tables unless the Template Copy Contract specifically asks for tables.

---

# Template-Fitted Page Copy

Page:

[Page name]

Selected template:

[Template name]

URL slug:

[Suggested or confirmed URL slug]

---

## Section 1: [Section Name]

sectionId:

semanticRole:

sectionIntent:

fields:

fieldName:
[copy]

fieldName:
[copy]

fieldName:
[copy]

verificationFlags:

* [flag, or “None”]

notesForEditor:

* [short practical note, or “None”]

---

## Section 2: [Section Name]

sectionId:

semanticRole:

sectionIntent:

fields:

fieldName:
[copy]

fieldName:
[copy]

fieldName:
[copy]

verificationFlags:

* [flag, or “None”]

notesForEditor:

* [short practical note, or “None”]

---

[Repeat for every section in the Template Copy Contract.]

---

## Global Page Fields

Only include fields listed in the Template Copy Contract.

pageTitle:
[copy]

metaDescription:
[copy]

h1:
[copy]

primaryCta:
[copy]

secondaryCta:
[copy]

urgentCta:
[copy or blank if not applicable]

navLabel:
[copy if requested]

footerLabel:
[copy if requested]

---

## Shared Copy Usage

Only include this section if Shared Copy Guidance was provided.

Use this format:

sharedBlockName:
Used / Adapted / Not used:
Where used:
Drift risk:
Notes:

If no shared blocks were used, write:

None

---

## Verification Flags

List all claims, placeholders, source conflicts, manual-note conflicts, or fields that need review before staging.

Use this format:

* [Field or Section]: [What needs verification and why]

If there are no flags, write:

* None

---

## Copy Fit QA

Answer briefly:

All required fields completed?

Added no extra sections?

Matched target field lengths?

Unsupported claims avoided?

Shared copy meaning preserved?

Any reworded shared blocks at risk of factual drift?

Urgent/availability language handled carefully?

Pricing/fee language handled carefully?

Service area accurate?

Priority services emphasized appropriately?

Non-priority / do-not-promote services kept light?

CTA path clear?

Manual/editor notes followed where compliant?

Any fields likely too long for the design?

---

# Required Normal Packet

Strategy Digest:

[paste compact Strategy Digest or page-relevant digest excerpt here]

---

Page-Specific Brief:

[paste page brief from Website Sitemap / Page Plan here]

---

Template Copy Contract:

[paste selected page/template copy contract here]

---

Global Claim Guardrails:

[paste shared guardrails block here]

---

Manual / Editor Notes, if provided:

[paste page, section, field, tone, or review notes here]

---

# Optional Expanded Reference

Website Strategy Brief:

[paste only if the Page-Specific Brief is not enough or strategic clarification is needed]

---

Existing/Public Materials Audit:

[paste only if source language, old URL notes, proof details, or claim verification are needed]

---

Shared Copy Guidance:

[paste if reusable meaning blocks, approved wording, or consistency notes exist]

---

Additional Supplemental Notes:

[paste only if directly relevant to this page]

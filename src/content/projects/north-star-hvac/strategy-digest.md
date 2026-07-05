# Strategy Digest: north-star-hvac

Compiled from source-packet.json. Use this digest as the normal prompt context; use the full source packet only for audit/debug.

## Prompt Use Rules
- Treat explicit source facts as usable context, but avoid unsupported claims.
- Items marked Must Confirm or Conflict need verification before final copy.
- Preserve source item IDs in strategy notes when a claim may need an evidence trail.

## Digest Metadata
- Digest generator version: 2
- Client slug: north-star-hvac
- Source intake ID: aa932f25-6a14-48da-a618-b14951d8b303
- Source packet: src/content/projects/north-star-hvac/source-packet.json
- Source items: 157
- Verified quotes: 46
- Missing info: 9
- Conflicts: 2

## Business Basics
- North Star HVAC [bus_ide_002; business_name]
- home-services [bus_ide_003; business_type]
- https://northstarhvac.com [bus_ide_004; website]
- 704-555-0184 [bus_ide_007; contact_phone]
- Not available yet [bus_ide_017; payload.businessBasics.googleBusinessProfile]
- Huntersville, NC — service-area business serving customers at their homes and businesses across the Lake Norman area. [bus_ide_018; payload.businessBasics.businessAddress]
- Monday–Friday, 8am–6pm. Limited emergency service available after hours depending on availability. [bus_ide_019; payload.businessBasics.businessHours]

## Services And Service Area
- System replacement, heat pump service, seasonal tune-ups, and maintenance plans should be prioritized. We still want repair calls, but replacement and ongoing maintenance are the biggest priorities. [ser_off_001; priority_services]
- Huntersville, Cornelius, Davidson, Mooresville, North Charlotte, Denver, and the Lake Norman area. Huntersville, Cornelius, Davidson, and Mooresville. [ser_are_001; service_area]
- Installation [ser_off_002; main_services]
- Replacement [ser_off_003; main_services]
- Maintenance [ser_off_004; main_services]
- Emergency service [ser_off_005; main_services]
- Inspection / diagnosis [ser_off_006; main_services]
- Tune-up / seasonal service [ser_off_007; main_services]
- Financing available [ser_off_008; main_services]
- Repair [ser_off_009; main_services]
- Heat pump service [ser_off_010; main_services]
- indoor air quality [ser_off_011; main_services]
- smart thermostat installation [ser_off_012; main_services]
- ductless mini-split service. [ser_off_013; main_services]
- ductless mini-split service.: Non-priority [ser_off_022; payload.serviceStrategy.service_treatment]
- Emergency service: Standard Service [ser_off_023; payload.serviceStrategy.service_treatment]
- Financing available: Standard Service [ser_off_024; payload.serviceStrategy.service_treatment]
- Heat pump service: Feature heavily [ser_off_025; payload.serviceStrategy.service_treatment]
- indoor air quality: Standard Service [ser_off_026; payload.serviceStrategy.service_treatment]
- Inspection / diagnosis: Standard Service [ser_off_027; payload.serviceStrategy.service_treatment]
- Installation: Standard Service [ser_off_028; payload.serviceStrategy.service_treatment]
- Maintenance: Feature heavily [ser_off_029; payload.serviceStrategy.service_treatment]
- Repair: Feature heavily [ser_off_030; payload.serviceStrategy.service_treatment]
- Replacement: Feature heavily [ser_off_031; payload.serviceStrategy.service_treatment]
- smart thermostat installation: Standard Service [ser_off_032; payload.serviceStrategy.service_treatment]
- Tune-up / seasonal service: Feature heavily [ser_off_033; payload.serviceStrategy.service_treatment]
- Heat pump service, indoor air quality, smart thermostat installation, ductless mini-split service. [ser_off_034; payload.services.otherMainServices]
- System replacement, heat pump service, seasonal tune-ups, and maintenance plans should be prioritized. [ser_off_035; payload.services.priorityServices]
- We still want repair calls, but replacement and ongoing maintenance are the biggest priorities. [ser_off_036; payload.services.priorityServices] Related: ser_off_035, ser_off_036
- Huntersville, Cornelius, Davidson, Mooresville, North Charlotte, Denver, and the Lake Norman area. [ser_are_002; payload.serviceArea.townsCities]
- Huntersville, Cornelius, Davidson, and Mooresville. [ser_are_003; payload.serviceArea.priorityAreas]
- About 25–30 miles from Huntersville for regular service. [ser_are_004; payload.serviceArea.serviceRadius]
- Emergency calls may depend on availability and distance. [ser_are_005; payload.serviceArea.serviceRadius] Related: ser_are_004, ser_are_005
- A standard diagnostic fee applies for repair visits. [ser_are_006; payload.serviceArea.locationLimits]
- The fee may be credited toward the repair or replacement if the customer moves forward with recommended work. [ser_are_007; payload.serviceArea.locationLimits] Related: ser_are_006, ser_are_007

## Conversion, Pricing, And Availability
- Request a quote [lea_flo_cta_001; payload.leadFlow.primaryAction]
- Same day [lea_flo_cta_002; payload.leadFlow.responseTime]
- Limited / depends on availability [eme_ava_001; payload.serviceStrategy.emergency_service_availability]
- Call now [lea_flo_cta_004; preferred_cta]
- They call and we answer live [lea_flo_cta_005; payload.leadFlow.currentProcess]
- They call and leave a voicemail [lea_flo_cta_006; payload.leadFlow.currentProcess]
- They fill out a form [lea_flo_cta_007; payload.leadFlow.currentProcess]
- They message us through Google / social media [lea_flo_cta_008; payload.leadFlow.currentProcess]
- It depends [lea_flo_cta_009; payload.leadFlow.currentProcess]
- We call them back [lea_flo_cta_010; payload.leadFlow.afterFormSubmit]
- We text them [lea_flo_cta_011; payload.leadFlow.afterFormSubmit]
- We schedule an appointment [lea_flo_cta_012; payload.leadFlow.afterFormSubmit]
- We qualify the lead first [lea_flo_cta_013; payload.leadFlow.afterFormSubmit]
- Free estimates [pri_pro_001; payload.pricingProcess.pricing_process_signals]
- Diagnostic fee applies [pri_pro_002; payload.pricingProcess.pricing_process_signals]
- Diagnostic fee may be credited toward approved work [pri_pro_003; payload.pricingProcess.pricing_process_signals]
- Upfront pricing after diagnosis [pri_pro_004; payload.pricingProcess.pricing_process_signals]
- Financing available [pri_pro_005; payload.pricingProcess.pricing_process_signals]
- Do not quote exact prices before diagnosis [pri_pro_006; payload.pricingProcess.pricing_process_signals]
- Do not promise 24/7 availability, guaranteed same-day service, exact arrival times, or emergency coverage for every service area. [eme_ava_002; payload.serviceStrategy.emergency_service_limitations]
- The site can say urgent heating and cooling issues should call directly, and emergency service may be available depending on schedule, distance, and technician availability. [eme_ava_003; payload.serviceStrategy.emergency_service_limitations] Related: eme_ava_002, eme_ava_003
- We can mention free estimates for replacement projects and maintenance plan discussions. [pri_pro_007; payload.pricingProcess.pricing_language_notes]
- Repair visits usually require a diagnostic fee. [pri_pro_008; payload.pricingProcess.pricing_language_notes] Related: pri_pro_007, pri_pro_008, pri_pro_009, pri_pro_010, pri_pro_011
- Avoid listing exact repair prices online before diagnosis. [pri_pro_009; payload.pricingProcess.pricing_language_notes] Related: pri_pro_007, pri_pro_008, pri_pro_009, pri_pro_010, pri_pro_011
- Avoid saying we are the cheapest. [pri_pro_010; payload.pricingProcess.pricing_language_notes] Related: pri_pro_007, pri_pro_008, pri_pro_009, pri_pro_010, pri_pro_011
- It is okay to say we provide clear options and upfront recommendations after inspecting the system. [pri_pro_011; payload.pricingProcess.pricing_language_notes] Related: pri_pro_007, pri_pro_008, pri_pro_009, pri_pro_010, pri_pro_011

## Proof And Trust Signals
- 12 years [tru_sig_001; payload.trust.yearsInBusiness]
- Licensed / insured [tru_sig_002; payload.trust.signals]
- Locally owned [tru_sig_003; payload.trust.signals]
- Family-owned [tru_sig_004; payload.trust.signals]
- Same-day availability [tru_sig_005; payload.trust.signals]
- Emergency service [tru_sig_006; payload.trust.signals]
- Free estimates [tru_sig_007; payload.trust.signals]
- Upfront pricing [tru_sig_008; payload.trust.signals]
- Financing available [tru_sig_009; payload.trust.signals]
- Warranty or guarantee [tru_sig_010; payload.trust.signals]
- Certified technicians / providers [tru_sig_011; payload.trust.signals]
- Clean, respectful, professional service [tru_sig_012; payload.trust.signals]
- Real project photos available [tru_sig_013; payload.trust.signals]
- Strong Google reviews [tru_sig_014; payload.trust.signals]
- Maintenance plans or memberships [tru_sig_015; payload.trust.signals]
- Satisfaction guarantee [tru_sig_016; payload.trust.signals]
- showing up when we say we will, explaining the issue clearly, keeping the work area clean, and giving honest recommendations without pressuring them into the most expensive option. [tru_sig_017; payload.trust.compliments]
- focus on practical options instead of scare tactics. [tru_sig_018; payload.trust.competitorDifference]
- If a repair makes sense, we explain it. [tru_sig_019; payload.trust.competitorDifference] Related: tru_sig_018, tru_sig_019, tru_sig_020, tru_sig_021
- If replacement is the better long-term move, we walk the customer through why. [tru_sig_020; payload.trust.competitorDifference] Related: tru_sig_018, tru_sig_019, tru_sig_020, tru_sig_021
- We try to make heating and cooling decisions easier to understand. [tru_sig_021; payload.trust.competitorDifference] Related: tru_sig_018, tru_sig_019, tru_sig_020, tru_sig_021

## Copy Guardrails
- Do not say we are the cheapest. [cla_cop_gua_001; payload.trust.claimsToAvoid]
- Do not guarantee same-day service for every request. [cla_cop_gua_002; payload.trust.claimsToAvoid] Related: cla_cop_gua_001, cla_cop_gua_002, cla_cop_gua_003, cla_cop_gua_004
- Do not promise exact pricing before diagnosis. [cla_cop_gua_003; payload.trust.claimsToAvoid] Related: cla_cop_gua_001, cla_cop_gua_002, cla_cop_gua_003, cla_cop_gua_004
- Do not imply every old system needs to be replaced. [cla_cop_gua_004; payload.trust.claimsToAvoid] Related: cla_cop_gua_001, cla_cop_gua_002, cla_cop_gua_003, cla_cop_gua_004
- Phone number should be easy to find. [cla_cop_gua_005; payload.finalNotes.homepage_must_include]
- The homepage should clearly show HVAC repair, replacement, maintenance, heat pump service, emergency service, and the Lake Norman service area. [cla_cop_gua_006; payload.finalNotes.homepage_must_include] Related: cla_cop_gua_005, cla_cop_gua_006, cla_cop_gua_007
- Maintenance plans should be mentioned as a future or light priority [cla_cop_gua_007; payload.finalNotes.homepage_must_include] Related: cla_cop_gua_005, cla_cop_gua_006, cla_cop_gua_007
- Separate sections for AC repair, heating repair, heat pump service, system replacement, maintenance, tune-ups, and emergency HVAC service. [cla_cop_gua_008; payload.finalNotes.services_page_must_include]
- Urgent heating or cooling issues should call directly. [cla_cop_gua_009; payload.finalNotes.contact_form_must_include]
- Non-urgent quote requests, maintenance requests, and replacement questions can use the form. [cla_cop_gua_010; payload.finalNotes.contact_form_must_include] Related: cla_cop_gua_009, cla_cop_gua_010, cla_cop_gua_011
- Include a note that we try to respond the same day. [cla_cop_gua_011; payload.finalNotes.contact_form_must_include] Related: cla_cop_gua_009, cla_cop_gua_010, cla_cop_gua_011
- Do not heavily promote duct cleaning or large commercial HVAC. [cla_cop_gua_012; payload.finalNotes.global_avoid_emphasis]
- Do not make emergency service sound guaranteed for every request. [cla_cop_gua_013; payload.finalNotes.global_avoid_emphasis] Related: cla_cop_gua_012, cla_cop_gua_013, cla_cop_gua_014
- Do not lead with “cheap” or “lowest price.” [cla_cop_gua_014; payload.finalNotes.global_avoid_emphasis] Related: cla_cop_gua_012, cla_cop_gua_013, cla_cop_gua_014
- Customers far outside our service area, people only looking for the absolute cheapest option, and emergency requests too far away for us to respond to realistically. [cla_cop_gua_015; payload.finalNotes.bad_fit_customers]

## Customer Questions
- How quickly can you come out if my AC or heat stops working? [cus_que_001; payload.customerQuestions.beforeContact]
- How much does a repair visit usually cost, and does the diagnostic fee go toward the repair? [cus_que_002; payload.customerQuestions.pricingTimingProcess]
- How do I know if I should repair my current system or replace it? [cus_que_003; payload.customerQuestions.competitorComparison]

## Assets And Future Offers
- https://drive.google.com/drive/folders/1Q4cqdsctrsJPDS0IyXCmqTThZnsVz2KY?usp=sharing [ass_001; payload.assets.folderLink]
- Mention lightly [fut_off_001; payload.finalNotes.future_offer_visibility]
- Logo files [ass_002; payload.assets.folderIncludes]
- Team photos [ass_003; payload.assets.folderIncludes]
- Project photos [ass_004; payload.assets.folderIncludes]
- Before / after photos [ass_005; payload.assets.folderIncludes]
- Existing flyers or brochures [ass_006; payload.assets.folderIncludes]
- Testimonials or review screenshots [ass_007; payload.assets.folderIncludes]
- Service list or pricing sheets [ass_008; payload.assets.folderIncludes]
- Current offer or seasonal promotion [ass_009; payload.assets.folderIncludes]
- Brand or truck photos [ass_010; payload.assets.folderIncludes]
- Spring AC Tune-Up Special — includes thermostat check, filter check, airflow review, outdoor unit inspection, and general system performance check. [ass_011; payload.assets.promoOffer]
- We like local HVAC websites that feel clean, trustworthy, and easy to use. [ass_012; payload.assets.competitorReferences]
- Prefer sites with clear service buttons, simple quote forms, real photos, and strong reviews near the top. [ass_013; payload.assets.competitorReferences] Related: ass_012, ass_013, ass_014
- Avoid sites that feel too corporate, too stock-photo heavy, too cluttered, or too aggressive with popups. [ass_014; payload.assets.competitorReferences] Related: ass_012, ass_013, ass_014
- Yes. [fut_off_002; payload.finalNotes.future_offers]
- We may be adding or promoting a maintenance membership plan this year. [fut_off_003; payload.finalNotes.future_offers] Related: fut_off_002, fut_off_003
- We may be adding a maintenance membership plan and want the website to support that later. [fut_off_004; payload.finalNotes.upcomingChanges]

## Must Confirm
- approved emergency/same-day wording [mis_inf_001; derived_missing_info_rule] Note: Confirm exact emergency and same-day language before final copy. Related: eme_ava_001, eme_ava_002, eme_ava_003
- approved pricing language [mis_inf_002; derived_missing_info_rule] Note: Confirm approved pricing, estimate, and diagnostic-fee language before final copy. Related: pri_pro_001, pri_pro_002, pri_pro_003, pri_pro_004, pri_pro_005, pri_pro_006, pri_pro_007, pri_pro_008, pri_pro_009, pri_pro_010, pri_pro_011
- exact diagnostic fee amount [mis_inf_003; derived_missing_info_rule] Note: Diagnostic fee is referenced, but the exact amount is not verified. Related: pri_pro_002
- exact warranty/guarantee language [mis_inf_004; derived_missing_info_rule] Note: A warranty or guarantee is referenced, but exact terms were not provided. Related: tru_sig_010, tru_sig_016
- financing provider/terms [mis_inf_005; derived_missing_info_rule] Note: Financing is referenced, but provider, eligibility, and term language are not verified. Related: pri_pro_005, tru_sig_009, fut_off_002, fut_off_003
- exact certification wording [mis_inf_006; derived_missing_info_rule] Note: Certification or credential language is selected, but exact approved wording is not verified. Related: tru_sig_011
- exact license/insurance wording [mis_inf_007; derived_missing_info_rule] Note: Licensed/insured is selected, but exact license, insurance, or required disclaimer wording is not verified. Related: tru_sig_002
- review count/rating/excerpts [mis_inf_008; derived_missing_info_rule] Note: Reviews are referenced, but exact count, star rating, and approved excerpts are not verified. Related: tru_sig_014, ass_007
- maintenance plan details [mis_inf_009; derived_missing_info_rule] Note: Maintenance plan or membership is referenced; confirm name, inclusions, exclusions, and visibility. Related: tru_sig_015, fut_off_002, fut_off_003

## Conflicts
- Emergency service is selected, but emergency limitations were provided. [con_001; payload.trust.signals + payload.serviceStrategy.emergency_service_limitations] Note: Emergency language needs approval because emergency availability is qualified by distance, schedule, or other limitations. Related: tru_sig_006, eme_ava_001, eme_ava_002, eme_ava_003
- Pricing is referenced, but exact pricing is restricted or prohibited. [con_002; payload.pricingProcess + guardrail fields] Note: Pricing may be referenced only with approved language. Do not invent exact prices or dollar amounts. Related: pri_pro_001, pri_pro_002, pri_pro_003, pri_pro_004, pri_pro_005, pri_pro_006, pri_pro_007, pri_pro_008, pri_pro_009, pri_pro_010, pri_pro_011, cla_cop_gua_001, cla_cop_gua_002, cla_cop_gua_003, cla_cop_gua_004, cla_cop_gua_012, cla_cop_gua_013, cla_cop_gua_014

# PLU Context Reasoning Engine Report V1

Created: 2026-06-25 06:10:29

Grounded statements processed: 627
Unique statements processed: 405
Duplicate statements rejected: 222
Reasoned classified statements: 128
Discovery queue statements: 277
Coverage against raw statements: 20.41%
Coverage against unique statements: 31.6%

## Context Family Counts

- Supplier Qualification: 22
- Legal and Compliance: 21
- Metadata and Structure: 16
- Technical: 16
- Evaluation: 14
- Commercial: 14
- Proposal: 13
- Delivery and Administration: 10
- Exclusion: 2

## Context Type Counts

- Product Requirement: 16
- Pricing Structure: 14
- Socioeconomic Requirement: 10
- Contract Administration: 9
- Attachment: 9
- Evaluation Framework: 8
- Certification: 8
- Subcontracting Requirement: 8
- Submission Instruction: 7
- Registration: 6
- Key Personnel: 5
- Proposal Volume: 4
- Evaluation Navigation: 4
- Table of Contents: 4
- Amendment Acknowledgement: 2
- Exhibit: 2
- Non-Procurement Evaluation: 2
- Authorized Distributor: 2
- FAR Clause: 2
- Factor Importance: 1
- Evaluation Constraint: 1
- Corporate Experience: 1
- Labor Requirement: 1
- Schedule: 1
- Document Marking: 1

## Match Type Counts

- single: 64
- bundle: 64

## Confidence Bands

- high: 61
- medium: 67

## Sample Reasoned Classifications

### RPLUC-000001 — PLU-PROP-003

Opportunity: Selective Service System Website Modernization
Family: Proposal
Type: Submission Instruction
Route: Proposal Intelligence
Matched Patterns: shall submit;offerors.*submit
Reasoning Basis: single_rule
Match Type: single
Candidate Count: 1
Confidence: 0.82

Offerors shall submit five (5) proposal volumes as identified in the solicitation:

### RPLUC-000002 — PLU-PROP-002

Opportunity: Selective Service System Website Modernization
Family: Proposal
Type: Proposal Volume
Route: Proposal Intelligence
Matched Patterns: volume\s+i;technical proposal;price proposal;administrative proposal;contract documentation;offerors should prepare;submit;proposal;volume
Reasoning Basis: Proposal volume bundle
Match Type: bundle
Candidate Count: 2
Confidence: 0.94

• Volume I – Administrative Proposal • Volume II – Technical Proposal • Volume III – Past Performance • Volume IV – Price Proposal • Volume V – Contract Documentation Offerors should prepare and submit all five volumes in accordance with the proposal instructions and content requirements provided in the solicitation.

### RPLUC-000003 — PLU-EVAL-002

Opportunity: Selective Service System Website Modernization
Family: Evaluation
Type: Evaluation Navigation
Route: Document Navigation
Matched Patterns: 52\.212-2;evaluation factors;factor
Reasoning Basis: Evaluation navigation bundle
Match Type: bundle
Candidate Count: 2
Confidence: 0.94

Q1.2) Evaluation Factors -Table 1 identifies Volume V as “Factor 5 – Contract Documentation,” but Section 52.212-2 lists only four evaluation factors.

### RPLUC-000004 — PLU-PROP-002

Opportunity: Selective Service System Website Modernization
Family: Proposal
Type: Proposal Volume
Route: Proposal Intelligence
Matched Patterns: contract documentation;volume
Reasoning Basis: Proposal volume bundle
Match Type: bundle
Candidate Count: 1
Confidence: 0.94

Volume V – Contract Documentation corresponds to Evaluation Factor 5.

### RPLUC-000005 — PLU-PROP-003

Opportunity: Selective Service System Website Modernization
Family: Proposal
Type: Submission Instruction
Route: Proposal Intelligence
Matched Patterns: shall submit;offerors.*submit
Reasoning Basis: single_rule
Match Type: single
Candidate Count: 1
Confidence: 0.82

Offerors shall submit Volume V in accordance with the solicitation instructions.

### RPLUC-000006 — PLU-PROP-006

Opportunity: Selective Service System Website Modernization
Family: Proposal
Type: Amendment Acknowledgement
Route: Proposal Compliance
Matched Patterns: acknowledge.*amendment
Reasoning Basis: single_rule
Match Type: single
Candidate Count: 1
Confidence: 0.82

Offers must acknowledge receipt of this amendment prior to the hour and date specified in the solicitation or as amended, by one of the following methods:

### RPLUC-000007 — PLU-ADM-006

Opportunity: Selective Service System Website Modernization
Family: Delivery and Administration
Type: Contract Administration
Route: Contract Administration
Matched Patterns: contracting officer
Reasoning Basis: single_rule
Match Type: single
Candidate Count: 1
Confidence: 0.82

Questionnaire must be submitted via email directly to the Contracting Officer and Contract Specialist from a corporate email account.

### RPLUC-000008 — PLU-SUP-005

Opportunity: JSCG-P Cristobal Colon Base Life Support
Family: Supplier Qualification
Type: Key Personnel
Route: Staffing Intelligence
Matched Patterns: staffing
Reasoning Basis: single_rule
Match Type: single
Candidate Count: 1
Confidence: 0.82

and all necessary staffing, management and maintenance required to perform these services.

### RPLUC-000009 — PLU-EVAL-001

Opportunity: JSCG-P Cristobal Colon Base Life Support
Family: Evaluation
Type: Evaluation Framework
Route: Evaluation Intelligence
Matched Patterns: most advantageous to the government;technical;price
Reasoning Basis: Best value award framework bundle
Match Type: bundle
Candidate Count: 1
Confidence: 0.94

As a result of this solicitation, the Government intends to award a Firm Fixed Price (FFP) contract resulting from this solicitation to the responsible offeror whose quote conforms to these instructions and will be most advantageous to the Government, considering the lowest price technically acce

### RPLUC-000010 — PLU-COM-001

Opportunity: JSCG-P Cristobal Colon Base Life Support
Family: Commercial
Type: Pricing Structure
Route: Pricing Intelligence
Matched Patterns: unit price;quantity;amount;supplies/services;schedule of supplies;item number
Reasoning Basis: Pricing schedule bundle
Match Type: bundle
Candidate Count: 1
Confidence: 0.94

ITEM NUMBER SCHEDULE OF SUPPLIES/SERVICES QUANTITY UNIT UNIT PRICE AMOUNT (Use Reverse and/or Attach Additional Shee

### RPLUC-000011 — PLU-EVAL-002

Opportunity: JSCG-P Cristobal Colon Base Life Support
Family: Evaluation
Type: Evaluation Navigation
Route: Document Navigation
Matched Patterns: 52\.212-2;basis for award
Reasoning Basis: Evaluation navigation bundle
Match Type: bundle
Candidate Count: 1
Confidence: 0.94

52.212-2 - EVALUATION--COMMERCIAL PRODUCTS AND COMMERCIAL SERVICES (NOV 2021) Basis for Award.

### RPLUC-000012 — PLU-EVAL-001

Opportunity: JSCG-P Cristobal Colon Base Life Support
Family: Evaluation
Type: Evaluation Framework
Route: Evaluation Intelligence
Matched Patterns: most advantageous to the government;price and other factors considered;price
Reasoning Basis: Best value award framework bundle
Match Type: bundle
Candidate Count: 1
Confidence: 0.94

The Government will award a contract resulting from this solicitation to the responsible offeror whose offer conforming to the solicitation will be most advantageous to the Government, price and other factors considered.

### RPLUC-000013 — PLU-EVAL-001

Opportunity: JSCG-P Cristobal Colon Base Life Support
Family: Evaluation
Type: Evaluation Framework
Route: Evaluation Intelligence
Matched Patterns: lowest price technically acceptable;\blpta\b;technical capability;past performance;\bprice\b;technically acceptable
Reasoning Basis: LPTA evaluation framework bundle
Match Type: bundle
Candidate Count: 3
Confidence: 0.94

a) Technical Capability b) Past Performance c) Price This competitive best value selection will be conducted using the Lowest Price Technically Acceptable (LPTA) selection process in accordance with Federal Acquisition Regulation (FAR) part 13, Simplified Acquisition Procedures and FAR part 12, Acquisition of Commercial Items.

### RPLUC-000014 — PLU-EVAL-008

Opportunity: JSCG-P Cristobal Colon Base Life Support
Family: Evaluation
Type: Factor Importance
Route: Requirement Weighting
Matched Patterns: paramount
Reasoning Basis: single_rule
Match Type: single
Candidate Count: 1
Confidence: 0.82

Although the technical capability factor is of paramount consideration in the award of the contract, past performance and price are also important to the overall contract award decision.

### RPLUC-000015 — PLU-EVAL-001

Opportunity: JSCG-P Cristobal Colon Base Life Support
Family: Evaluation
Type: Evaluation Framework
Route: Evaluation Intelligence
Matched Patterns: lowest evaluated price.*acceptable;technical capability;\bprice\b;award will be made
Reasoning Basis: LPTA evaluation framework bundle
Match Type: bundle
Candidate Count: 2
Confidence: 0.94

One award will be made to the offeror who is deemed responsible in accordance with FAR Part 9, whose quote conforms to the solicitations requirements and is the lowest evaluated price with an “Acceptable” rating in the technical capability assessment.

### RPLUC-000016 — PLU-EVAL-006

Opportunity: JSCG-P Cristobal Colon Base Life Support
Family: Evaluation
Type: Evaluation Constraint
Route: Evaluation Intelligence
Matched Patterns: will not receive higher ratings
Reasoning Basis: single_rule
Match Type: single
Candidate Count: 1
Confidence: 0.82

Quotes that exceed the evaluation criteria will not receive higher ratings.

### RPLUC-000017 — PLU-EVAL-001

Opportunity: JSCG-P Cristobal Colon Base Life Support
Family: Evaluation
Type: Evaluation Framework
Route: Evaluation Intelligence
Matched Patterns: \blpta\b;\bprice\b;does not permit tradeoffs
Reasoning Basis: LPTA evaluation framework bundle
Match Type: bundle
Candidate Count: 2
Confidence: 0.94

The LPTA source selection process does not permit tradeoffs between price and non-price factors.

### RPLUC-000018 — PLU-SUP-008

Opportunity: Socket Head Cap Screws
Family: Supplier Qualification
Type: Registration
Route: Eligibility Intelligence
Matched Patterns: \bsam\b;registered;active;offeror;submitting;award
Reasoning Basis: Registration bundle
Match Type: bundle
Candidate Count: 2
Confidence: 0.94

DLA-KME-QUOTATIONS@DLA.MIL *** PLEASE FILL OUT THIS FORM COMPLETELY*** ** In accordance with FAR 52.204-7(b)(1), an Offeror is required to be registered in SAM when submitting an offer or quotation, and must be listed as active, to prevent unduly delaying award.

### RPLUC-000019 — PLU-COM-001

Opportunity: Socket Head Cap Screws
Family: Commercial
Type: Pricing Structure
Route: Pricing Intelligence
Matched Patterns: line item
Reasoning Basis: Pricing schedule bundle
Match Type: bundle
Candidate Count: 1
Confidence: 0.94

CONTRACT DATA REQUIREMENTS LIST (2 DATA ITEMS) A.CONTRACT LINE ITEM NO.

### RPLUC-000020 — PLU-META-002

Opportunity: Socket Head Cap Screws
Family: Metadata and Structure
Type: Exhibit
Route: Document Structure Intelligence
Matched Patterns: exhibit
Reasoning Basis: single_rule
Match Type: single
Candidate Count: 1
Confidence: 0.82

B.EXHIBIT C.CATEGORY 0001 A TDP TM ______ OTHER______ D.SYSTEM/ITEM E.CONTRACT/PR NO.

### RPLUC-000021 — PLU-SUP-003

Opportunity: Socket Head Cap Screws
Family: Supplier Qualification
Type: Certification
Route: Supplier Capability Intelligence
Matched Patterns: certificate of compliance;\bcertification\b;quality;compliance
Reasoning Basis: Certification bundle
Match Type: bundle
Candidate Count: 1
Confidence: 0.94

SUBTITLE CERTIFICATION OF QUALITY A001 CERTIFICATE OF COMPLIANCE COMPLIANCE 4.

### RPLUC-000022 — PLU-TECH-004

Opportunity: Socket Head Cap Screws
Family: Technical
Type: Product Requirement
Route: Product Intelligence
Matched Patterns: \bmaterials?\b
Reasoning Basis: Product/material requirement bundle
Match Type: bundle
Candidate Count: 1
Confidence: 0.94

2 CODE 245 7.DD 250 REQ 9.DIST 10.FREQUENCY 12.DATE OF 1st 14.DISTRIBUTION STATEMENT SUBMISSION a.ADDRESSEE b.COPIES REQUIRED DD One Time With Material DRAFT FINAL A 8.

### RPLUC-000023 — PLU-SUP-003

Opportunity: Socket Head Cap Screws
Family: Supplier Qualification
Type: Certification
Route: Supplier Capability Intelligence
Matched Patterns: \bcertification\b
Reasoning Basis: Certification bundle
Match Type: bundle
Candidate Count: 1
Confidence: 0.94

SUBTITLE CHEMICAL & MECHANICAL CERTIFICATION A002 CERTIFICATION DATA / REPORT 4.AUTHORITY 5.CONTRACT REFERENCE 6.

### RPLUC-000024 — PLU-TECH-004

Opportunity: Socket Head Cap Screws
Family: Technical
Type: Product Requirement
Route: Product Intelligence
Matched Patterns: \bmaterials?\b
Reasoning Basis: Product/material requirement bundle
Match Type: bundle
Candidate Count: 1
Confidence: 0.94

3 CODE 245 7.DD 250 REQ 9.DIST 10.FREQUENCY 12.DATE OF 1st 14.DISTRIBUTION STATEMENT SUBMISSION a.ADDRESSEE b.COPIES REQUIRED One Time DD With Material DRAFT FINAL A 8.APP.

### RPLUC-000025 — PLU-META-002

Opportunity: Socket Head Cap Screws
Family: Metadata and Structure
Type: Exhibit
Route: Document Structure Intelligence
Matched Patterns: exhibit
Reasoning Basis: single_rule
Match Type: single
Candidate Count: 1
Confidence: 0.82

B.EXHIBIT C.CATEGORY 0002 B TDP TM ______ OTHER______ D.SYSTEM/ITEM E.CONTRACT/PR NO.

### RPLUC-000026 — PLU-EVAL-001

Opportunity: Non-Research Long-Term Care facility needed for the enrichment and socialization of Non-Human Primate colony
Family: Evaluation
Type: Evaluation Framework
Route: Evaluation Intelligence
Matched Patterns: most advantageous to the government;evaluation criteria;price
Reasoning Basis: Best value award framework bundle
Match Type: bundle
Candidate Count: 1
Confidence: 0.94

The Government will award a firm-fixed-price contract resulting from this combined synopsis/solicitation to the responsible offeror whose offer, conforming to the synopsis/solicitation, will be most advantageous to the Government (as determined by the solicitation evaluation criteria).

### RPLUC-000027 — PLU-EXCL-002

Opportunity: 6515--Dental Panoramic Machine
Family: Exclusion
Type: Non-Procurement Evaluation
Route: Exclusion Layer
Matched Patterns: product information for evaluation
Reasoning Basis: Non-procurement evaluation exclusion bundle
Match Type: bundle
Candidate Count: 3
Confidence: 0.94

If the contractor can provide the above-mentioned product, the contractor SHALL submit product information for evaluation.

### RPLUC-000028 — PLU-SUP-007

Opportunity: 6515--Dental Panoramic Machine
Family: Supplier Qualification
Type: Authorized Distributor
Route: Eligibility Intelligence
Matched Patterns: authorized distributor
Reasoning Basis: single_rule
Match Type: single
Candidate Count: 1
Confidence: 0.82

If the contractor can provide the above items, the contractor SHALL provide a letter from the manufacturer stating they are an authorized distributor/licenser of their products.

### RPLUC-000029 — PLU-SUP-007

Opportunity: 6515--Dental Panoramic Machine
Family: Supplier Qualification
Type: Authorized Distributor
Route: Eligibility Intelligence
Matched Patterns: authorized distributor
Reasoning Basis: single_rule
Match Type: single
Candidate Count: 1
Confidence: 0.82

Failure to submit an authorized distributor letter shall result in the product(s) potentially offered to be considered “grey market”.

### RPLUC-000030 — PLU-TECH-004

Opportunity: Consolidated Synopsis Aggregate Materials Black Hills National Cemetery
Family: Technical
Type: Product Requirement
Route: Product Intelligence
Matched Patterns: \bmaterials?\b;requirement
Reasoning Basis: Product/material requirement bundle
Match Type: bundle
Candidate Count: 1
Confidence: 0.94

National Cemetery Administration (NCA) Black Hills National Cemetery (BHNC) STATEMENT OF NEED Requirement of Aggregate Materials GENERAL INFORMATION Title of Project:

### RPLUC-000031 — PLU-TECH-004

Opportunity: Consolidated Synopsis Aggregate Materials Black Hills National Cemetery
Family: Technical
Type: Product Requirement
Route: Product Intelligence
Matched Patterns: \bmaterials?\b;requirement
Reasoning Basis: Product/material requirement bundle
Match Type: bundle
Candidate Count: 1
Confidence: 0.94

Aggregate Materials Requirement Black Hills National Cemetery has a requirement for the following materials:

### RPLUC-000032 — PLU-TECH-004

Opportunity: Consolidated Synopsis Aggregate Materials Black Hills National Cemetery
Family: Technical
Type: Product Requirement
Route: Product Intelligence
Matched Patterns: \bmaterials?\b;shall provide
Reasoning Basis: Product/material requirement bundle
Match Type: bundle
Candidate Count: 2
Confidence: 0.94

The vendor shall provide material only when requested by the cemetery Contracting Officer Representative (COR).

### RPLUC-000033 — PLU-TECH-004

Opportunity: Consolidated Synopsis Aggregate Materials Black Hills National Cemetery
Family: Technical
Type: Product Requirement
Route: Product Intelligence
Matched Patterns: \bmaterials?\b;deliver
Reasoning Basis: Product/material requirement bundle
Match Type: bundle
Candidate Count: 2
Confidence: 0.94

The transportation/delivery of material to the cemetery will be provided by the vendor and offloaded in a designated location provided by the COR at the time of delivery.

### RPLUC-000034 — PLU-TECH-004

Opportunity: Consolidated Synopsis Aggregate Materials Black Hills National Cemetery
Family: Technical
Type: Product Requirement
Route: Product Intelligence
Matched Patterns: \bmaterials?\b;shall provide
Reasoning Basis: Product/material requirement bundle
Match Type: bundle
Candidate Count: 2
Confidence: 0.94

The Vendor shall provide the following material upon request by the COR:

### RPLUC-000035 — PLU-SUP-002

Opportunity: Consolidated Synopsis Aggregate Materials Black Hills National Cemetery
Family: Supplier Qualification
Type: Corporate Experience
Route: Supplier Capability Intelligence
Matched Patterns: comparable in size
Reasoning Basis: single_rule
Match Type: single
Candidate Count: 1
Confidence: 0.82

Contractor must identify previous federal, state, local government and or private contracts completed that are comparable in size, complexity and scope to the contract being evaluated.

### RPLUC-000036 — PLU-COMP-005

Opportunity: Consolidated Synopsis Aggregate Materials Black Hills National Cemetery
Family: Legal and Compliance
Type: Subcontracting Requirement
Route: Subcontracting Intelligence
Matched Patterns: subcontracting
Reasoning Basis: single_rule
Match Type: single
Candidate Count: 1
Confidence: 0.82

Past Performance Questionnaire Contract Number Contractor ( Name Address, Zip Code) Telephone Number Email Address Type of Contract Contract Dollar Value Date of Award (if not completed provide status) Type/Extent of Subcontracting Percentage of Work completed by the Contractor Description of Supply/Services provided, location & relevancy of work Address, Telephone Number & Email of the Contact Person and Position

### RPLUC-000037 — PLU-ADM-006

Opportunity: Consolidated Synopsis Aggregate Materials Black Hills National Cemetery
Family: Delivery and Administration
Type: Contract Administration
Route: Contract Administration
Matched Patterns: contracting officer;\bcor\b
Reasoning Basis: single_rule
Match Type: single
Candidate Count: 1
Confidence: 0.82

Additionally, should any activity result in the exposure and/or damage to any remains, container for remains (e.g., casket or urn), or outer burial container, the contractor must contact the COR, Director/Assistant Director, or Contracting Officer (CO) for guidance.

### RPLUC-000038 — PLU-ADM-006

Opportunity: Consolidated Synopsis Aggregate Materials Black Hills National Cemetery
Family: Delivery and Administration
Type: Contract Administration
Route: Contract Administration
Matched Patterns: \bcor\b
Reasoning Basis: single_rule
Match Type: single
Candidate Count: 1
Confidence: 0.82

Any doubts as to proper procedures shall be brought to the attention of the COR, Director/Assistant Director, or

### RPLUC-000039 — PLU-META-001

Opportunity: Consolidated Synopsis Aggregate Materials Black Hills National Cemetery
Family: Metadata and Structure
Type: Attachment
Route: Document Structure Intelligence
Matched Patterns: attachment
Reasoning Basis: single_rule
Match Type: single
Candidate Count: 1
Confidence: 0.82

Black Hills National Cemetery 20901 Pleasant Valley Dr, Sturgis, SD 57785 Attachments:

### RPLUC-000040 — PLU-COM-001

Opportunity: Consolidated Synopsis Aggregate Materials Black Hills National Cemetery
Family: Commercial
Type: Pricing Structure
Route: Pricing Intelligence
Matched Patterns: pricing schedule
Reasoning Basis: Pricing schedule bundle
Match Type: bundle
Candidate Count: 1
Confidence: 0.94

A - Statement of work B - Cemetery Operational Standards C – Dignity Clause D- Past Performance Questionnaire E- Pricing Schedule (Excel) This is a combined synopsis/solicitation for commercial services prepared in accordance with the format in Subpart 12.6, as supplemented with additional information included in this notice.

### RPLUC-000041 — PLU-COMP-001

Opportunity: Request for Information: FDA IT Infrastructure Services
Family: Legal and Compliance
Type: FAR Clause
Route: Compliance Intelligence
Matched Patterns: \bfar\s+part\s+\d+
Reasoning Basis: FAR clause bundle
Match Type: bundle
Candidate Count: 1
Confidence: 0.94

Food and Drug Administration (FDA) is issuing this Request for Information (RFI) as a means of conducting market research, pursuant to FAR Part 10 Market Research.

### RPLUC-000042 — PLU-COM-001

Opportunity: Cape Canaveral National Cemetery Ornamental Grass Renovation and Irrigation National Shrine Project
Family: Commercial
Type: Pricing Structure
Route: Pricing Intelligence
Matched Patterns: price schedule;price/costs;unit price;quantity;amount;supplies/services
Reasoning Basis: Pricing schedule bundle
Match Type: bundle
Candidate Count: 1
Confidence: 0.94

36C78626B0017 Section B SECTION B - SUPPLIES OR SERVICES AND PRICE/COSTS B.1 PRICE SCHEDULE ITEM INFORMATION ITEM DESCRIPTION OF NUMBER SUPPLIES/SERVICES QUANTITY UNIT UNIT PRICE AMOUNT 0001 1 JB __________________ __________________ Remove/Renovate/Replace Ornamental Grass and Irrigation in accordance with the attached Statement of Work Contract Period:

### RPLUC-000043 — PLU-COMP-005

Opportunity: Cape Canaveral National Cemetery Ornamental Grass Renovation and Irrigation National Shrine Project
Family: Legal and Compliance
Type: Subcontracting Requirement
Route: Subcontracting Intelligence
Matched Patterns: subcontractor
Reasoning Basis: single_rule
Match Type: single
Candidate Count: 1
Confidence: 0.82

The subcontractor acknowledges that the following clauses of the contract shown in Item 1 are included in this subcontract:

### RPLUC-000044 — PLU-SUP-003

Opportunity: Cape Canaveral National Cemetery Ornamental Grass Renovation and Irrigation National Shrine Project
Family: Supplier Qualification
Type: Certification
Route: Supplier Capability Intelligence
Matched Patterns: \bcertification\b;compliance;eligibility
Reasoning Basis: Certification bundle
Match Type: bundle
Candidate Count: 1
Confidence: 0.94

Contract Work Hours and Safety Standards Act - Overtime Construction Wage Rate Requirements Compensation (If included in prime contract see Block 6) Apprentices and Trainees Payrolls and Basic Records Compliance with Copeland Act Withholding of Funds Requirements Disputes Concerning Labor Standards Subcontracts (Labor Standards) Compliance with Construction Wage Rate Requirements Contract Termination - Debarment and Related Regulations Certification of Eligibility Autho

### RPLUC-000045 — PLU-EXCL-002

Opportunity: Cape Canaveral National Cemetery Ornamental Grass Renovation and Irrigation National Shrine Project
Family: Exclusion
Type: Non-Procurement Evaluation
Route: Exclusion Layer
Matched Patterns: implementation and evaluation of this program
Reasoning Basis: Non-procurement evaluation exclusion bundle
Match Type: bundle
Candidate Count: 1
Confidence: 0.94

Facility Directors are responsible for the implementation and evaluation of this program at their facilities.

### RPLUC-000046 — PLU-TECH-004

Opportunity: Cape Canaveral National Cemetery Ornamental Grass Renovation and Irrigation National Shrine Project
Family: Technical
Type: Product Requirement
Route: Product Intelligence
Matched Patterns: \bequipment\b
Reasoning Basis: Product/material requirement bundle
Match Type: bundle
Candidate Count: 1
Confidence: 0.94

Facility Directors will ensure that employees are provided the proper equipment and training to protect them from all hazardous conditions in the workplace and comply with OSHA Standards and recognized safe work practices.

### RPLUC-000047 — PLU-COMP-004

Opportunity: Cape Canaveral National Cemetery Ornamental Grass Renovation and Irrigation National Shrine Project
Family: Legal and Compliance
Type: Labor Requirement
Route: Labor Intelligence
Matched Patterns: davis-bacon
Reasoning Basis: single_rule
Match Type: single
Candidate Count: 1
Confidence: 0.82

EMPLOYEE RIGHTS UNDER THE DAVIS-BACON ACT FOR LABORERS AND MECHANICS EMPLOYED ON FEDERAL OR FEDERALLY ASSISTED CONSTRUCTION PROJECTS PREVAILING You must be paid not less than the wage rate listed in the Davis-Bacon Wage Decision posted with this Notice for the work you perform.

### RPLUC-000048 — PLU-SUP-003

Opportunity: Cape Canaveral National Cemetery Ornamental Grass Renovation and Irrigation National Shrine Project
Family: Supplier Qualification
Type: Certification
Route: Supplier Capability Intelligence
Matched Patterns: certified
Reasoning Basis: Certification bundle
Match Type: bundle
Candidate Count: 2
Confidence: 0.94

A contractor who falsifies certified payroll records or induces wage kickbacks may be subject to civil or criminal prosecution, fines and/or imprisonment.

### RPLUC-000049 — PLU-SUP-003

Opportunity: Cape Canaveral National Cemetery Ornamental Grass Renovation and Irrigation National Shrine Project
Family: Supplier Qualification
Type: Certification
Route: Supplier Capability Intelligence
Matched Patterns: certificate of compliance;compliance
Reasoning Basis: Certification bundle
Match Type: bundle
Candidate Count: 2
Confidence: 0.94

VAAR 852.219-75 VA NOTICE OF LIMITATIONS ON SUBCONTRACTING—CERTIFICATE OF COMPLIANCE FOR SERVICES AND CONSTRUCTION (JAN 2023) (DEVIATION) (a) Pursuant to 38 U.S.C.

### RPLUC-000050 — PLU-COMP-005

Opportunity: Cape Canaveral National Cemetery Ornamental Grass Renovation and Irrigation National Shrine Project
Family: Legal and Compliance
Type: Subcontracting Requirement
Route: Subcontracting Intelligence
Matched Patterns: limitations on subcontracting;subcontracting
Reasoning Basis: single_rule
Match Type: single
Candidate Count: 1
Confidence: 0.82

8127(l)(2), the offeror certifies that— (1) If awarded a contract (see FAR 2.101 definition), it will comply with the limitations on subcontracting requirement as provided in the solicitation and the resultant contract, as follows:

### RPLUC-000051 — PLU-SUP-003

Opportunity: Cape Canaveral National Cemetery Ornamental Grass Renovation and Irrigation National Shrine Project
Family: Supplier Qualification
Type: Certification
Route: Supplier Capability Intelligence
Matched Patterns: \bcertification\b;certified
Reasoning Basis: Certification bundle
Match Type: bundle
Candidate Count: 2
Confidence: 0.94

In the case of a contract for services (except construction), the contractor will not pay more than 50% of the amount paid by the government to it to firms that are not certified SDVOSBs listed in the SBA certification database as set forth in 852.219–73 or certified VOSBs listed in the SBA certification database as set forth in 852.219–74.

### RPLUC-000052 — PLU-COMP-006

Opportunity: Cape Canaveral National Cemetery Ornamental Grass Renovation and Irrigation National Shrine Project
Family: Legal and Compliance
Type: Socioeconomic Requirement
Route: Eligibility Intelligence
Matched Patterns: small business
Reasoning Basis: single_rule
Match Type: single
Candidate Count: 1
Confidence: 0.82

Other direct costs may be excluded to the extent they are not the principal purpose of the acquisition and small business concerns do not provide the service as set forth in 13 CFR 125.6.

### RPLUC-000053 — PLU-SUP-003

Opportunity: Cape Canaveral National Cemetery Ornamental Grass Renovation and Irrigation National Shrine Project
Family: Supplier Qualification
Type: Certification
Route: Supplier Capability Intelligence
Matched Patterns: \bcertification\b;certified
Reasoning Basis: Certification bundle
Match Type: bundle
Candidate Count: 2
Confidence: 0.94

In the case of a contract for general construction, the contractor will not pay more than 85% of the amount paid by the government to it to firms that are not certified SDVOSBs listed in the SBA certification database as set forth in 852.219–73 or certified VOSBs listed in the SBA certification database as set forth in 852.219–74.

### RPLUC-000054 — PLU-TECH-004

Opportunity: USAG DHR, Fort Bragg ID Card Services
Family: Technical
Type: Product Requirement
Route: Product Intelligence
Matched Patterns: \bmaterials?\b;\bequipment\b;shall provide;item
Reasoning Basis: Product/material requirement bundle
Match Type: bundle
Candidate Count: 1
Confidence: 0.94

The Contractor shall provide all personnel, equipment, supplies, facilities, transportation, tools, materials, supervision, and other items and non-personal services necessary to perform the verification and issuance of military identification (USID) and CAC cards for active duty military, Reserve and National Guard members, military retirees, family members, Department of Defense (DoD) civilians and other eligible recipients, as defined in this PWS, except for those items specified as government furnished property and services.

### RPLUC-000055 — PLU-COM-001

Opportunity: 6515--NetApp
Family: Commercial
Type: Pricing Structure
Route: Pricing Intelligence
Matched Patterns: \bclin\b;quantity
Reasoning Basis: Pricing schedule bundle
Match Type: bundle
Candidate Count: 1
Confidence: 0.94

GENERAL INFORMATION PLACE OF PERFORMANCE ADDITIONAL INFORMATION DESCRIPTION Amendment to change quantity on Clin #15 from 48 to 64 Amendment to include RFQ answers Question 1 -0015 (UCS-DDR5-BLK):

### RPLUC-000056 — PLU-COM-001

Opportunity: 6515--NetApp
Family: Commercial
Type: Pricing Structure
Route: Pricing Intelligence
Matched Patterns: price/cost schedule;quantity
Reasoning Basis: Pricing schedule bundle
Match Type: bundle
Candidate Count: 1
Confidence: 0.94

Section B.3 (Price/Cost Schedule, page 8) lists a quantity of 48 units for the same item.

### RPLUC-000057 — PLU-COM-001

Opportunity: 6515--NetApp
Family: Commercial
Type: Pricing Structure
Route: Pricing Intelligence
Matched Patterns: price/cost schedule;quantity
Reasoning Basis: Pricing schedule bundle
Match Type: bundle
Candidate Count: 1
Confidence: 0.94

Please confirm which quantity governs for quoting and contract performance—64 per the SOW or 48 per the Price/Cost Schedule—and issue an amendment or written clarification before the offer due date.

### RPLUC-000058 — PLU-COM-001

Opportunity: 6515--NetApp
Family: Commercial
Type: Pricing Structure
Route: Pricing Intelligence
Matched Patterns: line item
Reasoning Basis: Pricing schedule bundle
Match Type: bundle
Candidate Count: 1
Confidence: 0.94

Subscription Pricing Structure Line item 0003, DC-MGT-IS-SAAS-ES (Infrastructure Services SaaS/CVA – Essentials), is a Cisco subscription-based product priced on an annual term basis rather than as a one-time purchase.

### RPLUC-000059 — PLU-COM-001

Opportunity: 6515--NetApp
Family: Commercial
Type: Pricing Structure
Route: Pricing Intelligence
Matched Patterns: line item
Reasoning Basis: Pricing schedule bundle
Match Type: bundle
Candidate Count: 1
Confidence: 0.94

Please confirm the intended contract duration for this subscription line item so all offerors may price it accurately and consistently.

### RPLUC-000060 — PLU-PROP-003

Opportunity: 6515--NetApp
Family: Proposal
Type: Submission Instruction
Route: Proposal Intelligence
Matched Patterns: offerors.*submit
Reasoning Basis: single_rule
Match Type: single
Candidate Count: 2
Confidence: 0.82

Question 3 — OEM Authorization Letter Requirements Section E.2.5 requires offerors to submit an OEM authorization letter dated no more than 90 days

### RPLUC-000061 — PLU-ADM-006

Opportunity: 6515--NetApp
Family: Delivery and Administration
Type: Contract Administration
Route: Contract Administration
Matched Patterns: contract administration
Reasoning Basis: single_rule
Match Type: single
Candidate Count: 2
Confidence: 0.82

GENERAL INFORMATION PLACE OF PERFORMANCE ADDITIONAL INFORMATION DESCRIPTION SECTION B - CONTINUATION OF SF 1449 BLOCKS B.1 CONTRACT ADMINISTRATION DATA 1.

### RPLUC-000062 — PLU-ADM-006

Opportunity: 6515--NetApp
Family: Delivery and Administration
Type: Contract Administration
Route: Contract Administration
Matched Patterns: contract administration
Reasoning Basis: single_rule
Match Type: single
Candidate Count: 1
Confidence: 0.82

All contract administration matters will be handled by the following individuals:

### RPLUC-000063 — PLU-PROP-006

Opportunity: 6515--NetApp
Family: Proposal
Type: Amendment Acknowledgement
Route: Proposal Compliance
Matched Patterns: acknowledge.*amendment
Reasoning Basis: single_rule
Match Type: single
Candidate Count: 1
Confidence: 0.82

The offeror acknowledges receipt of amendments to the Solicitation numbered and dated as follows:

### RPLUC-000064 — PLU-META-001

Opportunity: 31 CES n. 25 military gear lockers.
Family: Metadata and Structure
Type: Attachment
Route: Document Structure Intelligence
Matched Patterns: attachment
Reasoning Basis: single_rule
Match Type: single
Candidate Count: 1
Confidence: 0.82

Looking at the questions and answers loaded toady, Please also advise that as per the Salient+Characteristics attachment The units will be a minimum 42” wide, 24” deep and 78” tall, are other dimensions also acceptable?

### RPLUC-000065 — PLU-ADM-006

Opportunity: Hex Jam Nuts
Family: Delivery and Administration
Type: Contract Administration
Route: Contract Administration
Matched Patterns: contracting officer
Reasoning Basis: single_rule
Match Type: single
Candidate Count: 1
Confidence: 0.82

The specifications and documents shall not be copied, and unless otherwise permitted by the Contracting Officer, shall be returned in their entirety to the Portsmouth Naval Shipyard upon completion of the contract.

### RPLUC-000066 — PLU-SUP-008

Opportunity: Hex Jam Nuts
Family: Supplier Qualification
Type: Registration
Route: Eligibility Intelligence
Matched Patterns: \bsam\b
Reasoning Basis: Registration bundle
Match Type: bundle
Candidate Count: 2
Confidence: 0.94

FAR CLAUSES 52.204-26 Covered Telecommunications Equipment Or Services-Representation (OCT 2020) {if available in SAM reps and certs, duplication may not be required} (a) Definitions.

### RPLUC-000067 — PLU-TECH-004

Opportunity: Hex Jam Nuts
Family: Technical
Type: Product Requirement
Route: Product Intelligence
Matched Patterns: \bequipment\b
Reasoning Basis: Product/material requirement bundle
Match Type: bundle
Candidate Count: 1
Confidence: 0.94

As used in this provision, "covered telecommunications equipment or services" and "reasonable inquiry" have the meaning provided in the clause 52.204-25, Prohibition on Contracting for Certain Telecommunications and Video Surveillance Services or Equipment.

### RPLUC-000068 — PLU-SUP-008

Opportunity: Hex Jam Nuts
Family: Supplier Qualification
Type: Registration
Route: Eligibility Intelligence
Matched Patterns: \bsam\b;system for award management;offeror;award
Reasoning Basis: Registration bundle
Match Type: bundle
Candidate Count: 2
Confidence: 0.94

The Offeror shall review the list of excluded parties in the System for Award Management (SAM) (https://www.sam.gov) for entities excluded from receiving federal awards for "covered telecommunications equipment or services".

### RPLUC-000069 — PLU-TECH-004

Opportunity: Hex Jam Nuts
Family: Technical
Type: Product Requirement
Route: Product Intelligence
Matched Patterns: \bequipment\b
Reasoning Basis: Product/material requirement bundle
Match Type: bundle
Candidate Count: 1
Confidence: 0.94

The Offeror represents that it [__] does, [__] does not provide covered telecommunications equipment or services as a part of its offered products or services to the Government in the performance of any contract, subcontract, or other contractual instrument.

### RPLUC-000070 — PLU-TECH-004

Opportunity: Hex Jam Nuts
Family: Technical
Type: Product Requirement
Route: Product Intelligence
Matched Patterns: \bequipment\b
Reasoning Basis: Product/material requirement bundle
Match Type: bundle
Candidate Count: 1
Confidence: 0.94

(End of provision) 52.204-24 REPRESENTATION REGARDING CERTAIN TELECOMMUNICATIONS AND VIDEO SURVEILLANCE SERVICES OR EQUIPMENT (NOV 2021) {MUST BE FILLED IN, if “does” in 52.204-26} The Offeror shall not complete the representation at paragraph (d)(

### RPLUC-000071 — PLU-PROP-003

Opportunity: Patient Ceiling Lift Slings Replacement
Family: Proposal
Type: Submission Instruction
Route: Proposal Intelligence
Matched Patterns: responses.*shall include
Reasoning Basis: single_rule
Match Type: single
Candidate Count: 1
Confidence: 0.82

Unrestricted – no set-aside Responses to this notice shall include the following:

### RPLUC-000072 — PLU-SUP-008

Opportunity: Patient Ceiling Lift Slings Replacement
Family: Supplier Qualification
Type: Registration
Route: Eligibility Intelligence
Matched Patterns: \bsam\b;\buei\b;cage code;tax id
Reasoning Basis: Registration bundle
Match Type: bundle
Candidate Count: 4
Confidence: 0.89

(a) company name b) address (c) socio-economic status, (d) point of contact (e) phone, fax, and email (f) SAM UEI number (g) Cage Code (h) Tax ID Number (i) and must provide a capability statement that addresses the organizations qualifications and ability to perform as a contractor and provide the commodities described below.

### RPLUC-000073 — PLU-META-004

Opportunity: Marketplace for Acquisition of Professional Services (MAPS)
Family: Metadata and Structure
Type: Table of Contents
Route: Document Structure Intelligence
Matched Patterns: table of contents
Reasoning Basis: single_rule
Match Type: single
Candidate Count: 3
Confidence: 0.82

TABLE OF CONTENTS (X) SECTION DESCRIPTION PAGE(S) (X) SECTION DESCRIPTION PAGE(S) PART I - THE SCHEDULE PART II - CONTRACT CLAUSES A SOLICITATION/CONTRACT FORM I CONTRACT CLAUSES B SUPPLIES OR SERVICES AND PRICES/COSTS PART III - LIST OF DOCUMENTS, EXHIBITS AND OTHER ATTACHMENTS C DESCRIPTION/SPECIFICATIONS/WORK STATEMENT J LIST OF ATTACHMENTS D PACKAGING AND MARKING PART IV - REPRESENTATIONS AND INSTRUCTIONS E INSPECTION AN

### RPLUC-000074 — PLU-META-001

Opportunity: Marketplace for Acquisition of Professional Services (MAPS)
Family: Metadata and Structure
Type: Attachment
Route: Document Structure Intelligence
Matched Patterns: attachment
Reasoning Basis: single_rule
Match Type: single
Candidate Count: 1
Confidence: 0.82

Summary of Changes – Amendment 09 – Sections L & M and Attachment 0002 Scorecard Section L – Instructions to Offerors • L.2.3.3 QP Submission Vacancy Rate, Time to Fill Rate, Schedule and Completeness:

### RPLUC-000075 — PLU-EVAL-002

Opportunity: Marketplace for Acquisition of Professional Services (MAPS)
Family: Evaluation
Type: Evaluation Navigation
Route: Document Navigation
Matched Patterns: section m;evaluation factors;evaluation approach;factor
Reasoning Basis: Evaluation navigation bundle
Match Type: bundle
Candidate Count: 1
Confidence: 0.94

Section M – Evaluation Factors • M.2 Evaluation Approach:

### RPLUC-000076 — PLU-META-001

Opportunity: Marketplace for Acquisition of Professional Services (MAPS)
Family: Metadata and Structure
Type: Attachment
Route: Document Structure Intelligence
Matched Patterns: attachment
Reasoning Basis: single_rule
Match Type: single
Candidate Count: 1
Confidence: 0.82

Attachment 0002 • Commercial Sector Vendor Scorecard Amendment 0004:

### RPLUC-000077 — PLU-COMP-006

Opportunity: Marketplace for Acquisition of Professional Services (MAPS)
Family: Legal and Compliance
Type: Socioeconomic Requirement
Route: Eligibility Intelligence
Matched Patterns: small business
Reasoning Basis: single_rule
Match Type: single
Candidate Count: 1
Confidence: 0.82

• Large and Small Business Scorecard Amendment 0006:

### RPLUC-000078 — PLU-PROP-003

Opportunity: Marketplace for Acquisition of Professional Services (MAPS)
Family: Proposal
Type: Submission Instruction
Route: Proposal Intelligence
Matched Patterns: offerors.*submit
Reasoning Basis: single_rule
Match Type: single
Candidate Count: 1
Confidence: 0.82

IF NEEDED OFFERORS CAN HAVE ONE (1) ALTERNATE PERSON REGISTER IN THE CASE OF AN EMERGENCY.*** In order to submit a proposal for the MAPS acquisition all Offerors shall register through the following link to create their profiles.

### RPLUC-000079 — PLU-META-001

Opportunity: Marketplace for Acquisition of Professional Services (MAPS)
Family: Metadata and Structure
Type: Attachment
Route: Document Structure Intelligence
Matched Patterns: attachment
Reasoning Basis: single_rule
Match Type: single
Candidate Count: 1
Confidence: 0.82

Cover Letter Form Attachment 0001 Amendment 02 Prime Company Name:

### RPLUC-000080 — PLU-ADM-006

Opportunity: Marketplace for Acquisition of Professional Services (MAPS)
Family: Delivery and Administration
Type: Contract Administration
Route: Contract Administration
Matched Patterns: point of contact
Reasoning Basis: single_rule
Match Type: single
Candidate Count: 1
Confidence: 0.82

Point of Contact for Proposal (name, email, phone):

### RPLUC-000081 — PLU-COMP-006

Opportunity: Marketplace for Acquisition of Professional Services (MAPS)
Family: Legal and Compliance
Type: Socioeconomic Requirement
Route: Eligibility Intelligence
Matched Patterns: small business
Reasoning Basis: single_rule
Match Type: single
Candidate Count: 1
Confidence: 0.82

LARGE BUSINESS Management and Advisory Services YES SMALL BUSINESS Domain NO COMMERCIAL-SECTOR VENDOR Select your Business Size for this Domain:

### RPLUC-000082 — PLU-PROP-003

Opportunity: Marketplace for Acquisition of Professional Services (MAPS)
Family: Proposal
Type: Submission Instruction
Route: Proposal Intelligence
Matched Patterns: shall submit;offerors.*submit
Reasoning Basis: single_rule
Match Type: single
Candidate Count: 1
Confidence: 0.82

Joint Venture/Mentor Protégé Information (if applicable) *If proposing as a JV Offerors shall submit your written agreement with the Cover Letter **If proposing as a Mentor Protégé Offerors shall provide verification of the SBA signed agreement with the Cover Letter Are you proposing as a JV?

### RPLUC-000083 — PLU-SUP-003

Opportunity: NPSC Physician Services at the NNMC
Family: Supplier Qualification
Type: Certification
Route: Supplier Capability Intelligence
Matched Patterns: \bcertification\b;offeror
Reasoning Basis: Certification bundle
Match Type: bundle
Candidate Count: 1
Confidence: 0.94

47 the Buy Indian Act, the signature below constitutes self-certification that the Offeror meets the definition of an “Indian Economic Enterprise” (HHSAR 326.601) in response to this Sources Sought Notice, Request for Information (RFI) or Solicitation and resultant contract.

### RPLUC-000084 — PLU-ADM-006

Opportunity: NPSC Physician Services at the NNMC
Family: Delivery and Administration
Type: Contract Administration
Route: Contract Administration
Matched Patterns: contracting officer
Reasoning Basis: single_rule
Match Type: single
Candidate Count: 1
Confidence: 0.82

At any point during these periods, if the Contractor no longer meets the eligibility requirements, the contractor must provide immediate written notification to the Contracting Officer.

### RPLUC-000085 — PLU-COMP-005

Opportunity: NPSC Physician Services at the NNMC
Family: Legal and Compliance
Type: Subcontracting Requirement
Route: Subcontracting Intelligence
Matched Patterns: subcontractor
Reasoning Basis: single_rule
Match Type: single
Candidate Count: 1
Confidence: 0.82

Breach, Designated Record Set, Disclosure, Health Care Operations, Individual, Minimum Necessary, Notice of Privacy Practices, PHI, Required by Law, Secretary, Security Incident, Subcontractor, Unsecured PHI, and Use.

### RPLUC-000086 — PLU-META-004

Opportunity: NPSC Physician Services at the NNMC
Family: Metadata and Structure
Type: Table of Contents
Route: Document Structure Intelligence
Matched Patterns: table of contents
Reasoning Basis: single_rule
Match Type: single
Candidate Count: 3
Confidence: 0.82

Emergency Department Physician 2026-2027 Performance Work Statement (PWS) for Non-Personal Services EMERGENCY DEPARTMENT SUPERTRACK – EM PHYSICIAN Table of Contents Section Page 1.0 General 2-4 2.0 Definitions 4-6 3.0 Government Furnished Information, Property, & Services 6-7 4.0 Contractor Furnished Property 7 5.0 Performance-Based Requirements 8-11 6.0 Contractor Qualification Requirements 11-14 7.0 Order of Precedence/Challenges to Conflicts 14 8.0 Performance Requirements Summary (PRS) 15 9.0 List of Attachments and Exhibits 16 1 PWS:

### RPLUC-000087 — PLU-COM-001

Opportunity: NPSC Physician Services at the NNMC
Family: Commercial
Type: Pricing Structure
Route: Pricing Intelligence
Matched Patterns: unit price;extended price;quantity
Reasoning Basis: Pricing schedule bundle
Match Type: bundle
Candidate Count: 1
Confidence: 0.94

Description Quantity Unit Price Extended Price 1 NPSC Physician Services - Base 520 hrs.

### RPLUC-000088 — PLU-META-001

Opportunity: NPSC Physician Services at the NNMC
Family: Metadata and Structure
Type: Attachment
Route: Document Structure Intelligence
Matched Patterns: attachment
Reasoning Basis: single_rule
Match Type: single
Candidate Count: 1
Confidence: 0.82

TOTAL Performance Work Statement (PWS) is included as an attachment.

### RPLUC-000089 — PLU-ADM-003

Opportunity: NPSC Physician Services at the NNMC
Family: Delivery and Administration
Type: Schedule
Route: Schedule Intelligence
Matched Patterns: period of performance
Reasoning Basis: single_rule
Match Type: single
Candidate Count: 1
Confidence: 0.82

The period of performance for this requirement will be set up with a base period of 12 continuous months, followed by 2 additional option periods of 12 months each, for a potential total of 36 months of service.

### RPLUC-000090 — PLU-COMP-005

Opportunity: Preventive Maintenance Services for Anti-Climb Bi-folding Gates
Family: Legal and Compliance
Type: Subcontracting Requirement
Route: Subcontracting Intelligence
Matched Patterns: subcontractor
Reasoning Basis: single_rule
Match Type: single
Candidate Count: 1
Confidence: 0.82

SECTION I SAFETY REQUIREMENTS FOR CONTRACTORS AND SUBCONTRACTORS This safety Plan details the responsibilities related to Safety and Health for the ADD THE NAME OF YOUR PROJECT HERE project.

### RPLUC-000091 — PLU-SUP-005

Opportunity: Preventive Maintenance Services for Anti-Climb Bi-folding Gates
Family: Supplier Qualification
Type: Key Personnel
Route: Staffing Intelligence
Matched Patterns: project manager
Reasoning Basis: single_rule
Match Type: single
Candidate Count: 1
Confidence: 0.82

The responsibilities and other issues declared in this document will be applied to all the stages of the project, extra or different requirements will be established directly by the Project Manager and/or the POSHO when needed.

### RPLUC-000092 — PLU-COMP-005

Opportunity: Preventive Maintenance Services for Anti-Climb Bi-folding Gates
Family: Legal and Compliance
Type: Subcontracting Requirement
Route: Subcontracting Intelligence
Matched Patterns: subcontractor
Reasoning Basis: single_rule
Match Type: single
Candidate Count: 1
Confidence: 0.82

We, ADD YOUR COMPANY NAME, and all our subcontractors will follow this safety plan and guarantee full access to it in case needed.

### RPLUC-000093 — PLU-META-001

Opportunity: Preventive Maintenance Services for Anti-Climb Bi-folding Gates
Family: Metadata and Structure
Type: Attachment
Route: Document Structure Intelligence
Matched Patterns: attachment
Reasoning Basis: single_rule
Match Type: single
Candidate Count: 1
Confidence: 0.82

The asset inventory in Attachment B lists only bi-folding gates, control panels, and gate backup UPS units.

### RPLUC-000094 — PLU-EVAL-002

Opportunity: Preventive Maintenance Services for Anti-Climb Bi-folding Gates
Family: Evaluation
Type: Evaluation Navigation
Route: Document Navigation
Matched Patterns: evaluation factors;factor
Reasoning Basis: Evaluation navigation bundle
Match Type: bundle
Candidate Count: 6
Confidence: 0.89

TABLE OF CONTENTS SECTION 1 - THE SCHEDULE  SF-1449 cover sheet  Block 20 – SCHEDULE OF SUPPLIES/SERVICES  Block 23 – UNIT PRICE  Attachment A - Statement of Work  Attachment B - Equipment List  Attachment C - Bavak Test Protocol (Specific to Bavak Speed Gate)  Attachment D - Inspection Report (Specific to Bavak Speedgate)  Attachment E - Payment Registration Form – Pesos  Attachment F - Payment Registration– USD to a bank in the United States  Attachment G - Payment Registration– USD to a bank in Mexico  Attachment H - Vendor Portal Registration  Attachment I - Safety Plan SECTION 2 - CONTRACT CLAUSES  Contract Clauses  Addendum to Contract Clauses - FAR and DOSAR Clauses not Prescribed in Part 12 SECTION 3 - SOLICITATION PROVISIONS  Solicitation Provisions  Addendum to Solicitation Provisions - FAR and DOSAR Provisions not Prescribed in Part 12 SECTION 4 - EVALUATION FACTORS  Evaluation Factors  Addendum to Evaluation Factors - FAR and DOSAR Provisions not Prescribed in Part 12 SECTION 5 - REPRESENTATIONS AND CERTIFICATIONS  Addendum to Offeror Representations and Certifications - FAR and DOSAR Provisions not Prescribed in Part 12 SBU - CONTRACTING AND ACQUISITIONS SECTION 1 - THE SCHEDULE CONTINUATION TO SF-1449 RFQ NUMBER 19MX5326Q0043 Block 20 - SCHEDULE OF SUPPLIES/SERVICES 1 DESCRIPTION The U.S.

### RPLUC-000095 — PLU-SUP-008

Opportunity: Preventive Maintenance Services for Anti-Climb Bi-folding Gates
Family: Supplier Qualification
Type: Registration
Route: Eligibility Intelligence
Matched Patterns: \bsam\b;\buei\b;cage code;active
Reasoning Basis: Registration bundle
Match Type: bundle
Candidate Count: 4
Confidence: 0.89

Volume Title  Completed and executed SF-1449 cover sheet (Blocks 17a, 18a, 19, 20, and 23)  Completed Attachment E, F, or G – Payment Registration Form (as applicable based on Section 1.4) I  Completed Section 5 - Representations and Certifications  SAM Unique Entity ID (UEI)  CAGE/NCAGE Code  Evidence of active registration in SAM.gov  Vendor Portal Registration (Attachment H)  Completed Block 23 - Unit Price (Section 1, pages 13-15) showing:

### RPLUC-000096 — PLU-TECH-004

Opportunity: Shade Structure Canopy
Family: Technical
Type: Product Requirement
Route: Product Intelligence
Matched Patterns: \bmaterials?\b
Reasoning Basis: Product/material requirement bundle
Match Type: bundle
Candidate Count: 1
Confidence: 0.94

The government requires material specified and the government will be installing the canopy.

### RPLUC-000097 — PLU-TECH-004

Opportunity: Shade Structure Canopy
Family: Technical
Type: Product Requirement
Route: Product Intelligence
Matched Patterns: \bmaterials?\b
Reasoning Basis: Product/material requirement bundle
Match Type: bundle
Candidate Count: 1
Confidence: 0.94

Please provide the material according to the submitted specifications;

### RPLUC-000098 — PLU-COMP-006

Opportunity: Shade Structure Canopy
Family: Legal and Compliance
Type: Socioeconomic Requirement
Route: Eligibility Intelligence
Matched Patterns: small business
Reasoning Basis: single_rule
Match Type: single
Candidate Count: 1
Confidence: 0.82

The North American Industry Classification System (NAICS) Code for this requirement is 314910 Textile Bag and Canvas Mills, with a Small Business size standard of 500 employees.

### RPLUC-000099 — PLU-COMP-006

Opportunity: Shade Structure Canopy
Family: Legal and Compliance
Type: Socioeconomic Requirement
Route: Eligibility Intelligence
Matched Patterns: small business
Reasoning Basis: single_rule
Match Type: single
Candidate Count: 1
Confidence: 0.82

This Request for Quote (RFQ) for Shade Structure Canopy is being set aside for Total Small Businesses.

### RPLUC-000100 — PLU-COMP-006

Opportunity: Shade Structure Canopy
Family: Legal and Compliance
Type: Socioeconomic Requirement
Route: Eligibility Intelligence
Matched Patterns: small business
Reasoning Basis: single_rule
Match Type: single
Candidate Count: 1
Confidence: 0.82

Meaning, the goal of this solicitation is to find a small business to meet the requirements of the 164th Airlift Wing.

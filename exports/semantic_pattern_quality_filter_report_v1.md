# Semantic Pattern Quality Filter Report V1

Created: 2026-06-27 17:34:06

Input patterns: 941
Accepted patterns: 148
Rejected patterns: 793

Input aliases: 940
Accepted aliases: 54
Rejected aliases: 886

## Sample Accepted Patterns

- national cemetery (freq=17, quality=13, confidence=0.73, hits=cemetery)
- of solicitation (freq=16, quality=13, confidence=0.73, hits=solicitation)
- accounting clerk (freq=15, quality=10, confidence=0.67, hits=)
- customer service (freq=15, quality=10, confidence=0.67, hits=)
- service representative (freq=15, quality=10, confidence=0.67, hits=)
- customer service representative (freq=15, quality=11, confidence=0.69, hits=)
- amendment of (freq=13, quality=13, confidence=0.68, hits=amendment)
- amendment of solicitation (freq=13, quality=17, confidence=0.74, hits=amendment;solicitation)
- administered by (freq=11, quality=13, confidence=0.65, hits=nist)
- interior design (freq=11, quality=10, confidence=0.61, hits=)
- data entry (freq=11, quality=10, confidence=0.61, hits=)
- entry operator (freq=10, quality=10, confidence=0.59, hits=)
- general clerk (freq=10, quality=10, confidence=0.59, hits=)
- data entry operator (freq=10, quality=11, confidence=0.6, hits=)
- section 1 (freq=9, quality=9, confidence=0.56, hits=)
- the offeror (freq=9, quality=12, confidence=0.6, hits=offeror)
- please provide (freq=9, quality=9, confidence=0.56, hits=)
- cemetery administration (freq=9, quality=15, confidence=0.65, hits=cemetery;nist)
- national cemetery administration (freq=9, quality=16, confidence=0.66, hits=cemetery;nist)
- small business (freq=9, quality=9, confidence=0.56, hits=)
- solicitation number (freq=8, quality=11, confidence=0.57, hits=solicitation)
- fixed price (freq=8, quality=8, confidence=0.53, hits=)
- additional information (freq=8, quality=8, confidence=0.53, hits=)
- clerk ii (freq=8, quality=8, confidence=0.53, hits=)
- clerk iii (freq=8, quality=8, confidence=0.53, hits=)
- offerors shall (freq=7, quality=10, confidence=0.54, hits=offeror)
- past performance (freq=7, quality=10, confidence=0.54, hits=past performance)
- of solicitation number (freq=7, quality=11, confidence=0.56, hits=solicitation)
- amendment of solicitation number (freq=7, quality=15, confidence=0.62, hits=amendment;solicitation)
- firm fixed price (freq=7, quality=8, confidence=0.51, hits=)
- unit price (freq=7, quality=15, confidence=0.62, hits=unit price)
- evaluation factors (freq=6, quality=14, confidence=0.58, hits=evaluation;evaluation factors)
- quote for (freq=6, quality=9, confidence=0.51, hits=quote)
- solicitation modification (freq=6, quality=9, confidence=0.51, hits=solicitation)
- of solicitation modification (freq=6, quality=10, confidence=0.52, hits=solicitation)
- solicitation modification of (freq=6, quality=10, confidence=0.52, hits=solicitation)
- amendment of solicitation modification (freq=6, quality=14, confidence=0.58, hits=amendment;solicitation)
- of solicitation modification of (freq=6, quality=11, confidence=0.54, hits=solicitation)
- solicitation modification of contract (freq=6, quality=11, confidence=0.54, hits=solicitation)
- contracting officer (freq=6, quality=14, confidence=0.58, hits=contracting officer)
- administered by if (freq=6, quality=10, confidence=0.52, hits=nist)
- administered by if other (freq=6, quality=11, confidence=0.54, hits=nist)
- by if other than (freq=6, quality=8, confidence=0.49, hits=)
- if other than item (freq=6, quality=8, confidence=0.49, hits=)
- a firm fixed price (freq=6, quality=8, confidence=0.49, hits=)
- synopsis solicitation (freq=6, quality=9, confidence=0.51, hits=solicitation)
- 1 qty 1 ton (freq=6, quality=8, confidence=0.49, hits=)
- qty 1 ton each (freq=6, quality=8, confidence=0.49, hits=)
- solicitation for (freq=6, quality=9, confidence=0.51, hits=solicitation)
- the same (freq=6, quality=9, confidence=0.51, hits=sam)
- for proposal (freq=6, quality=9, confidence=0.51, hits=proposal)
- table of contents (freq=6, quality=10, confidence=0.52, hits=table of contents)
- fringe benefits required follow (freq=6, quality=8, confidence=0.49, hits=)
- benefits required follow the (freq=6, quality=8, confidence=0.49, hits=)
- required follow the occupational (freq=6, quality=8, confidence=0.49, hits=)
- follow the occupational listing (freq=6, quality=8, confidence=0.49, hits=)
- the occupational listing occupation (freq=6, quality=8, confidence=0.49, hits=)
- occupational listing occupation code (freq=6, quality=8, confidence=0.49, hits=)
- listing occupation code title (freq=6, quality=8, confidence=0.49, hits=)
- occupation code title footnote (freq=6, quality=8, confidence=0.49, hits=)
- code title footnote rate (freq=6, quality=8, confidence=0.49, hits=)
- title footnote rate 01000 (freq=6, quality=8, confidence=0.49, hits=)
- for quote (freq=5, quality=8, confidence=0.48, hits=quote)
- administered by code (freq=5, quality=9, confidence=0.49, hits=nist)
- solicitation is (freq=5, quality=8, confidence=0.48, hits=solicitation)
- performance work statement (freq=5, quality=14, confidence=0.57, hits=performance work statement)
- this solicitation (freq=5, quality=8, confidence=0.48, hits=solicitation)
- to award (freq=5, quality=8, confidence=0.48, hits=award)
- for award (freq=5, quality=8, confidence=0.48, hits=award)
- combined synopsis solicitation (freq=5, quality=9, confidence=0.49, hits=solicitation)
- marine corps (freq=5, quality=8, confidence=0.48, hits=cor)
- 01000 administrative (freq=5, quality=8, confidence=0.48, hits=nist)
- administrative support (freq=5, quality=8, confidence=0.48, hits=nist)
- 01020 administrative (freq=5, quality=8, confidence=0.48, hits=nist)
- administrative assistant (freq=5, quality=8, confidence=0.48, hits=nist)

## Sample Rejections

- the government | reason=generic_stop_pattern | quality=10
- the contractor | reason=generic_stop_pattern | quality=10
- shall be | reason=generic_stop_pattern | quality=10
- the following | reason=generic_stop_pattern | quality=10
- with the | reason=generic_stop_pattern | quality=10
- request for | reason=weak_bigram_without_procurement_signal | quality=10
- in accordance | reason=generic_stop_pattern | quality=13
- accordance with | reason=generic_stop_pattern | quality=13
- in accordance with | reason=generic_stop_pattern | quality=14
- department of | reason=generic_stop_pattern | quality=10
- the solicitation | reason=generic_stop_pattern | quality=13
- set forth | reason=generic_stop_pattern | quality=10
- forth in | reason=generic_stop_pattern | quality=10
- set forth in | reason=all_weak_words | quality=11
- or services | reason=generic_stop_pattern | quality=10
- provide the | reason=generic_stop_pattern | quality=10
- to submit | reason=generic_stop_pattern | quality=10
- accordance with the | reason=generic_stop_pattern | quality=14
- in accordance with the | reason=generic_stop_pattern | quality=15
- of veterans | reason=generic_stop_pattern | quality=10
- veterans affairs | reason=generic_stop_pattern | quality=10
- department of veterans | reason=generic_stop_pattern | quality=11
- of veterans affairs | reason=generic_stop_pattern | quality=11
- department of veterans affairs | reason=generic_stop_pattern | quality=12
- this notice | reason=generic_stop_pattern | quality=10
- as set forth | reason=all_weak_words | quality=10
- as set forth in | reason=all_weak_words | quality=11
- contractor shall | reason=all_weak_words | quality=17
- included in | reason=generic_stop_pattern | quality=9
- of contract | reason=generic_stop_pattern | quality=8
- performance of | reason=weak_bigram_without_procurement_signal | quality=8
- the contractor shall | reason=all_weak_words | quality=17
- submit a | reason=weak_bigram_without_procurement_signal | quality=8
- a contract | reason=weak_bigram_without_procurement_signal | quality=8
- follow the | reason=weak_bigram_without_procurement_signal | quality=8
- the above | reason=weak_bigram_without_procurement_signal | quality=7
- for this | reason=all_weak_words | quality=7
- will not | reason=weak_bigram_without_procurement_signal | quality=7
- the contract | reason=weak_bigram_without_procurement_signal | quality=7
- shall not | reason=weak_bigram_without_procurement_signal | quality=7
- firm fixed | reason=low_procurement_signal_score | quality=7
- to the government | reason=all_weak_words | quality=8
- does not | reason=low_procurement_signal_score | quality=7
- government to | reason=all_weak_words | quality=7
- the government to | reason=all_weak_words | quality=8
- requirements 01 | reason=low_procurement_signal_score | quality=7
- camp lejeune | reason=low_procurement_signal_score | quality=7
- volume v | reason=low_procurement_signal_score | quality=6
- provided in | reason=weak_bigram_without_procurement_signal | quality=6
- modification of | reason=weak_bigram_without_procurement_signal | quality=6
- modification of contract | reason=low_procurement_signal_score | quality=7
- letter or | reason=weak_bigram_without_procurement_signal | quality=6
- if other | reason=low_procurement_signal_score | quality=6
- other than | reason=low_procurement_signal_score | quality=6
- than item | reason=low_procurement_signal_score | quality=6
- by if other | reason=low_procurement_signal_score | quality=7
- if other than | reason=low_procurement_signal_score | quality=7
- other than item | reason=low_procurement_signal_score | quality=7
- this is a | reason=all_weak_words | quality=7
- united states | reason=low_procurement_signal_score | quality=6
- work statement | reason=low_procurement_signal_score | quality=6
- this requirement | reason=weak_bigram_without_procurement_signal | quality=6
- required to | reason=weak_bigram_without_procurement_signal | quality=6
- a firm fixed | reason=low_procurement_signal_score | quality=7
- and other | reason=weak_bigram_without_procurement_signal | quality=6
- ton each | reason=low_procurement_signal_score | quality=6
- qty 1 ton | reason=low_procurement_signal_score | quality=7
- 1 ton each | reason=low_procurement_signal_score | quality=7
- the work | reason=weak_bigram_without_procurement_signal | quality=6
- included in this | reason=low_procurement_signal_score | quality=7
- by the government | reason=all_weak_words | quality=7
- north carolina | reason=low_procurement_signal_score | quality=6
- table of | reason=weak_bigram_without_procurement_signal | quality=6
- of contents | reason=weak_bigram_without_procurement_signal | quality=6
- representations and | reason=weak_bigram_without_procurement_signal | quality=6
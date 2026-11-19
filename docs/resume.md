# The resume

The resume is one plain Markdown file, **`content/resume/index.md`**. No front
matter needed (hugo.toml supplies the title and layout). From it come:

- **/resume/**, a web page (`layouts/_default/resume.html`): grayscale, one
  column, Atkinson Hyperlegible (the one thing borrowed from wirenook).
- **`content/resume/Cassidy-Prather-Resume.pdf`**, printed from that page by
  `tools/resume.py` and published beside it.
- The **dry-mode home page**'s portfolio panel, which repeats the sections
  named in `homeSections` under `[params.resume]` in hugo.toml (by default
  Summary, Projects, Skills).

## Writing it

```markdown
# Cassidy Prather

City, ST · cassidy@wirenook.net · (555) 555-5555 · https://wirenook.net · https://github.com/CassidyPrather

## Summary

One or two plain sentences.

## Experience

### Job Title, Company

Jan 2022 – Present · City, ST

- What you did, with a number in it where there honestly is one.

## Projects

## Skills

## Education
```

The conventions the layout styles, and the research below supports:

- `#` for your name, then the contact line as the very next paragraph. Keep
  contact details in the body, not anywhere a header or footer would put them.
- `##` for sections, using the standard names (Experience, Education, Skills,
  Projects). A parser looks for those words.
- `###` for each role, and the dates-and-place line as the next paragraph.
  Use the same date format everywhere.
- Write URLs out as visible text (`https://github.com/...`). A link whose text
  is "my GitHub" loses its URL once text is extracted from the PDF.
- Name skills the way job descriptions do ("PostgreSQL", not "Postgres" alone
  if the posting says PostgreSQL). This is the one piece of screening advice
  with a mechanism behind it: keyword search matches literal text.
- No tables, images, icons or columns. Markdown makes that easy.

## Printing it

```sh
pip install playwright pypdf && playwright install chromium
python tools/resume.py build   # hugo, print to PDF, then check
python tools/resume.py check   # just the check
```

`check` reads the PDF the way a screener does and fails if it can't: every
page has a text layer, every font is embedded with a Unicode map, the text
`pypdf` and `pdftotext` extract holds the Markdown's words in order (at least
97%), and the PDF was printed from the current Markdown. Commit the PDF along
with the Markdown.

## Going dry

Set `mode = "dry"` under `[params]` in hugo.toml and push. Before that, `?dry`
on any URL previews it (and is remembered by that browser; `?wet` undoes it).

---

## Research: Resume embellishments: what the evidence actually supports

Research date: 2026-11-19. Scope: a Markdown → PDF, single-column, grayscale, one-typeface resume for a software engineer, screened by ATS parsers and/or LLMs before humans.

Evidence-strength labels used throughout:
**PR** = peer-reviewed · **PP** = preprint / non-archival · **VD** = vendor documentation (ATS/parser vendor's own help docs) · **VM** = vendor marketing study (company with a product to sell, no published methodology or peer review) · **J** = journalism / data journalism · **F** = folklore (no traceable primary source).

---

## TL;DR

| Embellishment / choice | Verdict | Evidence strength |
|---|---|---|
| Multi-column layout | **Don't** | VD (Greenhouse lists it as a parse-failure cause; Textkernel says columns are a "surprisingly difficult" problem) [1][2] |
| Tables for layout | **Don't** | VD [1] |
| Text boxes | **Don't** | VD (Greenhouse: contact info in text box) [1] |
| Contact info in PDF header/footer region | **Don't** (put it in body text at top) | VD [1] |
| Icons / graphics / skill bars / word art | **Don't** | VD [1][3] |
| Photo | **Don't** (US/UK norms) | VD [1] + PR (photos trigger appearance bias) [27] |
| Non-standard section headings | **Don't** — use Experience / Education / Skills / Projects | VD (Greenhouse: "without clear sections") [1] |
| Inconsistent date formats | **Don't** — pick one (e.g., "Jan 2022 – Mar 2024") and use it everywhere | VD (Greenhouse: "differing formats throughout each section") [1] |
| Letter-spaced text (e.g., S P A C E D headings) | **Don't** | VD [1] |
| Image-only / scanned PDF | **Don't** | VD [1][3] |
| PDF vs DOCX | **No evidence either way** for a text-based PDF; both accepted by major ATS | VD [1][3] |
| Bullet glyph choice (•, –, *) | **No evidence either way** (use a standard Unicode bullet or hyphen) | F |
| Bold / italic for hierarchy | **No evidence of parsing harm**; mild human-reader rationale | F/none |
| Accent color | **No evidence either way** | none found |
| Serif vs sans-serif | **No evidence either way** at normal print sizes | PR [21][22] |
| Atkinson Hyperlegible | **Optional**; designed + tested with low-vision readers, no published efficacy trial for typical readers | VM/design report [23] |
| One page vs two pages | **No strong evidence**; the one study favoring 2 pages is a vendor simulation | VM [19] |
| Hidden white-text keywords / prompt injection | **Don't** — detected at scale, sometimes disqualifying; works only in lab settings | PR/PP + J [8][9][10][11] |
| Real text layer with correct ToUnicode (ligatures extract as letters) | **Do** (verify with `pdftotext`) | Technical fact + VD [1][13][14] |
| Tagged PDF / PDF/UA | **Harmless, no evidence of ATS benefit** | none found |
| Explicit skill keywords that match the JD's wording | **Do** | VD/VM (recruiters search/filter by skills & titles) [5][6] + HBS survey [7] |
| GitHub / portfolio link | **Do if it's good; no evidence on callbacks** | none rigorous |
| Phone + city/region | **Do include city/region; exact street address unnecessary** | PR (distance penalty, low-wage context) [26] |
| "Write it with an LLM to please LLM screeners" | **No defensible advice**; self-preference is model-specific | PR/PP [16][17] |

---

## 1. ATS parsing

**What the vendors themselves say.**
- Greenhouse's own help article on unsuccessful parses lists, verbatim: files > 2.5 MB; resumes uploaded as an image; "graphics, photos, or word art"; "complex resumes with tables, headers, and footers"; "name and contact information in the header, footer, or text box"; "a columned layout"; "spaces between the letters"; "without clear sections and differing formats throughout each section"; incomplete job titles and company names without identifiers like Inc./LLC. [1] (**VD** — the single best primary source found.)
- Workday's admin guide: parsing results "can vary based on resume format and order of words"; "For best results, use resumes that don't have images or image-based styles." Workday does **not** auto-fill the Skills or Languages fields from parsing. [3] (**VD**)
- Textkernel (owner of Sovren, one of the largest parser vendors): "at least 15% of CV documents use a column layout"; handling them is "a surprisingly difficult computer vision problem"; naive top-to-bottom extraction interleaves columns. Their ML fix raised well-rendered column CVs from 62% → 90% in their own evaluation — i.e., even a top vendor still mis-renders ~10% of column resumes. They note keyword search still mostly works on scrambled text but structured field extraction suffers. [2] (**VD**, vendor engineering blog)
- An academic parsing paper likewise measured ~20% of resumes as multi-column/non-linear and needed a layout model to recover reading order. [15] (**PP**)
- Lever's help article on parsing could not be retrieved (page failed to load); Taleo/Oracle and iCIMS official parsing docs are login-gated. Everything else circulating about "Workday/iCIMS/Taleo rules" is career-blog material (**F/VM**) and often contradictory (e.g., whether Taleo reads headers/footers).
- Greenhouse also warns candidates that parsing "can make mistakes" and to review autofilled fields. [4] (**VD**)

**Does the ATS "reject" you?** Parse failure generally degrades search/autofill; recruiters can still open the original file. Rejection is mostly done by humans and by knockout questions/filters configured by employers. The Harvard Business School/Accenture *Hidden Workers* report (survey of >2,250 executives) found 88% of employers agreed qualified high-skill candidates are "vetted out" for not matching exact JD criteria, pointing at negative filters (degree, employment gaps) — a filter-configuration problem, not a formatting one. [7] (**survey report, not peer-reviewed**)

**The "75% of resumes are rejected by ATS" stat is folklore.** It traces to a 2012 sales pitch by Preptel, a resume-optimization company that published no methodology and closed around 2013; HR consultant Christine Assaf's investigation concluded it was "created without any study, survey, or context." [12] (**F**; origin tracing is itself secondary — no Preptel primary document survives that I could find.)

**Recruiter search behavior.** Jobscan's 2025 survey of 384 recruiters (**VM**) reports ~99.7% use ATS filters, ~76% filter/search by skills and ~55% by job title. [6] Treat numbers loosely, but the direction matches Workday's documentation that Skills is *not* auto-filled [3] — the literal words in your text are what recruiter keyword search hits.

**Verdicts:** single column (do), no tables/text boxes/header-footer contact info/icons/photos (don't), standard section names (do), consistent dates (do), real hyperlinks with visible URLs (do — so the URL survives even if the link annotation is dropped; no vendor evidence either way on annotation handling), PDF vs DOCX (no evidence either way for text PDFs; both accepted [1]), bullet glyphs (no evidence either way — folklore).

## 2. PDF machine-readability and hidden text

- **Text layer vs image:** image-only PDFs fail parsing (Greenhouse [1], Workday [3]). A Markdown→PDF pipeline produces real text by default; this is a non-issue as long as you don't rasterize.
- **Ligatures / ToUnicode:** TeX-family engines set fi/fl/ff/ffi/ffl as single glyphs; if the PDF lacks a correct `/ToUnicode` CMap, extractors emit a garbage code point and "financial" no longer matches "financial". With a correct ToUnicode map, copy/paste yields the letters. Fix in LaTeX: `\usepackage{cmap}` (or `\pdfgentounicode=1` + glyphtounicode), T1/lmodern, or disable ligatures; LuaLaTeX/XeLaTeX and browser print engines usually emit ToUnicode maps but extractor bugs exist (e.g., Ghostscript bug 706533). [13][14] (**technical primary sources: TeX mailing lists, bug trackers**). Prefer ToUnicode mapping fi → "f i", not to the U+FB01 ligature code point. [14]
- **Reading order:** for single-column content the content-stream order is almost always correct; reading-order failures are overwhelmingly a multi-column phenomenon [2][15].
- **Tagged PDF / PDF/UA:** no vendor documentation or study found indicating any ATS or LLM screener uses structure tags. Harmless and good for accessibility; no evidence of screening benefit (**no evidence either way**).
- **Self-test (do):** `pdftotext -layout resume.pdf - | less` and `pdffonts resume.pdf` (check every font is embedded and has `uni yes`). This is the closest proxy for what a parser sees.

**Hidden white text / prompt injection — don't.**
- Prevalence and detection: Greenhouse reported ~1% of resumes processed in H1 2025 contained hidden tricks; ManpowerGroup flags hidden text in ~10% (~100k/yr) of resumes its AI scans (NYT, Oct 2025). [8] (**J**)
- Zhang, …, Gong, Chen, Song (USENIX Security 2026) analyzed ~200k real resumes from hireEZ: ~1% contained hidden injections, rising over the last 1–2 years; >90% were hidden keyword/skill lists rather than explicit instructions; they built detectors outperforming general prompt-injection detectors and recommend comparing visible rendering vs extracted text. [9] (**PR**)
- Hidden text is trivially visible after extraction: parsers flatten color, so recruiters see the stuffed text in the parsed view. Dedicated detectors exist (e.g., PhantomLint [10]). (**PP**)
- Does it work? In lab benchmarks, instruction-style injections can steer LLM screeners (>80% attack success for some attack types) while *invisible keyword* stuffing is the least potent variant [11] (**PP**); a controlled ranking study (ACL Findings 2026) found injection helps only when few candidates do it and quality is homogeneous, and collapses as it spreads [11b] (**PR**, details from secondary summary). No study shows benefit in a real, defended pipeline, and at least one large staffing firm treats hidden text as grounds to not advance a candidate (secondary report, unverified). Net: real downside (fraud signal, disqualification), speculative upside.

## 3. LLM-based screening research (2023–2026)

- **Name/demographic bias, embeddings:** Wilson & Caliskan (AIES 2024) — retrieval with Massive Text Embedding models over 500+ resumes × 500 JDs, 9 occupations; White-associated names favored in 85.1% of tests, female names in 11.1%, Black men disadvantaged in up to 100%; **document length and name corpus-frequency also affected selection**. [16] (**PR**)
- **Name bias, GPT:** Bloomberg (Mar 2024) found GPT-3.5/4 ranked otherwise-identical resumes differently by name, with job-dependent direction. [17] (**J**, open data/code). interviewing.io re-analyzed Bloomberg's released data and argued the effects were not statistically significant for SWE. [18] (**VM** rebuttal). Takeaway: real but noisy and model/job specific — not something formatting can fix.
- **Gender and position:** Rozado (2025; 22 LLMs, 70 professions) — all models favored female-named candidates in pairwise comparisons; most models showed substantial bias toward the candidate listed first. [20] (**PP**; later published in PeerJ CS). Yin et al., "Fragile Preferences" (2025) — position effects typically larger than gender effects, and direction depends on quality. [20b] (**PP**). Implication: much LLM-screener variance is noise outside the candidate's control.
- **AI–AI / self-preference:** Laurito et al. (PNAS 2025) — LLMs prefer items described in LLM-written prose over human-written prose, beyond human baseline preference. [24] (**PR**). Xu, Li & Jiang (2025; AIES/EAAMO non-archival) — LLMs prefer resumes *they themselves* generated over human-written ones (67–82%), yielding 23–60% higher shortlist rates for same-model candidates; GPT-4o and Llama-3.3-70B did not consistently prefer *other* models' output. [25] (**PP**). Implication: since you don't know the screener model, "LLM-polish to win LLMs" is a lottery, not advice; it may also trigger the human "sounds like AI" penalty that Greenhouse's own survey says candidates now worry about. [8]
- **Context sensitivity:** Signal or Noise? (2025) — Claude/GPT/Gemini screening outputs differ significantly from human experts and (for GPT) shift with company-context prompts. [28] (**PP**)
- **Formatting effects on LLM extraction:** no controlled study isolating resume visual formatting on LLM screening outcomes was found. The parsing literature shows multi-column layouts break text order before the LLM ever sees it [2][15]; plain single-column text sidesteps that.
- **Keywords / quantified outcomes:** no peer-reviewed study isolates "quantified achievements" or "exact JD keyword match" on LLM ranking. The defensible basis is mechanical: embedding retrieval and recruiter keyword search operate on literal text [2][6][16], so naming the actual technologies/titles the JD names (where truthful) is the only advice with a mechanism behind it. "Quantify outcomes" is reasonable human-reader advice but **no direct evidence** for LLMs.

**Defensible advice:** standard section names; explicit, truthful skill/tech names using the JD's terminology (e.g., "Kubernetes", not only "container orchestration"); job titles spelled out in full; consistent dates; concise length (embedding similarity is length-sensitive [16], direction not specified in the abstract). Avoid tricks.

## 4. Human readers

- **Eye-tracking "6 / 7.4 seconds":** Ladders 2012 (30 recruiters, 10 weeks, ~6 s initial screen) and 2018 (7.4 s, recruiters fixate on job titles; sample size not disclosed) are **VM** — no peer review, thin methods, criticized by ERE. [29] Directionally, "initial skim is short; titles, employers, dates get attention" is plausible; the precise numbers are not reliable.
- **Better-documented recruiter study:** interviewing.io/Learning Collider (76 technical recruiters, ~2,200 evaluations): median 31 s per resume; recruiters barely beat chance (~55%) at predicting interview performance; decisions driven mainly by employer/school prestige, not formatting. [18b] (**VM** with disclosed method). Formatting was not a studied variable.
- **Length:** ResumeGo 2018 (482 hiring professionals, simulated, 2-page preferred ~2.3:1) is a **VM** by a resume-writing company, self-described as a simulation. [19] **No evidence either way** strong enough to override "as long as the content earns it".
- **Typeface:** At normal print sizes serif vs sans makes no reliable difference to legibility (Arditi & Cho 2005, Vision Research, n small; reviews find the modal result is no difference). [21][22] (**PR**). Atkinson Hyperlegible was designed by Applied Design Works for the Braille Institute and tested with low-vision readers during design; no published peer-reviewed efficacy trial found. [23] Fine choice, not evidence-backed for typical readers.
- **Bold, whitespace, color, visual design:** no peer-reviewed experiment on resume visual design → recruiter evaluation was found. Advice like "20–30% whitespace" is **F**. Grayscale has no demonstrated penalty; color has no demonstrated benefit.
- **Photos:** Ruffle & Shtudiner (Management Science 2015; field experiment, Israel) — attractive men got more callbacks than no-photo; attractive women got *fewer* than no-photo. Photos inject appearance bias. [27] (**PR**). Plus Greenhouse lists photos as a parse risk [1].

## 5. Links, phone, location

- **GitHub / portfolio:** no study measuring callback effect found; claims like "78% of tech recruiters check GitHub" are unsourced (**F**). Parsers extract URLs as text; spell the URL visibly (e.g., `github.com/handle`) so it survives extraction even if the link annotation is dropped. Include only if it reinforces the resume; a thin public profile is not clearly penalized but adds no signal.
- **Phone/email:** required by parsers to populate contact fields; keep them in the body (not header/footer) [1]. No evidence that including a phone number matters for AI screening.
- **Location:** Phillips (J. Human Resources 2020; DC correspondence experiment) — callbacks fall ~1.1 pp per mile of commute distance; neighborhood affluence had no independent effect. [26] (**PR**, but low-wage jobs; external validity to SWE unknown). Many ATS/recruiters filter by location for on-site/hybrid roles (Jobscan survey [6], **VM**). Listing "City, ST" (and "Open to remote/relocation" if true) is defensible; full street address is not needed.

---

## References

1. Greenhouse Support, "Unsuccessful resume parse." https://support.greenhouse.io/hc/en-us/articles/200989175-Unsuccessful-resume-parse (VD)
2. Textkernel, "Improving extraction from column resumes." https://textkernel.com/learn-support/blog/improving-extraction-from-column-resumes (VD)
3. Workday Administrator Guide, resume parsing for prospects/candidates (updated 2023-06-23). https://doc.workday.com/admin-guide/en-us/human-capital-management/recruiting/candidates/set-up-prospects-and-candidates/hdc1552497830785.html (VD)
4. Greenhouse Support, "MyGreenhouse FAQ for Candidates." https://support.greenhouse.io/hc/en-us/articles/43418495049499-MyGreenhouse-FAQ-for-Candidates (VD)
5. Lever Help Center, "Understanding Resume Parsing" (could not be loaded; cited for existence only). https://help.lever.co/hc/en-us/articles/20087345054749
6. Jobscan, "State of the Job Search" / ATS recruiter survey (n=384). https://www.jobscan.co/state-of-the-job-search ; https://www.jobscan.co/blog/8-things-you-need-to-know-about-applicant-tracking-systems/ (VM)
7. Fuller, Raman, Sage-Gavin, Hines, *Hidden Workers: Untapped Talent*, Harvard Business School & Accenture, Sept 2021; summarized by HR Dive. https://www.hrdive.com/news/report-applicant-tracking-systems-may-exclude-whole-segments-of-candidates/606614/ (survey report)
8. New York Times (7 Oct 2025), republished: "Recruiters use AI to scan resumes. Applicants are trying to trick it." https://www.thestar.com.my/tech/tech-news/2025/10/09/recruiters-use-ai-to-scan-resumes-applicants-are-trying-to-trick-it ; Greenhouse newsroom survey on AI-sounding writing: https://www.greenhouse.com/newsroom/6-in-10-job-seekers-are-rethinking-how-they-write-to-avoid-sounding-like-ai-even-as-most-use-it-in-their-search (J / VM)
9. Zhang, Jia, Tan, Jiang, Gong, Chen, Song, "Measuring Real-World Prompt Injection Attacks in LLM-based Resume Screening," USENIX Security 2026. https://arxiv.org/abs/2605.28999 (PR)
10. "PhantomLint: Principled Detection of Hidden LLM Prompts in Structured Documents." https://arxiv.org/abs/2508.17884 (PP)
11. Mu et al., "AI Security Beyond Core Domains: Resume Screening as a Case Study of Adversarial Vulnerabilities in Specialized LLM Applications," 2025. https://arxiv.org/abs/2512.20164 (PP)
11b. Prompt injection in LLM résumé screening, ACL Findings 2026 (paper 142). https://aclanthology.org/2026.findings-acl.142.pdf (PR; findings taken from secondary summary — PDF text not extractable here)
12. HiringThing, "Applicant Tracking Systems Aren't Excluding Job Applicants—People Are" (Assaf on the Preptel origin). https://blog.hiringthing.com/applicant-tracking-system-myths ; see also https://lenz.io/c/ats-applicant-tracking-system-75-percent-rejection-rate-bc6fd7d4 (secondary)
13. pdfTeX mailing list on ToUnicode and the fi ligature (Sept 2018). https://tug.org/pipermail/pdftex/2018-September/009143.html ; TeX Live list, "ligatures cannot be copied and pasted." https://tug.org/pipermail/tex-live/2009-February/019970.html
14. Mozilla Bugzilla 1810914 (ligature code points shouldn't be in ToUnicode). https://bugzilla.mozilla.org/show_bug.cgi?id=1810914 ; Ghostscript bug 706533. https://bugs.ghostscript.com/show_bug.cgi?id=706533 ; freedesktop bug 7002. https://bugs.freedesktop.org/show_bug.cgi?id=7002
15. Zhu et al., "Layout-Aware Parsing Meets Efficient LLMs: A Unified, Scalable Framework for Resume Information Extraction and Evaluation," 2025. https://arxiv.org/abs/2510.09722 (PP)
16. Wilson & Caliskan, "Gender, Race, and Intersectional Bias in Resume Screening via Language Model Retrieval," AIES 2024, 7(1):1578–1590. https://ojs.aaai.org/index.php/AIES/article/view/31748 ; https://arxiv.org/abs/2407.20371 (PR)
17. Yin, Alba, Nicoletti, "OpenAI's GPT Is a Recruiter's Dream Tool. Tests Show There's Racial Bias," Bloomberg, Mar 2024. https://www.bloomberg.com/graphics/2024-openai-gpt-hiring-racial-discrimination/ ; data/code: https://github.com/BloombergGraphics/2024-openai-gpt-hiring-racial-discrimination (J)
18. interviewing.io, "Refuting Bloomberg's analysis: ChatGPT isn't racist." https://interviewing.io/blog/refuting-bloombergs-analysis-chatgpt-isnt-racist (VM)
18b. interviewing.io / Learning Collider, "Are recruiters better than a coin flip at judging resumes?" https://interviewing.io/blog/are-recruiters-better-than-a-coin-flip-at-judging-resumes (VM, disclosed method)
19. ResumeGo, "Settling the Debate: One or Two Page Resumes" (2018). https://resumego.net/research/one-or-two-page-resumes (VM)
20. Rozado, "Gender and Positional Biases in LLM-Based Hiring Decisions," 2025. https://arxiv.org/abs/2505.17049 ; PeerJ CS version: https://peerj.com/articles/cs-3628 (PP → PR)
20b. Yin, Vardi, Choudhary, "Fragile Preferences: A Deep Dive into Order Effects in Large Language Models," 2025. https://arxiv.org/abs/2506.14092 (PP)
21. Arditi & Cho, "Serifs and font legibility," Vision Research 45(23), 2005; discussed in Perea, "Why does the APA recommend the use of serif fonts?" https://www.uv.es/mperea/serif_JCP.pdf (PR)
22. Review of serif vs sans legibility literature (PMC). https://pmc.ncbi.nlm.nih.gov/articles/PMC4612630 ; Poole, "Which are more legible: serif or sans serif typefaces?" https://alexpoole.info/blog/which-are-more-legible-serif-or-sans-serif-typefaces/ (PR / literature review)
23. Design Week, "Designing a typeface for the visually impaired" (Atkinson Hyperlegible). https://www.designweek.co.uk/issues/2-8-august-2021/designing-atkinson-hyperlegible/ ; All About Vision. https://www.allaboutvision.com/conditions/blindness-low-vision/atkinson-hyperlegible-typeface/ (design report)
24. Laurito et al., "AI–AI bias: large language models favor communications generated by large language models," PNAS 122(31), 2025. Preprint: https://arxiv.org/abs/2407.12856 (PR)
25. Xu, Li, Jiang, "AI Self-preferencing in Algorithmic Hiring: Empirical Evidence and Insights," 2025 (AIES/EAAMO non-archival). https://arxiv.org/abs/2509.00462 (PP)
26. Phillips, "Do Low-Wage Employers Discriminate Against Applicants with Long Commutes? Evidence from a Correspondence Experiment," Journal of Human Resources, 2020. https://www.poverty.ucdavis.edu/sites/main/files/file-attachments/address_experiment_jhr_final.pdf (PR)
27. Ruffle & Shtudiner, "Are Good-Looking People More Employable?" Management Science 61(8):1760–1776, 2015. https://econpapers.repec.org/RePEc:inm:ormnsc:v:61:y:2015:i:8:p:1760-1776 (PR)
28. "Signal or Noise? Evaluating Large Language Models in Resume Screening Across Contextual Variations and Human Expert Benchmarks," 2025. https://arxiv.org/abs/2507.08019 (PP)
29. The Ladders, Eye-Tracking Study 2018 (copy). https://csuglobal.edu/sites/default/files/blog-files/theladders-eyetracking-studyc2.pdf ; critique: ERE, "Is the 6-second resume scan a myth?" https://www.ere.net/articles/is-the-6-second-resume-scan-a-myth (VM / commentary)

**Gaps / not verified:** Lever, iCIMS and Taleo official parsing docs (unavailable or login-gated); Preptel primary materials; ManpowerGroup's "not moved forward" policy (secondary only); full text of the ACL Findings 2026 injection study.

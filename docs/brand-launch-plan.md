# Brand presets launch on X

## Goal
Get attention for cutecode.app by posting a short video of each brand preset on X and tagging the company. One repost from a large dev-tool account beats weeks of solo posting.

## Rules
- Brand presets stay free. Charging for another company's look invites a takedown, not a repost.
- Use abstract motifs, never exact logo copies.
- If a company asks for removal, remove the preset fast and politely.

## Post format
- **Video:** 8-15s MP4, square or 16:9, with motion visible in the first second.
- **Snippet:** real code from that company's SDK, so their team recognizes it instantly.
- **Copy:** frame it as a gift. "Made a free <Brand> theme for your code snippets", not "how's that?".
- **Tags:** the company account plus one devrel person or founder who is active on X.
- **Link:** `https://www.cutecode.app`.

## Order
| # | Brand | Preset id | Restyled | Snippet idea |
|---|---|---|---|---|
| 1 | Vercel | vercel | yes | AI SDK `streamText` call |
| 2 | Supabase | supabase | yes | `supabase.from("todos").select()` |
| 3 | Claude | claude | yes | Messages API call |
| 4 | Resend | resend | no | `resend.emails.send` |
| 5 | Clerk | clerk | yes | `clerkMiddleware()` |
| 6 | Trigger.dev | triggerdev | no | `task({ id, run })` |
| 7 | Mintlify | mintlify | no | `mint.json` / MDX page |
| 8 | Browserbase | browserbase | no | session + Playwright connect |
| 9 | Prisma | prisma | no | `prisma.user.findMany` |
| 10 | Nuxt | nuxt | no | `useFetch` in a page |
| 11 | ElevenLabs | elevenlabs | no | text-to-speech call |
| 12 | Tailwind | tailwind | no | utility-class component |
| 13 | Cloudflare | cloudflare | no | Worker `fetch` handler |
| 14 | Rabbit | rabbit | no | |
| 15 | OpenAI | openai | yes | Responses API call |
| 16 | Stripe | stripe | yes | Checkout session |
| 17 | Gemini | gemini | no | `generateContent` |

The giants (OpenAI, Stripe, Gemini) come last, once there is traction to point at.

## Cadence
One brand every 1-2 days. Restyle each unrestyled preset before its slot.

## Prep
- [ ] Owner verifies the restyled presets export cleanly in Chrome and Safari.
- [ ] Restyle the unrestyled brand presets in order, staying ahead of the posting schedule.
- [ ] Write post copy and a snippet for each brand.
- [ ] Find the X handle and one devrel/founder handle per brand. Verify every handle; don't guess.
- [ ] Schedule posts via Metricool.

## Track
After each post, log reposts, replies, profile visits and sign-ups. Double down on the formats that land.

## Posts

### Launch thread
1. Made CuteCode: turn your code into beautiful snippet images and videos. Free to use, no signup to start. https://www.cutecode.app
2. The part I care about most: export your snippet as a video. Typing animation, smooth motion, ready to post. Most snippet tools stop at a screenshot.
3. Dozens of presets, from clean minimal looks to themes inspired by the dev tools you use daily. Pick one, paste code, export.
4. Free: all classic and brand themes, PNG and SVG, video with watermark. Pro: premium themes, no watermark, 3x export. Code FOUNDING30 = 30% off for life. First 100 only, ends 2027-01-16.
5. Try it: https://www.cutecode.app What theme should I add next?

Pinned variant:
Beautiful code snippets as images and videos, free. Pick a preset, paste code, export. Founding code FOUNDING30 gives 30% off Pro for life (first 100, ends 2027-01-16). https://www.cutecode.app

### Per-brand posts
Link: `https://www.cutecode.app`. Post copy follows the gift framing. Handle sources are official site links, GitHub profile fields, or press pages as noted. Model ids in samples (Claude, OpenAI, Gemini, Vercel, ElevenLabs) were not verified; check against current docs before posting.

**1. Vercel** (`vercel`)
- Copy: Made a free Vercel theme for your code snippets. Paste your AI SDK code, export an image or video. https://www.cutecode.app
- Company: @vercel (source: x.com link on vercel.com)
- Person: @rauchg, Guillermo Rauch, founder (source: vercel.com structured data, `founder.sameAs`)
- Sample: real SDK code (`streamText` from `ai`). Model id `anthropic/claude-sonnet-5.5` unchecked.

**2. Supabase** (`supabase`)
- Copy: Made a free Supabase theme for your code snippets. Your `.from("todos").select()` deserves a nice export. https://www.cutecode.app
- Company: @supabase (source: twitter.com link on supabase.com)
- Person: @kiwicopple, Paul Copplestone, CEO (source: GitHub profile bio "CEO @supabase", twitter field)
- Sample: real SDK code (`createClient`, `.from().select()`).

**3. Claude** (`claude`)
- Copy: Made a free Claude theme for your code snippets. Warm, clean, built for your Messages API calls. https://www.cutecode.app
- Company: @claudeai (source: x.com link on claude.com); also @AnthropicAI (anthropic.com)
- Person: @alexalbert__, Alex Albert, DevRel (source: GitHub profile bio "DevRel + Prompting @anthropics", twitter field). Role may have changed; confirm before tagging.
- Sample: real SDK code (`@anthropic-ai/sdk` `messages.create`). Model id `claude-opus-5-5` unchecked.

**4. Resend** (`resend`)
- Copy: Made a free Resend theme for your code snippets. Show off your `resend.emails.send` in black and white. https://www.cutecode.app
- Company: @resend (source: x.com link on resend.com)
- Person: @zenorocha, Zeno Rocha, founder and CEO (source: GitHub profile bio, twitter field)
- Sample: real SDK code (`emails.send`).

**5. Clerk** (`clerk`)
- Copy: Made a free Clerk theme for your code snippets. Your `clerkMiddleware()` setup, looking sharp. https://www.cutecode.app
- Company: @clerk (source: x.com link on clerk.com; also GitHub org field)
- Person: UNVERIFIED. Colin Sidoti is co-founder and CEO (Crunchbase) but no X handle was found. Look on Clerk's team or docs pages.
- Sample: real SDK code (`clerkMiddleware`, standard matcher config).

**6. Trigger.dev** (`triggerdev`)
- Copy: Made a free Trigger.dev theme for your code snippets. Your `task({ id, run })` in its own colors. https://www.cutecode.app
- Company: @triggerdotdev (source: twitter.com link on trigger.dev)
- Person: @maverickdotdev, Eric Allam, co-founder and CTO (source: GitHub profile, company "Trigger.dev", twitter field). Alternative: @mattaitken, Matt Aitken (GitHub profile, company @triggerdotdev).
- Sample: real SDK code (`task` from `@trigger.dev/sdk`).

**7. Mintlify** (`mintlify`)
- Copy: Made a free Mintlify theme for your code snippets. Share your `docs.json` setup in the mint green. https://www.cutecode.app
- Company: @mintlify (source: x.com link on mintlify.com)
- Person: @hahnbeeIee, Hahnbee Lee, co-founder (source: GitHub profile, twitter field). The handle contains capital "I" letters instead of "l"; copy it exactly and test the mention before posting.
- Sample: real config (`docs.json` with `$schema`, theme, navigation). Not SDK code, but it is the company's real config format.

**8. Browserbase** (`browserbase`)
- Copy: Made a free Browserbase theme for your code snippets. Session create plus Playwright connect, ready to share. https://www.cutecode.app
- Company: @browserbase (source: x.com link on browserbase.com)
- Person: @pk_iv, Paul Klein IV, founder and CEO (source: ai.engineer speaker page x.com link)
- Sample: real SDK code (`@browserbasehq/sdk` `sessions.create`, `connectOverCDP`).

**9. Prisma** (`prisma`)
- Copy: Made a free Prisma theme for your code snippets. Your `prisma.post.findMany` query, nicely framed. https://www.cutecode.app
- Company: @prisma (source: twitter.com link on prisma.io)
- Person: @nikolasburk, Nikolas Burk, Prisma (source: GitHub profile company "@prisma", twitter field). Role not stated; confirm devrel before tagging.
- Sample: real SDK code (`PrismaClient`, `findMany`).

**10. Nuxt** (`nuxt`)
- Copy: Made a free Nuxt theme for your code snippets. Your `useFetch` page, in Nuxt green. https://www.cutecode.app
- Company: @nuxt_js (source: x.com link on nuxt.com)
- Person: @atinux, Sebastien Chopin, creator of Nuxt (source: GitHub profile bio, twitter field)
- Sample: real framework code (`useFetch` in a Vue SFC).

**11. ElevenLabs** (`elevenlabs`; the folder is `eleven-labs` but the id in the theme file is `elevenlabs`, so the table is correct)
- Copy: Made a free ElevenLabs theme for your code snippets. Text-to-speech in a few lines, now easy to share. https://www.cutecode.app
- Company: @elevenlabs (source: x.com link on elevenlabs.io); developer account @ElevenLabsDevs (same page)
- Person: @mati, Mati Staniszewski, co-founder and CEO (source: x.com link on elevenlabs.io; role from public knowledge, confirm)
- Sample: real SDK code (`@elevenlabs/elevenlabs-js` `textToSpeech.convert`). Model id `eleven_v4` unchecked.

**12. Tailwind** (`tailwind`)
- Copy: Made a free Tailwind theme for your code snippets. Share your utility-class components in sky blue. https://www.cutecode.app
- Company: @tailwindcss (source: x.com link on tailwindcss.com)
- Person: @adamwathan, Adam Wathan, creator of Tailwind CSS (source: adamwathan.me link; GitHub bio)
- Sample: realistic Tailwind component (TSX). No SDK exists; flag only that it is not SDK code.

**13. Cloudflare** (`cloudflare`)
- Copy: Made a free Cloudflare theme for your code snippets. Your Worker `fetch` handler, in orange. https://www.cutecode.app
- Company: @cloudflare (source: x.com link on blog.cloudflare.com)
- Person: @eastdakota, Matthew Prince, co-founder and CEO (source: x.com link on his blog.cloudflare.com author page)
- Sample: real Worker code (`export default { fetch }`).

**14. Rabbit** (`rabbit`)
- FLAG: the preset is "Evil Rabbit", a hidden preset (`hidden: true`). The sample is a toy WASD movement function, not SDK code, and the name does not match rabbit.tech. Evil Rabbit is Vercel's mascot, so this is not a Rabbit (r1) brand post. Recommend skipping, or folding into the Vercel post.
- Copy (if used under Vercel): Made a free Evil Rabbit theme for your code snippets. https://www.cutecode.app
- Company: @vercel (see #1). rabbit.tech's own handle is @rabbit_hmi (twitter.com link on rabbit.tech), only relevant if this becomes a real Rabbit r1 preset.
- Person: UNVERIFIED

**15. OpenAI** (`openai`)
- Copy: Made a free OpenAI theme for your code snippets. Your Responses API call, ready to share. https://www.cutecode.app
- Company: @OpenAIDevs (source: x.com link on developers.openai.com); @OpenAI is the main account (press coverage, not an openai.com link, so treat as secondary)
- Person: @romainhuet, Romain Huet, Head of Developer Experience (source: GitHub profile bio, twitter.com link on his GitHub page)
- Sample: real SDK code (`client.responses.create`, `output_text`). Model id `gpt-6-astra` unchecked.

**16. Stripe** (`stripe`)
- Copy: Made a free Stripe theme for your code snippets. Your Checkout session code, in Stripe colors. https://www.cutecode.app
- Company: @stripe (source: x.com link on stripe.com/blog); developer account @stripedev (stripe.dev)
- Person: @patrickc, Patrick Collison, co-founder and CEO (source: twitter.com link on patrickcollison.com). Not devrel; for a devrel tag, UNVERIFIED.
- Sample: real SDK code (`stripe.checkout.sessions.create`).

**17. Gemini** (`gemini`)
- Copy: Made a free Gemini theme for your code snippets. Your `generateContent` call, ready to share. https://www.cutecode.app
- Company: @GeminiApp (source: twitter.com link on gemini.google); developer account @googleaidevs (GitHub org google-gemini, twitter field)
- Person: @OfficialLoganK, Logan Kilpatrick, Google DeepMind (source: GitHub profile, twitter field)
- Sample: real SDK code (`@google/genai` `models.generateContent`). Model id `gemini-3.8-flash` unchecked.

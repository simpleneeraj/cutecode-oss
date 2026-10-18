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
- **Link:** `cutecode.app/?theme=<id>` opens the editor on that preset. This needs building first; see Prep.

## Order
| # | Brand | Preset id | Restyled | Snippet idea |
|---|---|---|---|---|
| 1 | Vercel | vercel | yes | AI SDK `streamText` call |
| 2 | Supabase | supabase | yes | `supabase.from("todos").select()` |
| 3 | Claude | claude | yes | Messages API call |
| 4 | Resend | resend | no | `resend.emails.send` |
| 5 | Clerk | clerk | no | `clerkMiddleware()` |
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
| 16 | Stripe | stripe | no | Checkout session |
| 17 | Gemini | gemini | no | `generateContent` |

The giants (OpenAI, Stripe, Gemini) come last, once there is traction to point at.

## Cadence
One brand every 1-2 days. Restyle each unrestyled preset before its slot.

## Prep
- [ ] Owner verifies the restyled presets export cleanly in Chrome and Safari.
- [ ] Build the `?theme=<id>` deep link in the editor.
- [ ] Restyle the unrestyled brand presets in order, staying ahead of the posting schedule.
- [ ] Write post copy and a snippet for each brand.
- [ ] Find the X handle and one devrel/founder handle per brand. Verify every handle; don't guess.
- [ ] Schedule posts via Metricool.

## Track
After each post, log reposts, replies, profile visits and sign-ups. Double down on the formats that land.

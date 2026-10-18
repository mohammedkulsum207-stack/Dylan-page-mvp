import type { Story } from "../types";

const ago = (minutes: number) => new Date(Date.now() - minutes * 60 * 1000).toISOString();

// Editorial-style sample stories make the prototype feel populated. They are
// clearly identified as demo content and must be replaced/verified before launch.
export const DEMO_STORIES: Story[] = [
  {
    id: "world-energy-ai",
    headline: "The AI boom is creating a new fight over electricity",
    summary: "Data centres need enormous amounts of power. Governments and energy companies are now weighing how to meet demand without pushing up costs or emissions.",
    body: [
      "Artificial intelligence is moving from a software story to an infrastructure story. The systems behind chatbots, image tools and business automation run in data centres that need reliable electricity around the clock.",
      "That demand is prompting a difficult debate: how quickly can grids expand, which energy sources should supply the new load, and who ultimately pays for upgrades? The answer differs by country and by the age of its existing power network.",
      "The key question for readers is not simply whether AI uses more electricity. It is whether investment in generation, transmission and efficiency can keep pace with the technology being deployed."
    ],
    category: "Tech",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=85",
    source: "The Daily Drop Explainer Desk",
    publishedAt: ago(14),
    sources: [{ name: "International Energy Agency", url: "https://www.iea.org/topics/energy-and-ai", publishedAt: ago(14) }],
    isBreaking: true, views: 184320, likes: 12480, comments: 2140, shares: 3860
  },
  {
    id: "global-cost-living",
    headline: "Why the cost-of-living squeeze feels different in every country",
    summary: "Food, rent, transport and borrowing costs do not rise at the same speed everywhere. Here is what to watch when comparing household pressure across economies.",
    body: [
      "Inflation is often discussed as one number, but households experience it through a basket of everyday costs. A family that spends a large share of its income on food and transport can feel pressure even when headline inflation begins to cool.",
      "Interest rates, exchange rates, supply chains, housing availability and government policy all influence the final bill. That is why two countries can report similar inflation rates while people describe very different day-to-day realities.",
      "For a useful comparison, look at wage growth alongside prices, and separate one-off price jumps from costs that keep rising month after month."
    ],
    category: "Business",
    image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1200&q=85",
    source: "The Daily Drop Business Desk",
    publishedAt: ago(38),
    sources: [{ name: "International Monetary Fund", url: "https://www.imf.org/en/Topics/inflation", publishedAt: ago(38) }],
    views: 96410, likes: 7320, comments: 1180, shares: 1640
  },
  {
    id: "social-media-news",
    headline: "The news moves faster online. Verification still takes time.",
    summary: "Viral clips can reach millions before their location, date or context is established. A few checks can make the difference between a useful update and a misleading one.",
    body: [
      "A dramatic video can be genuine and still tell an incomplete story. It may be old footage, filmed somewhere else, edited to remove context or paired with a false caption.",
      "Before sharing, look for the original upload, check whether credible outlets independently confirm the claim, and compare visible details such as signs, weather and landmarks. A reverse image search can also reveal earlier versions of a clip.",
      "Responsible newsrooms explain what is confirmed, what remains uncertain and what evidence could change the picture. Speed matters, but accuracy is what earns trust over time."
    ],
    category: "World",
    image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=85",
    source: "The Daily Drop Verification Desk",
    publishedAt: ago(66),
    sources: [{ name: "Reuters Handbook of Journalism", url: "https://www.reuters.com/" , publishedAt: ago(66) }],
    isBreaking: true, views: 241870, likes: 21840, comments: 5210, shares: 8730
  },
  {
    id: "africa-mobile-money",
    headline: "Mobile money changed how people pay. The next challenge is trust.",
    summary: "Digital payments can make everyday transactions easier, but users still need clear fees, reliable service and strong protection against fraud.",
    body: [
      "Mobile money has made it possible for many people to send, receive and store value using a phone rather than relying only on cash or a traditional bank branch.",
      "As digital services expand, the next phase is about trust: transparent charges, quick dispute handling, secure account recovery and tools that help customers recognise scams. Convenience loses its value when people cannot understand a transaction or get help after a mistake.",
      "The strongest payment systems combine easy everyday use with safeguards that work quietly in the background."
    ],
    category: "Business",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=85",
    source: "The Daily Drop Africa Desk",
    publishedAt: ago(95),
    sources: [{ name: "World Bank — Digital Financial Inclusion", url: "https://www.worldbank.org/en/topic/financialinclusion", publishedAt: ago(95) }],
    views: 78220, likes: 6410, comments: 960, shares: 2230
  },
  {
    id: "climate-extreme-weather",
    headline: "Extreme weather is testing how prepared cities really are",
    summary: "Heat, flooding and pressure on water systems are turning urban planning into a practical question of public safety and resilience.",
    body: [
      "Cities concentrate people, homes, roads and essential services in a small area. That makes them engines of opportunity, but it also means a severe storm or heatwave can disrupt many parts of daily life at once.",
      "Preparedness includes drainage and shade, early-warning systems, reliable emergency communication, resilient power and plans for people most exposed to danger. Infrastructure choices made today can shape the impact of future events.",
      "Climate risks vary by location, so local data and practical preparation matter more than broad claims that every city faces the same threat."
    ],
    category: "World",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=85",
    source: "The Daily Drop Climate Desk",
    publishedAt: ago(132),
    sources: [{ name: "United Nations Environment Programme", url: "https://www.unep.org/topics/climate-action", publishedAt: ago(132) }],
    views: 110540, likes: 8930, comments: 1470, shares: 3050
  },
  {
    id: "creator-economy",
    headline: "The creator economy is growing up — and getting more competitive",
    summary: "Creators are building businesses around communities, memberships and products, while audiences are becoming more selective about what earns their attention.",
    body: [
      "Online creators are no longer limited to advertising revenue. Some combine sponsorships with memberships, events, merchandise, licensing and products built for a specific audience.",
      "That diversification can make a business more resilient, but it also raises expectations. Audiences notice when promotions overwhelm the content, and partners increasingly want clear evidence that a campaign reached the right people.",
      "The durable advantage is a relationship built on consistency and trust, not simply a large follower count."
    ],
    category: "Entertainment",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=85",
    source: "The Daily Drop Culture Desk",
    publishedAt: ago(178),
    sources: [{ name: "Reuters Institute for the Study of Journalism", url: "https://reutersinstitute.politics.ox.ac.uk/", publishedAt: ago(178) }],
    views: 153620, likes: 14200, comments: 3460, shares: 4180
  },
  {
    id: "phone-battery",
    headline: "Your phone battery is not just about capacity",
    summary: "Chip efficiency, screen brightness, signal strength and background activity can matter as much as the number printed on a battery specification sheet.",
    body: [
      "Battery life depends on the combined behaviour of hardware and software. A large battery helps, but an inefficient display, weak mobile signal or demanding background apps can drain it faster than expected.",
      "Adaptive brightness, software updates, sensible location permissions and checking battery usage can help users identify the biggest drains on their own device. Results vary by phone and how it is used.",
      "For buyers, independent testing across common tasks is usually more useful than comparing battery capacity alone."
    ],
    category: "Tech",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=85",
    source: "The Daily Drop Tech Desk",
    publishedAt: ago(225),
    sources: [{ name: "GSMA", url: "https://www.gsma.com/", publishedAt: ago(225) }],
    views: 87300, likes: 5970, comments: 830, shares: 1750
  },
  {
    id: "football-data",
    headline: "Football clubs are using data to find value beyond the biggest names",
    summary: "Recruitment teams increasingly combine video scouting with performance data, though numbers still need context from coaches and analysts.",
    body: [
      "Modern football recruitment can draw on passing networks, pressing actions, chance creation, movement and physical output to identify players who fit a team's style.",
      "Statistics do not remove uncertainty. A player's numbers can change with teammates, tactics, opposition and playing time, so analysts need to understand the situation behind each metric.",
      "The most useful approach combines data with live scouting and a clear idea of the role a club needs to fill."
    ],
    category: "Sports",
    image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=85",
    source: "The Daily Drop Sports Desk",
    publishedAt: ago(280),
    sources: [{ name: "FIFA Training Centre", url: "https://www.fifatrainingcentre.com/", publishedAt: ago(280) }],
    views: 206400, likes: 19200, comments: 6140, shares: 7320
  },
  {
    id: "online-scams",
    headline: "A convincing message can still be a scam: five warning signs",
    summary: "Urgency, unexpected links and requests for verification codes are common ways criminals try to take control of accounts.",
    body: [
      "Scam messages often imitate banks, delivery companies, employers or people you know. The wording may look polished, and the sender name alone is not proof that a message is genuine.",
      "Be cautious when a message demands immediate action, asks for a password or one-time code, requests an unusual payment, or directs you to a link you were not expecting. Contact the organisation through its official app or a number you already trust.",
      "If you have already shared a code or password, use the official service to secure the account promptly and contact your payment provider if money may be at risk."
    ],
    category: "Tech",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=85",
    source: "The Daily Drop Digital Safety Desk",
    publishedAt: ago(340),
    sources: [{ name: "Google Safety Center", url: "https://safety.google/", publishedAt: ago(340) }],
    views: 193400, likes: 16700, comments: 2830, shares: 11600
  },
  {
    id: "streaming-business",
    headline: "Streaming services are competing for attention, not just subscribers",
    summary: "With more entertainment options competing for the same hours in a day, discovery, pricing and exclusive programming shape the fight for viewers.",
    body: [
      "Subscription services compete in a crowded market where households can cancel, rotate or share plans depending on price and the shows they want to watch.",
      "That pushes platforms to think about more than new sign-ups. Retention, recommendations, release schedules, regional pricing and the cost of producing content all influence the business.",
      "For viewers, the practical question is which service consistently delivers enough value to justify its place in the monthly budget."
    ],
    category: "Entertainment",
    image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=1200&q=85",
    source: "The Daily Drop Culture Desk",
    publishedAt: ago(410),
    sources: [{ name: "Ofcom", url: "https://www.ofcom.org.uk/", publishedAt: ago(410) }],
    views: 126900, likes: 10400, comments: 2970, shares: 2890
  },
  {
    id: "urban-transport",
    headline: "The future of city transport may be decided by the last kilometre",
    summary: "Buses and trains move large numbers of people, but safe, affordable connections to the station often determine whether the whole journey works.",
    body: [
      "A transit network is only as useful as the journey people can actually complete. Long walks, unsafe crossings, unreliable feeder routes or confusing payment systems can make public transport difficult to use.",
      "Cities are testing different ways to connect neighbourhoods with major routes, including better sidewalks, cycling infrastructure, feeder buses and integrated ticketing.",
      "The best solution depends on local density, travel patterns and affordability. Small improvements at the start and end of a trip can have an outsized effect on access."
    ],
    category: "World",
    image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=85",
    source: "The Daily Drop City Desk",
    publishedAt: ago(485),
    sources: [{ name: "UN-Habitat", url: "https://unhabitat.org/topic/transport-and-mobility", publishedAt: ago(485) }],
    views: 68800, likes: 5210, comments: 740, shares: 1840
  },
  {
    id: "online-learning",
    headline: "Online learning works best when flexibility comes with structure",
    summary: "Digital courses widen access to skills, but progress depends on feedback, practice and a realistic plan — not just watching more videos.",
    body: [
      "Online learning lets people study around work, family and other responsibilities. The flexibility can make education more accessible, but it also places more responsibility on the learner to keep moving.",
      "Short study sessions, specific goals, active practice and timely feedback can help turn information into usable skills. Courses that include projects or assessments make it easier to see what has actually been learned.",
      "Before paying for a course, check its syllabus, instructor credentials, refund terms and whether the learning format matches your needs."
    ],
    category: "Tech",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=85",
    source: "The Daily Drop Future Desk",
    publishedAt: ago(560),
    sources: [{ name: "UNESCO — Education", url: "https://www.unesco.org/en/education", publishedAt: ago(560) }],
    views: 57900, likes: 4630, comments: 690, shares: 2010
  }
];

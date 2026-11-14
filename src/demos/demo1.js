export const demo1 = {
  id: "demo1",
  name: "Demo 1 — Inventory & Purchase Orders",
  description:
    "How three reference-CRM API endpoints become a working AI agent — configured in under 10 minutes, zero code.",
  status: "active",

  // ⭐ UPDATED: The Full-Screen Guide Data
  guide: {
    title: "Welcome to the Inventory & PO Demo",
    genericInfo: "In a busy kitchen, the person using the stock (Chef), ordering it (Manager), and approving the budget (Owner) are usually different people. This demo shows how Sageion AI bridges that gap by orchestrating your existing CRM APIs into a seamless conversation.",
    workflows: [
      {
        id: "wf-1",
        title: "Inventory Auto-Reorder Flow",
        description: "See how a simple AI chat can trigger a low-stock alert, generate a Purchase Order, and update inventory upon approval.",
        estimatedClicks: 4,
        steps: [
          {
            id: 1,
            title: "Prep the Demo (Simulate a Shortage)",
            instruction: "Let's create a problem to solve. Find 'Basmati Rice' in the inventory table, click 'Adjust', and pass -4 to push it below the safety threshold.",
            targetRoute: "/owner/inventory"
          },
          {
            id: 2,
            title: "The Kitchen Queries the AI",
            instruction: "Instead of navigating menus or checking spreadsheets, the chef simply asks the AI. Click the prompt below to inject it into the chat.",
            targetRoute: "/owner/inventory",
            samplePrompt: "Check the current stock level of rice"
          },
          {
            id: 3,
            title: "The Manager Approves the PO",
            instruction: "The AI detects the shortage, creates a pending Purchase Order, and drops an approval link in the chat. Click the link, review the details, and hit 'Approve'.",
            targetRoute: "/owner/inventory"
          },
          {
            id: 4,
            title: "The Magic is Done",
            instruction: "Look back at the inventory table. The stock for Basmati Rice has been automatically updated. All 3 CRM APIs chained together in one conversation.",
            targetRoute: "/owner/inventory"
          }
        ]
      }
      // ⭐ You can add more workflows here easily in the future, e.g.:
      // {
      //   id: "wf-2",
      //   title: "Running Tables & Discounts",
      //   description: "Apply loyalty discounts to running tables.",
      //   estimatedClicks: 2,
      //   steps: [ ... ]
      // }
    ]
  },

  buildWalkthrough: {
    title: "See how this agent was built",
    subtitle:
      "3 API endpoints selected, 2 branch mappings wired, 1 chain published. No editor, no CLI, no YAML.",
    videoUrl: null,
    videoPlaceholder:
      "YouTube walkthrough coming soon — drop the video URL in `demo.buildWalkthrough.videoUrl`",
    facts: [
      { label: "APIs used", value: "3 reference-CRM endpoints" },
      { label: "Chain steps", value: "3 nodes · 2 branches" },
      { label: "Build time", value: "~7 minutes" },
      { label: "Code written", value: "0 lines" },
    ],
    apis: [
      {
        method: "GET",
        path: "/inventory/:material_id",
        purpose: "Read live stock",
      },
      {
        method: "POST",
        path: "/purchase-orders",
        purpose: "Create pending PO",
      },
      {
        method: "PATCH",
        path: "/purchase-orders/:po_id/approve",
        purpose: "Approve & update stock",
      },
    ],
  },

  workflows: [
    {
      title: "View stock / low-stock alerts",
      content:
        "The agent calls the inventory endpoint with the ingredient the user names. Current quantity and the low-stock threshold come back, so the agent can flag a shortage in plain language before the kitchen runs dry.",
    },
    {
      title: "Raise a purchase order",
      content:
        "If stock is low, the agent maps the response into a PO payload — supplier, material, quantity, unit — and calls the purchase-orders endpoint. A real PO is created in the CRM, not a mock.",
    },
    {
      title: "Approve order & update inventory",
      content:
        "Once the supplier confirms, the agent calls the approve endpoint. The CRM marks the PO approved and increments stock in the same transaction. Three APIs, one conversation.",
    },
  ],

  moat: {
    eyebrow: "The structural advantage",
    headline:
      "Ship one agent. Every restaurant on your platform inherits it.",
    subhead:
      "One base configuration. Thousands of downstream tenants. Per-tenant overrides for the chains that want them — without forking the agent, without per-customer integration work, without an AI team.",
    scaleDiagram: {
      base: { count: "1", label: "base agent you maintain" },
      inherited: { count: "4,200", label: "restaurants inherit it automatically" },
      overrides: { count: "87", label: "chains pin custom overrides" },
      pushes: { count: "1 push", label: "updates all 4,113 downstream apps" },
    },
    pillars: [
      {
        step: "01",
        title: "Build once",
        body:
          "You build the agent against your CRM's APIs — chain editor, no code, ~7 minutes. One artifact to maintain forever.",
      },
      {
        step: "02",
        title: "Fan out",
        body:
          "Every restaurant, franchise location, and chain on your platform inherits the agent pre-scoped to their own tenant data. Day-one AI, zero per-customer setup.",
      },
      {
        step: "03",
        title: "Override per tenant",
        body:
          "Chains that want their own supplier list, thresholds, or auth get tenant-scoped config overrides — data, not code. The base agent stays single; variations stay isolated.",
      },
    ],
  },

  connectorsSection: {
    eyebrow: "When the workflow needs more than your APIs",
    headline: "The same runtime reaches the third-party services your customers already use.",
    subhead:
      "Your CRM's APIs handle the business core. But restaurant owners live in Google Sheets, order through WhatsApp, schedule shifts in Google Calendar, and dump inventory counts into spreadsheets. Sageion ships a connector framework so those services are first-class nodes in the same chain — not a separate automation tool bolted on later.",
    lead:
      "Connectors are opt-in. Attach one to a specific chain node, only where it makes sense. Two restaurants on your platform might use the exact same base agent — one fires a Slack notification on low stock, the other writes to their own Google Sheet. Same agent, different connector attachments, both managed from the same admin panel.",
    categories: [
      {
        icon: "📊",
        name: "Sheets & Docs",
        examples: "Google Sheets, Google Docs, Notion, Airtable",
        detail:
          "Sync inventory counts, write PO logs, or dump daily sales into a spreadsheet the owner already maintains.",
      },
      {
        icon: "📨",
        name: "Messaging",
        examples: "Slack, WhatsApp, Telegram, email",
        detail:
          "Notify a manager when an order is approved, or ping a supplier that stock is low — from inside the same chain that created the PO.",
      },
      {
        icon: "📅",
        name: "Calendar & Scheduling",
        examples: "Google Calendar, Outlook Calendar, Calendly",
        detail:
          "Book shifts, schedule supplier deliveries, or drop consultation slots for the manager — as a parallel action on an existing node.",
      },
      {
        icon: "🔗",
        name: "Custom Webhooks",
        examples: "Any HTTPS endpoint",
        detail:
          "Your CRM's own downstream services, or your customer's custom integrations. Same auth model, same scope, same audit trail.",
      },
    ],
    chaining: {
      title: "Connectors attach to nodes, not to the whole chain",
      body:
        "A connector fires as a parallel action when a specific chain node completes. It never blocks the main flow — a slow Slack API call doesn't delay the PO confirmation. Failures are logged to a dead-letter queue and the chain keeps going.",
      diagram: [
        { node: "POST /purchase-orders", status: "success", connector: "→ Slack: #ops-alerts" },
        { node: "PATCH /purchase-orders/:id/approve", status: "success", connector: "→ Google Sheets: append row" },
      ],
    },
    auth:
      "OAuth connections are per-app and tenant-scoped. Every restaurant's Google account stays isolated to that restaurant. You can see which chains have attached which connectors from the admin panel — one glance shows the full audit trail.",
    positioning:
      "This is why we're a runtime, not a framework. Lyzr, LangChain, and CrewAI give you connectors to your own tools. We give your customers connectors to theirs — as part of the same runtime that powers the core API chain.",
  },

  pitch: {
    oneLiner:
      "Vertical SaaS CRMs already own the data. Sageion turns their raw APIs into a distribution layer for AI.",
    whyNow:
      "Every vertical SaaS — Petpuja, Posist, Rista, and hundreds of others — is being asked by their customers to ship an AI layer on top of their existing product. Building that layer in-house means months of platform engineering and a new AI team. Sageion gives them that layer as a product: their APIs go in, an agent comes out — and every one of their customers inherits it on day one.",
  },

  purpose: {
    whatWeDo:
      "Sageion turns the APIs a vertical SaaS already exposes into a production-grade AI agent. Select your endpoints, wire the branches, publish. No SDK, no prompt engineering, no new infrastructure.",
    whyItMatters:
      "For a vertical SaaS vendor, every customer gets an AI assistant on day one — powered by the vendor's own data and APIs, governed by the vendor's own auth and scope rules. For the end restaurant, the CRM they already pay for suddenly talks back.",
  },

  capabilityAtScale: {
    heading: "What happens when the agent inherits 4,200 tenants",
    intro:
      "Once the base agent is inherited by every downstream tenant, the operational math changes. Here is what Sageion takes off your team's plate.",
    points: [
      {
        title: "Tenant isolation at the API boundary",
        body:
          "Every run is bound to a tenant identity, an app scope, and a per-app API key. Cross-tenant leakage isn't a policy the model has to respect — it's a boundary the runtime enforces before any request goes out.",
      },
      {
        title: "Your auth, your scopes, your governance",
        body:
          "OAuth connections, secondary auth flows, per-app API keys, and attached tenant-wide resources flow through Sageion's scope-attachment model unchanged. Your security posture is your security posture.",
      },
      {
        title: "Rollout with zero coordination cost",
        body:
          "Publishing a new version is one click. It propagates to every downstream tenant that hasn't pinned an override. Customized agents keep their customization; everyone else moves forward automatically.",
      },
      {
        title: "Operate one agent, not thousands",
        body:
          "You don't provision one AI stack per customer. You provision one agent per workflow and the platform fans it out. Support, observability, and upgrades stay centralized — same as your existing product.",
      },
    ],
  },

  crmAngle: {
    heading: "Built for vertical SaaS CRMs, not for one restaurant",
    intro:
      "Petpuja, Posist, Rista, and the hundreds of other vertical SaaS CRMs don't sell software to one restaurant — they sell infrastructure to thousands. Sageion is architected for that reality.",
    points: [
      {
        title: "Your APIs, unmodified",
        body:
          "Sageion consumes your existing REST endpoints — auth headers, path params, query strings, body payloads. Nothing is mocked, wrapped, or refactored.",
      },
      {
        title: "Your customers, individually",
        body:
          "Every app on your platform gets its own tenant-scoped agent. The same three APIs power a thousand distinct assistants without a thousand integration sprints.",
      },
      {
        title: "Your governance, preserved",
        body:
          "Per-app API keys, tenant-scoped auth configs, and OAuth connections flow through unchanged. Sageion never gets credentials it shouldn't.",
      },
      {
        title: "Your team, freed up",
        body:
          "No AI platform to build, no prompt engineering to maintain, no runtime to operate. The SaaS ships the feature; Sageion runs the underlying layer.",
      },
    ],
  },

  referenceCrm: {
    eyebrow: "Make it yours",
    heading: "This is a reference. Yours can look exactly like your product.",
    body:
      "We built this demo against Petpuja-shaped endpoints because they're a legible reference — but the shape of your CRM's APIs doesn't matter. Whatever surface you expose, whatever flow you have in mind, we implement it against your actual APIs.",
    offer:
      "Share sandbox credentials for the endpoints involved in one flow. We'll build, test, and hand back a working personalized demo of that flow running against your CRM within 7–14 days.",
    callout:
      "No commitment, no integration sprint, no AI team of your own. Just the demo — working, in your brand, with your real API responses.",
    footnote:
      "If it's the right fit after you've seen it live, we ship it as a production agent on the same 7–14 day cycle.",
  },
};
export const demo1 = {
  id: "demo1",
  name: "Inventory & Purchase Orders (Simple Flow)",
  description:
    "Configure one basic, high-value workflow in under 10 minutes with zero code: Chef asks for stock → AI creates PO → Manager approves.",
  status: "active",

  guide: {
    title: "Inventory Auto-Reorder Workflow",
    genericInfo: "In a busy kitchen, the person using the stock (Chef), ordering it (Manager), and approving the budget (Owner) are usually different people. This demo shows how Sageion AI bridges that gap by orchestrating your existing CRM APIs into a seamless conversation.",
    workflows: [
      {
        id: "wf-1",
        title: "Inventory Auto-Reorder Flow",
        description: "See how a simple AI chat can trigger a low-stock alert, generate a Purchase Order, and update inventory upon approval.",
        estimatedClicks: 4,
        setupRequired: true,
        steps: [
          {
            id: 1,
            title: "Prep the Demo (Simulate a Shortage)",
            instruction: "To trigger the workflow, we need 'Basmati Rice' to be below its threshold. You can either click 'Adjust' on the inventory table and pass '-4', OR simply click the Auto-Setup button below.",
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
    ]
  },

  buildWalkthrough: {
    title: "See how this agent was built",
    subtitle: "3 API endpoints selected, 2 branch mappings wired, 1 chain published. No editor, no CLI, no YAML.",
    videoUrl: "https://youtube.com/watch?v=8PYsM8IX-3g&feature=shared", // 👈 Your link is safely stored here
    videoPlaceholder: "YouTube walkthrough coming soon — drop the video URL in `demo.buildWalkthrough.videoUrl`",
    facts: [
      { label: "APIs used", value: "3 CRM endpoints" },
      { label: "Chain steps", value: "3 nodes · 2 branches" },
      { label: "Build time", value: "~7 minutes" },
      { label: "Code written", value: "0 lines" },
    ],
    apis: [
      { method: "GET", path: "/inventory/:material_id", purpose: "Read live stock" },
      { method: "POST", path: "/purchase-orders", purpose: "Create pending PO" },
      { method: "PATCH", path: "/purchase-orders/:po_id/approve", purpose: "Approve & update stock" },
    ],
  },

  workflows: [
    {
      title: "View stock / low-stock alerts",
      content: "The agent calls the inventory endpoint with the ingredient the user names. Current quantity and the low-stock threshold come back, so the agent can flag a shortage in plain language before the kitchen runs dry.",
    },
    {
      title: "Raise a purchase order",
      content: "If stock is low, the agent maps the response into a PO payload — supplier, material, quantity, unit — and calls the purchase-orders endpoint. A real PO is created in the CRM, not a mock.",
    },
    {
      title: "Approve order & update inventory",
      content: "Once the supplier confirms, the agent calls the approve endpoint. The CRM marks the PO approved and increments stock in the same transaction. Three APIs, one conversation.",
    },
  ],

  purpose: {
    whatWeDo: "The Old Way (Framework Trap): To build this, you'd normally need to hire an AI team, force your engineers to write wrapper code, generate a strict OpenAPI spec, and pray it doesn't break the next time you update your database schema.",
    whyItMatters: "The Sageion Way (The Runtime): We don't ask you to rewrite your product. We don't need an OpenAPI spec just to start. We ingest your existing endpoints as-is, and output a production-grade AI agent. You keep your code, your team, and your exact security posture — we just add the AI layer.",
  },

  moat: {
    eyebrow: "The structural advantage",
    headline: "You don't integrate AI. You inherit it.",
    subhead: "Every vertical SaaS vendor is being forced by their customers to ship an AI layer. Building it in-house (or using frameworks) means months of engineering, brittle code changes, and a new AI team. Sageion gives you that layer as a product: your APIs go in, an agent comes out — and every one of your customers inherits it on day one.",
    scaleDiagram: {
      base: { count: "1", label: "base agent you maintain" },
      inherited: { count: "4,200", label: "restaurants inherit it automatically" },
      overrides: { count: "87", label: "chains pin custom overrides" },
      pushes: { count: "1 push", label: "updates all 4,113 downstream apps" },
    },
    pillars: [
      {
        step: "01",
        title: "Lowest Friction to Start",
        body: "No SDK. No prompt engineering. No CLI. If your CRM has REST endpoints, you are 7 minutes away from a working agent. We don't need a perfect API spec to get started — we just need the URLs.",
      },
      {
        step: "02",
        title: "Zero Code to Maintain",
        body: "When your CRM updates, your AI shouldn't break. Because Sageion acts as a runtime (not a framework), it sits entirely outside your codebase. Change your database, add a field, ship a new UI — the agent adapts without a single line of code.",
      },
      {
        step: "03",
        title: "Effortless Fan-Out",
        body: "You don't provision one AI stack per customer. You provision one agent per workflow and the platform fans it out. 1 push updates all 4,200 downstream restaurants instantly.",
      },
    ],
  },

  pitch: {
    oneLiner:
      "Vertical SaaS CRMs already own the data. Sageion turns their raw APIs into an AI distribution layer.",
    whyNow:
      "Frameworks like LangChain or Lyzr require a massive engineering lift. They are built for developers to write code. Sageion is built for SaaS vendors to scale. The market doesn't want more AI frameworks that require rewrites and maintenance. It wants a frictionless runtime that makes their existing product talk.",
  },

  crmAngle: {
    heading: "Built for vertical SaaS CRMs, not for one restaurant",
    intro: "Petpuja, Posist, Rista, and the hundreds of other vertical SaaS CRMs don't sell software to one restaurant — they sell infrastructure to thousands. Sageion is architected for that reality without asking you to rewrite a single line of code.",
    points: [
      {
        title: "Your APIs, unmodified",
        body: "Sageion consumes your existing REST endpoints — auth headers, path params, query strings, body payloads. Nothing is mocked, wrapped, or refactored.",
      },
      {
        title: "Your customers, individually",
        body: "Every app on your platform gets its own tenant-scoped agent. The same three APIs power a thousand distinct assistants without a thousand integration sprints.",
      },
      {
        title: "Your governance, preserved",
        body: "Per-app API keys, tenant-scoped auth configs, and OAuth connections flow through unchanged. Sageion never gets credentials it shouldn't.",
      },
      {
        title: "Your team, freed up",
        body: "No AI platform to build, no prompt engineering to maintain, no runtime to operate. The SaaS ships the feature; Sageion runs the underlying layer.",
      },
    ],
  },

  capabilityAtScale: {
    heading: "What happens when the agent inherits 4,200 tenants",
    intro: "Once the base agent is inherited by every downstream tenant, the operational math changes. Here is what Sageion takes off your team's plate.",
    points: [
      {
        title: "Tenant isolation at the API boundary",
        body: "Every run is bound to a tenant identity, an app scope, and a per-app API key. Cross-tenant leakage isn't a policy the model has to respect — it's a boundary the runtime enforces before any request goes out.",
      },
      {
        title: "Your auth, your scopes, your governance",
        body: "OAuth connections, secondary auth flows, per-app API keys, and attached tenant-wide resources flow through Sageion's scope-attachment model unchanged. Your security posture is your security posture.",
      },
      {
        title: "Rollout with zero coordination cost",
        body: "Publishing a new version is one click. It propagates to every downstream tenant that hasn't pinned an override. Customized agents keep their customization; everyone else moves forward automatically.",
      },
      {
        title: "Operate one agent, not thousands",
        body: "You don't provision one AI stack per customer. You provision one agent per workflow and the platform fans it out. Support, observability, and upgrades stay centralized — same as your existing product.",
      },
    ],
  },

  connectorsSection: {
    eyebrow: "When the workflow needs more than your APIs",
    headline: "The same runtime reaches the third-party services your customers already use.",
    subhead: "Your CRM's APIs handle the business core. But restaurant owners live in Google Sheets, order through WhatsApp, schedule shifts in Google Calendar, and dump inventory counts into spreadsheets. Sageion ships a connector framework so those services are first-class nodes in the same chain — not a separate automation tool bolted on later.",
    lead: "Connectors are opt-in. Attach one to a specific chain node, only where it makes sense. Two restaurants on your platform might use the exact same base agent — one fires a Slack notification on low stock, the other writes to their own Google Sheet. Same agent, different connector attachments, both managed from the same admin panel.",
    categories: [
      { icon: "📊", name: "Sheets & Docs", examples: "Google Sheets, Google Docs, Notion, Airtable", detail: "Sync inventory counts, write PO logs, or dump daily sales into a spreadsheet the owner already maintains." },
      { icon: "📨", name: "Messaging", examples: "Slack, WhatsApp, Telegram, email", detail: "Notify a manager when an order is approved, or ping a supplier that stock is low — from inside the same chain that created the PO." },
      { icon: "📅", name: "Calendar & Scheduling", examples: "Google Calendar, Outlook Calendar, Calendly", detail: "Book shifts, schedule supplier deliveries, or drop consultation slots for the manager — as a parallel action on an existing node." },
      { icon: "🔗", name: "Custom Webhooks", examples: "Any HTTPS endpoint", detail: "Your CRM's own downstream services, or your customer's custom integrations. Same auth model, same scope, same audit trail." },
    ],
    chaining: {
      title: "Connectors attach to nodes, not to the whole chain",
      body: "A connector fires as a parallel action when a specific chain node completes. It never blocks the main flow — a slow Slack API call doesn't delay the PO confirmation. Failures are logged to a dead-letter queue and the chain keeps going.",
      diagram: [
        { node: "POST /purchase-orders", status: "success", connector: "→ Slack: #ops-alerts" },
        { node: "PATCH /purchase-orders/:id/approve", status: "success", connector: "→ Google Sheets: append row" },
      ],
    },
    auth: "OAuth connections are per-app and tenant-scoped. Every restaurant's Google account stays isolated to that restaurant. You can see which chains have attached which connectors from the admin panel — one glance shows the full audit trail.",
    positioning: "This is why we're a runtime, not a framework. Lyzr, LangChain, and CrewAI give you connectors to your own tools. We give your customers connectors to theirs — as part of the same runtime that powers the core API chain.",
  },

  referenceCrm: {
    eyebrow: "Make it yours",
    heading: "This is a reference. Yours can look exactly like your product.",
    body: "We built this demo against Petpuja-shaped endpoints because they're a legible reference — but the shape of your CRM's APIs doesn't matter. Whatever surface you expose, whatever flow you have in mind, we implement it against your actual APIs.",
    offer: "Share sandbox credentials for the endpoints involved in one flow. We'll build, test, and hand back a working personalized demo of that flow running against your CRM within 7–14 days.",
    callout: "No commitment, no integration sprint, no AI team of your own. Just the demo — working, in your brand, with your real API responses.",
    footnote: "If it's the right fit after you've seen it live, we ship it as a production agent on the same 7–14 day cycle.",
  },
};

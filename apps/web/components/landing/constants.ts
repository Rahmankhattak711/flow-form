export const PLANS = [
  {
    name: "Starter",
    price: "Free",
    period: "forever",
    description: "Perfect for personal projects and quick surveys.",
    features: [
      "Up to 3 forms",
      "100 responses / month",
      "Shareable public links",
      "Basic field types",
    ],
    cta: "Get Started",
    href: "/sign-up",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/ month",
    description: "For teams that need scheduling, branding, and scale.",
    features: [
      "Unlimited forms",
      "Unlimited responses",
      "Start & end date scheduling",
      "Priority support",
      "Export responses (CSV)",
    ],
    cta: "Start Pro Trial",
    href: "/sign-up",
    highlighted: true,
  },
  {
    name: "Business",
    price: "$49",
    period: "/ month",
    description: "Advanced controls for organizations at scale.",
    features: [
      "Everything in Pro",
      "Custom domains",
      "Team workspaces",
      "SSO & audit logs",
      "Dedicated success manager",
    ],
    cta: "Contact Sales",
    href: "/sign-up",
    highlighted: false,
  },
] as const;

export const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Use cases", href: "#use-cases" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
] as const;

export const STEPS = [
  {
    step: "01",
    title: "Create your form",
    description: "Add a title, description, and optional start and end dates to control when responses are accepted.",
  },
  {
    step: "02",
    title: "Build your fields",
    description: "Drag-free builder with text, email, select, radio, checkbox, date, and more — all in one workspace.",
  },
  {
    step: "03",
    title: "Publish & share",
    description: "One click to go live. Copy your public link and send it by email, chat, or embed it anywhere.",
  },
  {
    step: "04",
    title: "Collect responses",
    description: "Respondents submit without signing in. Track counts and performance from your dashboard.",
  },
] as const;

export const USE_CASES = [
  {
    title: "Customer feedback",
    description: "Post-purchase surveys and NPS forms with scheduled open windows.",
    tag: "Surveys",
  },
  {
    title: "Event registration",
    description: "Collect attendee details before your event starts and close automatically after.",
    tag: "Events",
  },
  {
    title: "Contact & support",
    description: "Professional intake forms that route inquiries with required fields.",
    tag: "Support",
  },
  {
    title: "Job applications",
    description: "Structured applications with file-ready fields and clear labels.",
    tag: "HR",
  },
  {
    title: "Lead capture",
    description: "High-converting signup forms with minimal friction for respondents.",
    tag: "Marketing",
  },
  {
    title: "Internal requests",
    description: "IT tickets, PTO requests, and team workflows with date-bound availability.",
    tag: "Operations",
  },
] as const;

export const STATS = [
  { value: "50K+", label: "Forms created" },
  { value: "2M+", label: "Responses collected" },
  { value: "99.9%", label: "Uptime" },
  { value: "<2s", label: "Avg. load time" },
] as const;

export const TESTIMONIALS = [
  {
    quote:
      "We replaced three tools with FlowForm. Scheduling start and end dates for our conference registration was a game changer.",
    author: "Sarah Chen",
    role: "Operations Lead, Northline Events",
  },
  {
    quote:
      "The public share link just works. Our clients fill forms without confusion — and we see responses in the dashboard instantly.",
    author: "Marcus Webb",
    role: "Founder, Webb Digital Studio",
  },
  {
    quote:
      "Clean builder, clear pricing, no bloat. Our marketing team ships new lead forms in under ten minutes.",
    author: "Elena Ruiz",
    role: "Head of Growth, Stackpath",
  },
] as const;

export const FAQ_ITEMS = [
  {
    question: "Do respondents need an account?",
    answer:
      "No. Anyone with your published link can open the form, fill it out, and submit — no sign-up required on their side.",
  },
  {
    question: "What are start and end dates for?",
    answer:
      "They define when your form accepts submissions. Before the start date or after the end date, respondents see that the form is not available.",
  },
  {
    question: "Can I edit a form after publishing?",
    answer:
      "Yes. Update title, description, dates, and fields anytime. Changes apply to new submissions; existing responses are kept.",
  },
  {
    question: "How do I share my form?",
    answer:
      "Publish the form from your dashboard, then copy the link (e.g. yoursite.com/f/your-form-id) and share it anywhere.",
  },
  {
    question: "Is there a free plan?",
    answer:
      "Yes. Starter is free forever with up to 3 forms and 100 responses per month — enough to try FlowForm with real projects.",
  },
  {
    question: "Can I export responses?",
    answer:
      "CSV export is included on Pro and Business plans. Starter users can view response counts in the dashboard.",
  },
] as const;

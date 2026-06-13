export interface FormTemplate {
  id: string;
  title: string;
  description: string;
  fields: Array<{
    label: string;
    labelKey: string;
    type: string;
    placeholder?: string;
    required: boolean;
    order: number;
    options?: string[];
  }>;
}

export const formTemplates: FormTemplate[] = [
  {
    id: "contact",
    title: "Contact Form",
    description: "Collect visitor info and messages.",
    fields: [
      { label: "Full name", labelKey: "full_name", type: "text", required: true, order: 1 },
      { label: "Email address", labelKey: "email", type: "email", required: true, order: 2 },
      { label: "Message", labelKey: "message", type: "textarea", required: true, order: 3 },
    ],
  },
  {
    id: "feedback",
    title: "Feedback Survey",
    description: "Ask customers how their experience was.",
    fields: [
      { label: "Name", labelKey: "name", type: "text", required: false, order: 1 },
      { label: "Email", labelKey: "email", type: "email", required: false, order: 2 },
      { label: "How would you rate us?", labelKey: "rating", type: "radio", required: true, order: 3, options: ["Excellent", "Good", "Okay", "Poor"] },
      { label: "Comments", labelKey: "comments", type: "textarea", required: false, order: 4 },
    ],
  },
  {
    id: "signup",
    title: "Event Signup",
    description: "Register attendees for your event.",
    fields: [
      { label: "Full name", labelKey: "full_name", type: "text", required: true, order: 1 },
      { label: "Email", labelKey: "email", type: "email", required: true, order: 2 },
      { label: "Phone number", labelKey: "phone", type: "phone", required: false, order: 3 },
      { label: "Sessions to attend", labelKey: "sessions", type: "checkbox", required: false, order: 4, options: ["Morning session", "Afternoon session", "Networking dinner"] },
    ],
  },
];

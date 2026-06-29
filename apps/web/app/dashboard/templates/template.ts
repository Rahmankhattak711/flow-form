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
    id: "job-application",
    title: "Job Application",
    description: "Collect applicant details and role preferences.",
    fields: [
      { label: "Full name", labelKey: "full_name", type: "text", required: true, order: 1 },
      { label: "Email", labelKey: "email", type: "email", required: true, order: 2 },
      { label: "Phone number", labelKey: "phone", type: "phone", required: true, order: 3 },
      { label: "Position applying for", labelKey: "position", type: "select", required: true, order: 4, options: ["Software Engineer", "Product Designer", "Marketing Manager", "Customer Support", "Other"] },
      { label: "Years of experience", labelKey: "experience_years", type: "number", required: true, order: 5, placeholder: "e.g. 3" },
      { label: "LinkedIn or portfolio URL", labelKey: "portfolio", type: "text", required: false, order: 6, placeholder: "https://" },
      { label: "Why do you want to join us?", labelKey: "motivation", type: "textarea", required: true, order: 7 },
    ],
  },
  {
    id: "course-enrollment",
    title: "Course Enrollment",
    description: "Enroll students in a class or workshop.",
    fields: [
      { label: "Student name", labelKey: "student_name", type: "text", required: true, order: 1 },
      { label: "Email", labelKey: "email", type: "email", required: true, order: 2 },
      { label: "Course", labelKey: "course", type: "select", required: true, order: 3, options: ["Introduction to Web Dev", "UI/UX Fundamentals", "Data Analytics 101", "Digital Marketing"] },
      { label: "Preferred start date", labelKey: "start_date", type: "date", required: false, order: 4 },
      { label: "Experience level", labelKey: "experience", type: "radio", required: true, order: 5, options: ["Beginner", "Intermediate", "Advanced"] },
    ],
  },
];

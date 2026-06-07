import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  timestamp,
  jsonb,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { z } from "zod";
import { formsTable } from "./form";

export const formFieldsTable = pgTable(
  "form_fields",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    formId: uuid("form_id")
      .references(() => formsTable.id, {
        onDelete: "cascade",
      })
      .notNull(),
    labelKey: text("label_key").notNull(),
    label: text("label").notNull(),
    type: text("type").notNull(),
    placeholder: text("placeholder"),
    required: boolean("required").default(false).notNull(),
    order: integer("order").notNull(),
    options: jsonb("options").$type<string[]>(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("form_fields_form_id_label_key_idx").on(table.formId, table.labelKey),
    index("form_fields_form_id_order_idx").on(table.formId, table.order),
  ],
);

export const FIELD_TYPES = [
  "text",
  "textarea",
  "email",
  "number",
  "phone",
  "select",
  "radio",
  "checkbox",
  "date",
] as const;

const labelKeySchema = z
  .string()
  .min(1, "Label key is required")
  .max(100, "Label key is too long")
  .regex(/^[a-z][a-z0-9_]*$/, "Label key must start with a letter and use lowercase letters, numbers, or underscores");

export const createFormFieldSchema = z
  .object({
    formId: z.uuid(),
    labelKey: labelKeySchema,
    label: z.string().min(1, "Label is required").max(100, "Label is too long"),
    type: z.enum(FIELD_TYPES),
    placeholder: z.string().max(255, "Placeholder is too long").optional(),
    required: z.boolean().optional(),
    order: z.number().int().min(0),
    options: z.array(z.string()).optional(),
  })
  .superRefine((data, ctx) => {
    const needsOptions = ["select", "radio", "checkbox"].includes(data.type);

    if (needsOptions) {
      if (!data.options || data.options.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["options"],
          message: "Options are required for this field type",
        });
      }
    }
  });

export type CreateFormFieldInput = z.infer<typeof createFormFieldSchema>;
export type SelectFormField = typeof formFieldsTable.$inferSelect;
export type InsertFormField = typeof formFieldsTable.$inferInsert;

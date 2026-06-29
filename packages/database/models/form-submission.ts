import { pgTable, uuid, timestamp, jsonb, index, text } from "drizzle-orm/pg-core";
import { formsTable } from "./form";

export type FormSubmissionAnswers = Record<string, string | string[]>;

export const formSubmissionsTable = pgTable(
  "form_submissions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    formId: uuid("form_id")
      .references(() => formsTable.id, {
        onDelete: "cascade",
      })
      .notNull(),
    answers: jsonb("answers").$type<FormSubmissionAnswers>().notNull(),
    paymentStatus: text("payment_status").default("pending").notNull(),
    paymentSessionId: text("payment_session_id"),
    submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  },
  (table) => [index("form_submissions_form_id_idx").on(table.formId)],
);

export type SelectFormSubmission = typeof formSubmissionsTable.$inferSelect;
export type InsertFormSubmission = typeof formSubmissionsTable.$inferInsert;

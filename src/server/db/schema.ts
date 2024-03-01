import { relations } from "drizzle-orm";
import {
  bigint,
  date,
  index,
  json,
  mysqlEnum,
  mysqlTableCreator,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/mysql-core";
import { type KPIs, Visitings } from "~/constants";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mysqlTable = mysqlTableCreator((name) => `hashind-project_${name}`);

export const customers = mysqlTable("customer", {
  id: bigint("id", {
    mode: "number"
  }).autoincrement().notNull().primaryKey(),
  first_name: varchar("first_name", { length: 255 }).notNull(),
  last_name: varchar("last_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone_no: varchar("phone_no", { length: 20 }).notNull(),
  dob: date("dob").notNull(),
  anniversary: date("aniversary").notNull(),
  created_at: timestamp("created_at", { mode: 'date', fsp: 6 }).defaultNow(),
}, (table) => ({
  email_unique: unique("email_unique").on(table.email),
  phone_no_unique: unique("phone_no_unique").on(table.phone_no),
  phone_no_index: index("phone_no_index").on(table.phone_no),
  created_at_index: index("created_at_index").on(table.created_at),
}));

export const customerRelations = relations(customers, ({ many }) => ({
  feedbacks: many(feedbacks)
}))

export const feedbacks = mysqlTable("feedback", {
  id: bigint("id", {
    mode: "number"
  }).autoincrement().notNull().primaryKey(),
  customer_id: bigint("customer_id", {
    mode: "number"
  }).notNull(),
  feedback: json("feedback").$type<Record<typeof KPIs[number], number>>().notNull(),
  visitingTime: mysqlEnum("visitingTime", Visitings).notNull(),
  created_at: timestamp("created_at", { mode: 'date', fsp: 6 }).defaultNow(),
}, (table) => ({
  customer_id_index: index("customer_id_index").on(table.customer_id),
  created_at_index: index("created_at_index").on(table.created_at),
}));


export const feedbackRelations = relations(feedbacks, ({ one }) => ({
  customer: one(customers, {
    fields: [feedbacks.customer_id],
    references: [customers.id]
  })
})); 
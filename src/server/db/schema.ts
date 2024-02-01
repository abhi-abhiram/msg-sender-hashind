import {
  date,
  mysqlTableCreator,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/mysql-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const mysqlTable = mysqlTableCreator((name) => `hashind-project_${name}`);

export const customers = mysqlTable("customer", {
  id: varchar("id", { length: 255 }).notNull().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone_no: varchar("phone_no", { length: 20 }).notNull(),
  image: varchar("image", { length: 255 }),
  dob: date("dob"),
  aniversary: date("aniversary"),
  created_at: timestamp("created_at", { mode: 'date', fsp: 6 }).defaultNow(),
}, (table) => ({
  email_unique: unique("email_unique").on(table.email),
  phone_no_unique: unique("phone_no_unique").on(table.phone_no),
}));

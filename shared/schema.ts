import { pgTable, text, serial, integer, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  location: text("location").notNull(),
  tourId: text("tour_id").notNull(),
  tourName: text("tour_name").notNull(),
  passengers: integer("passengers").notNull(),
  totalWeight: integer("total_weight").notNull(),
  leadPassengerName: text("lead_passenger_name").notNull(),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone").notNull(),
  preferredDate: text("preferred_date"),
  specialRequests: text("special_requests"),
  totalPrice: numeric("total_price", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("confirmed"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const bookingRelations = relations(bookings, ({ one }) => ({
  user: one(users, {
    fields: [bookings.contactEmail],
    references: [users.username],
  }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

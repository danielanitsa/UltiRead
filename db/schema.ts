import { pgTable, text , serial, timestamp} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
    id: serial("id"),
    email: text("email").notNull(),
    imageUrl: text("image_url").notNull(),
    externalUserId: text("external_user_id").unique(),
    username: text("username").unique(),
    createdAt: timestamp("created_at"),
    updatedAt: timestamp("updated_at")
})
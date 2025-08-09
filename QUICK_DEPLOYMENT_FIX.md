# Quick Fix for Ubuntu Server Deployment

You're seeing the default Nginx page because the application isn't deployed yet. Here's how to get your High Tide Aviation website running:

## Step 1: Deploy Application Files

SSH into your server and run these commands:

```bash
# Navigate to web directory
cd /var/www

# Clone your project (replace with your actual repository)
sudo git clone https://github.com/yourusername/hightide-aviation.git
sudo chown -R $USER:$USER hightide-aviation
cd hightide-aviation

# Install dependencies
npm install

# Add MySQL support
npm install mysql2 @types/mysql2
```

## Step 2: Configure Environment

```bash
# Create production environment file
cat > .env.production << 'EOF'
NODE_ENV=production
PORT=3000
DATABASE_URL=mysql://hightide_user:your_password@localhost:3306/hightide_aviation
EOF
```

## Step 3: Update for MySQL Production

Since you want MySQL in production, create the MySQL schema file:

```bash
cat > shared/schema-production.ts << 'EOF'
import { mysqlTable, text, int, timestamp, decimal } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const bookings = mysqlTable("bookings", {
  id: int("id").primaryKey().autoincrement(),
  location: text("location").notNull(),
  tourId: text("tour_id").notNull(),
  tourName: text("tour_name").notNull(),
  passengers: int("passengers").notNull(),
  totalWeight: int("total_weight").notNull(),
  leadPassengerName: text("lead_passenger_name").notNull(),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone").notNull(),
  preferredDate: text("preferred_date"),
  specialRequests: text("special_requests"),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
  status: text("status").notNull().default("confirmed"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contacts = mysqlTable("contacts", {
  id: int("id").primaryKey().autoincrement(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  bookings: many(bookings),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  user: one(users, { fields: [bookings.leadPassengerName], references: [users.username] }),
}));

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
}).extend({
  username: z.string().min(1),
  password: z.string().min(6),
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
  status: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;
EOF
```

Create MySQL database connection:

```bash
cat > server/db-production.ts << 'EOF'
import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from "@shared/schema-production";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

const connection = mysql.createConnection(process.env.DATABASE_URL);
export const db = drizzle(connection, { schema, mode: 'default' });
EOF
```

## Step 4: Build and Deploy

```bash
# Build the application
npm run build

# Set up database tables
npx drizzle-kit push --config=drizzle-mysql.config.ts
```

## Step 5: Configure PM2

```bash
# Install PM2 globally
sudo npm install -g pm2

# Create PM2 config
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'hightide-aviation',
    script: 'server/index.ts',
    interpreter: 'node',
    interpreter_args: '--loader tsx',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_file: '.env.production'
  }]
}
EOF

# Start the application
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Step 6: Configure Nginx

Replace the default Nginx configuration:

```bash
sudo tee /etc/nginx/sites-available/hightide-aviation << 'EOF'
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Remove default site and enable yours
sudo rm /etc/nginx/sites-enabled/default
sudo ln -s /etc/nginx/sites-available/hightide-aviation /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Step 7: Check Status

```bash
# Check if application is running
pm2 status

# Check application logs
pm2 logs hightide-aviation

# Check if port 3000 is listening
sudo netstat -tlnp | grep :3000

# Test local connection
curl http://localhost:3000
```

## Quick Troubleshooting

If you still see issues:

1. **Check PM2 Status**: `pm2 status`
2. **Check Logs**: `pm2 logs hightide-aviation`
3. **Check Port**: `sudo netstat -tlnp | grep :3000`
4. **Check Nginx**: `sudo nginx -t && sudo systemctl status nginx`

After following these steps, your High Tide Aviation website should be live at your domain!

## Alternative: Quick Test Without Domain

If you want to test immediately without configuring a domain:

```bash
# Stop nginx temporarily
sudo systemctl stop nginx

# Start your app on port 80 instead
PORT=80 pm2 start ecosystem.config.js

# Your site will be available directly at your server's IP
```

Then visit your server's IP address directly to see the website.
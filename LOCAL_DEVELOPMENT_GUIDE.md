# Local Development Setup

## Running the Application Locally

### Option 1: Using This Replit Environment (Recommended for Development)

The application is already running here! You can:

1. **View the live app**: Click the webview panel or visit the preview URL
2. **Edit code**: Make changes to any file and see live updates
3. **Test features**: The booking system and contact form work with the PostgreSQL database
4. **View logs**: Check the console tab for any errors

### Option 2: Set Up on Your Local Machine

If you want to run this on your own computer:

#### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (or use SQLite for development)
- Git

#### Installation Steps

1. **Clone the repository**:
```bash
git clone <your-repo-url>
cd hightide-aviation
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:
```bash
# Create .env file
cat > .env << 'EOF'
NODE_ENV=development
DATABASE_URL=postgresql://username:password@localhost:5432/hightide_dev
# Or for SQLite (easier for local development):
# DATABASE_URL=file:./dev.db
EOF
```

4. **Set up database**:
```bash
# Push schema to database
npm run db:push
```

5. **Start development server**:
```bash
npm run dev
```

6. **Open browser**: Visit `http://localhost:5000`

### Option 3: Quick SQLite Setup (No Database Installation)

For the easiest local development, use SQLite:

1. **Install SQLite driver**:
```bash
npm install better-sqlite3
```

2. **Create SQLite schema** (save as `shared/schema-sqlite.ts`):
```typescript
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const bookings = sqliteTable("bookings", {
  id: integer("id").primaryKey(),
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
  totalPrice: real("total_price").notNull(),
  status: text("status").notNull().default("confirmed"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const contacts = sqliteTable("contacts", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("new"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

// Export schemas and types
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertBookingSchema = createInsertSchema(bookings).omit({ id: true, createdAt: true });
export const insertContactSchema = createInsertSchema(contacts).omit({ id: true, createdAt: true, status: true });

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;
```

3. **Create SQLite database connection** (save as `server/db-sqlite.ts`):
```typescript
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from "@shared/schema-sqlite";

const sqlite = new Database('./dev.db');
export const db = drizzle(sqlite, { schema });
```

4. **Update environment**:
```bash
echo "DATABASE_URL=file:./dev.db" > .env
```

5. **Start development**:
```bash
npm run db:push
npm run dev
```

## Development Features

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run db:push` - Push database schema changes

### Development Tools
- **Hot Module Replacement**: Changes update instantly
- **TypeScript**: Full type checking
- **ESLint**: Code quality checks
- **Tailwind CSS**: Utility-first styling
- **React Query**: Data fetching and caching
- **React Hook Form**: Form validation

### Project Structure
```
├── client/src/          # Frontend React application
│   ├── components/      # Reusable UI components
│   ├── pages/          # Route components
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility functions
│   └── data/           # Static data and types
├── server/             # Backend Express application
│   ├── routes.ts       # API route definitions
│   ├── storage.ts      # Database operations
│   └── db.ts          # Database connection
├── shared/             # Shared types and schemas
└── package.json        # Dependencies and scripts
```

### API Endpoints
- `POST /api/bookings` - Create tour booking
- `GET /api/bookings` - List all bookings
- `GET /api/bookings/email/:email` - Get bookings by email
- `POST /api/contacts` - Submit contact form
- `GET /api/contacts` - List contact submissions

### Database Management
- **Development**: Uses PostgreSQL (or SQLite for local)
- **Production**: Uses MySQL on Ubuntu server
- **Schema**: Managed with Drizzle ORM
- **Migrations**: Use `npm run db:push` to sync schema

### Testing the Application

1. **Homepage**: View tour locations and information
2. **Booking Flow**: Click "Book a Tour" to test the booking system
3. **Contact Form**: Visit `/contact` to test form submission
4. **Responsive Design**: Test on different screen sizes

### Environment Variables

For development, create a `.env` file:

```bash
# Database (choose one)
DATABASE_URL=postgresql://user:pass@localhost:5432/hightide_dev  # PostgreSQL
# DATABASE_URL=file:./dev.db                                      # SQLite

# Server
NODE_ENV=development
PORT=5000
```

### Troubleshooting

**Port already in use**:
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
npm run dev
```

**Database connection errors**:
- Check DATABASE_URL in .env
- Ensure database server is running
- Run `npm run db:push` to create tables

**Build errors**:
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### VS Code Setup

Recommended extensions:
- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- Auto Rename Tag

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push to remote
git push origin feature/new-feature
```

## Quick Start Summary

**Fastest way to get started locally**:

1. Clone repo
2. `npm install`
3. `echo "DATABASE_URL=file:./dev.db" > .env`
4. `npm install better-sqlite3`
5. `npm run db:push`
6. `npm run dev`
7. Open `http://localhost:5000`

You'll have a fully working High Tide Aviation booking website running locally!
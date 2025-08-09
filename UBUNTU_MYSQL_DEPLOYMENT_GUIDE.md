# High Tide Aviation - Ubuntu Server Deployment with MySQL

This guide provides step-by-step instructions for deploying the High Tide Aviation tour booking website to an Ubuntu server with MySQL database.

## Prerequisites

- Ubuntu 20.04+ server with root access
- Domain name pointed to your server
- At least 2GB RAM and 20GB storage

## Step 1: Server Setup

### Update System
```bash
sudo apt update && sudo apt upgrade -y
```

### Install Required Software
```bash
# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MySQL Server
sudo apt install mysql-server -y

# Install Nginx
sudo apt install nginx -y

# Install PM2 for process management
sudo npm install -g pm2

# Install Git
sudo apt install git -y

# Install Certbot for SSL
sudo apt install certbot python3-certbot-nginx -y
```

## Step 2: MySQL Database Setup

### Secure MySQL Installation
```bash
sudo mysql_secure_installation
```
Follow prompts:
- Set root password: **Yes** (use a strong password)
- Remove anonymous users: **Yes**
- Disallow root login remotely: **Yes** 
- Remove test database: **Yes**
- Reload privilege tables: **Yes**

### Create Database and User
```bash
sudo mysql -u root -p
```

Run these MySQL commands:
```sql
-- Create database
CREATE DATABASE hightide_aviation;

-- Create user for application
CREATE USER 'hightide_user'@'localhost' IDENTIFIED BY 'your_strong_password_here';

-- Grant privileges
GRANT ALL PRIVILEGES ON hightide_aviation.* TO 'hightide_user'@'localhost';

-- Flush privileges
FLUSH PRIVILEGES;

-- Exit MySQL
EXIT;
```

## Step 3: Application Deployment

### Clone Repository
```bash
cd /var/www
sudo git clone https://github.com/yourusername/hightide-aviation.git
sudo chown -R $USER:$USER hightide-aviation
cd hightide-aviation
```

### Update Database Configuration for MySQL

Create MySQL schema file:
```bash
cat > shared/schema-mysql.ts << 'EOF'
import { mysqlTable, text, int, timestamp, decimal } from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

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

Update database connection for MySQL:
```bash
cat > server/db-mysql.ts << 'EOF'
import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import * as schema from "@shared/schema-mysql";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

const connection = mysql.createConnection(process.env.DATABASE_URL);
export const db = drizzle(connection, { schema, mode: 'default' });
EOF
```

Create MySQL-specific Drizzle config:
```bash
cat > drizzle-mysql.config.ts << 'EOF'
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './shared/schema-mysql.ts',
  out: './drizzle-mysql',
  dialect: 'mysql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
EOF
```

### Install Dependencies
```bash
npm install
npm install mysql2
npm install --save-dev @types/mysql2
```

### Environment Configuration
```bash
cat > .env.production << 'EOF'
NODE_ENV=production
PORT=3000
DATABASE_URL=mysql://hightide_user:your_strong_password_here@localhost:3306/hightide_aviation
EOF
```

### Build Application
```bash
npm run build
```

### Database Migration
```bash
npx drizzle-kit push --config=drizzle-mysql.config.ts
```

### Update Production Scripts
Add to package.json scripts:
```json
{
  "scripts": {
    "start:production": "NODE_ENV=production node dist/index.js",
    "build:production": "npm run build && NODE_ENV=production node server/index.ts",
    "db:push:mysql": "drizzle-kit push --config=drizzle-mysql.config.ts"
  }
}
```

## Step 4: Process Management with PM2

### Create PM2 Configuration
```bash
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'hightide-aviation',
    script: 'server/index.ts',
    interpreter: 'node',
    interpreter_args: '--loader tsx',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_file: '.env.production',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}
EOF
```

### Create Logs Directory
```bash
mkdir logs
```

### Start Application with PM2
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Step 5: Nginx Configuration

### Create Nginx Configuration
```bash
sudo tee /etc/nginx/sites-available/hightide-aviation << 'EOF'
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login:10m rate=1r/s;

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
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # API rate limiting
    location /api/ {
        limit_req zone=api burst=20 nodelay;
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

    # Static file caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        proxy_pass http://localhost:3000;
    }

    # Security: Block common attack patterns
    location ~ /\. {
        deny all;
    }
    
    location ~ ^/(wp-|admin|config|uploads/) {
        deny all;
    }
}
EOF
```

### Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/hightide-aviation /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Step 6: SSL Certificate

### Install SSL Certificate
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Auto-renewal Test
```bash
sudo certbot renew --dry-run
```

## Step 7: Firewall Setup

```bash
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
```

## Step 8: Monitoring and Maintenance

### View Application Logs
```bash
pm2 logs hightide-aviation
```

### Monitor Application
```bash
pm2 monit
```

### Restart Application
```bash
pm2 restart hightide-aviation
```

### Update Application
```bash
git pull origin main
npm install
npm run build
pm2 restart hightide-aviation
```

### MySQL Monitoring
```bash
# Check MySQL status
sudo systemctl status mysql

# Monitor MySQL processes
sudo mysqladmin -u root -p processlist

# Check database size
mysql -u hightide_user -p -e "SELECT table_schema AS 'Database', ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)' FROM information_schema.tables WHERE table_schema = 'hightide_aviation';"
```

## Step 9: Backup Strategy

### Database Backup Script
```bash
cat > /home/$USER/backup-db.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/$USER/backups"
mkdir -p $BACKUP_DIR

# MySQL backup
mysqldump -u hightide_user -pyour_strong_password_here hightide_aviation > $BACKUP_DIR/hightide_aviation_$DATE.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "hightide_aviation_*.sql" -mtime +7 -delete

echo "Database backup completed: hightide_aviation_$DATE.sql"
EOF

chmod +x /home/$USER/backup-db.sh
```

### Schedule Daily Backups
```bash
crontab -e
# Add this line for daily backup at 2 AM:
0 2 * * * /home/$USER/backup-db.sh
```

## Step 10: Performance Optimization

### MySQL Optimization
```bash
sudo tee -a /etc/mysql/mysql.conf.d/mysqld.cnf << 'EOF'

# Performance tuning
innodb_buffer_pool_size = 1G
innodb_log_file_size = 256M
innodb_flush_log_at_trx_commit = 2
innodb_flush_method = O_DIRECT
query_cache_type = 1
query_cache_size = 256M
max_connections = 200
EOF

sudo systemctl restart mysql
```

### Node.js Process Optimization
Update ecosystem.config.js:
```javascript
module.exports = {
  apps: [{
    name: 'hightide-aviation',
    script: 'server/index.ts',
    interpreter: 'node',
    interpreter_args: '--loader tsx --max-old-space-size=1024',
    instances: 'max',
    exec_mode: 'cluster',
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_file: '.env.production'
  }]
}
```

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   ```bash
   # Check MySQL status
   sudo systemctl status mysql
   
   # Check MySQL logs
   sudo tail -f /var/log/mysql/error.log
   
   # Test connection
   mysql -u hightide_user -p hightide_aviation
   ```

2. **Application Won't Start**
   ```bash
   # Check PM2 logs
   pm2 logs hightide-aviation
   
   # Check environment variables
   pm2 env 0
   
   # Restart application
   pm2 restart hightide-aviation
   ```

3. **Nginx Issues**
   ```bash
   # Check Nginx status
   sudo systemctl status nginx
   
   # Check Nginx logs
   sudo tail -f /var/log/nginx/error.log
   
   # Test configuration
   sudo nginx -t
   ```

4. **SSL Certificate Issues**
   ```bash
   # Check certificate status
   sudo certbot certificates
   
   # Renew certificate
   sudo certbot renew
   ```

### Performance Monitoring

```bash
# System resources
htop

# Disk usage
df -h

# MySQL performance
mysqladmin -u root -p status

# PM2 monitoring
pm2 monit
```

## Security Checklist

- ✅ MySQL root password set
- ✅ Database user with limited privileges
- ✅ Firewall configured
- ✅ SSL certificate installed
- ✅ Nginx security headers
- ✅ Rate limiting configured
- ✅ Regular backups scheduled
- ✅ System updates automated

## Contact Information

For technical support:
- GitHub: [Repository Issues](https://github.com/yourusername/hightide-aviation/issues)
- Email: admin@yourdomain.com

## Deployment Checklist

Before going live:

1. ✅ Server configured and hardened
2. ✅ MySQL database created and secured
3. ✅ Application deployed and tested
4. ✅ SSL certificate installed
5. ✅ Firewall configured
6. ✅ Backups scheduled
7. ✅ Monitoring set up
8. ✅ Performance optimized
9. ✅ Contact form tested
10. ✅ Booking system tested

Your High Tide Aviation website is now ready for production!
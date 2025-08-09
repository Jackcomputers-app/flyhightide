## High Tide Website improvements


This is the reop for the HTA webiste improvements. 

How do run Dev verson on Ubuntu 24.04

1. Update System

```bash

sudo apt update&&sudo apt upgrade

```

 2. Install Node JS

```bash

curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

```

3. Install git

```bash 

sudo apt install git

```

4. Verify Install of dependencies

```bash

node --version  # Should be 18+
npm --version
git --version

```

5. Install using PostgreSQL

```bash
sudo apt install postgresql postgresql-contrib
```

6. Start PostreSQL 
```bash

sudo systemctl start postgresql
sudo systemctl enable postgresql

```

7. Create database and user
```bash
sudo -u postgres psql -c "CREATE DATABASE hightide_dev;"
sudo -u postgres psql -c "CREATE USER your_username WITH PASSWORD 'your_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE hightide_dev TO your_username;"
```

8. Save info to a .env file

```bash

cat > .env << 'EOF'
NODE_ENV=development
DATABASE_URL=postgresql://your_username:your_password@localhost:5432/hightide_dev
EOF

```

9. Install additional required dependencies

```bash 

npm install
npm install dotenv
npm run db:push
```
10. Run the program in dev mode

```bash
npm run dev
```
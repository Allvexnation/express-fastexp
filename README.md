# Express Instant

A powerful CLI tool designed to make backend development easier by automating the creation of Express.js projects.

## Features

- 🚀 Auto-generate project structure
- 📦 Support for JavaScript & TypeScript
- 🗄️ Multiple database options (MySQL, SQLite, MongoDB, Supabase)
- ☁️ Cloud storage integration (Cloudinary)
- 🔗 Path alias configuration (@, /, or none)
- 🔒 Pre-configured middleware & auth (cors, bcrypt, jsonwebtoken)
- ⚡ Beautiful loading spinners with colors and animations
- 🎯 CLI argument support for quick project creation and startup

## Installation

```bash
npm install -g express-instant
```

Or use with npx:

```bash
npx express-instant
```

## Usage

### Interactive Mode

Run the CLI without arguments to enter interactive mode:

```bash
express-instant
```

This will display the main menu with options:
1. Create new project
2. Start a project
3. Credits
4. Exit

### CLI Commands

#### Create a New Project

**Basic usage:**
```bash
express-instant create [project-name]
```
This auto-selects "Create new project" and skips the project name prompt, going directly to language selection.

**With language:**
```bash
express-instant create [project-name] [language]
```
Skips both project name and language prompts.

**Language options:**
- `ts` or `typescript` - TypeScript
- `js` or `javascript` - JavaScript

**Examples:**
```bash
# Create project with name only (prompts for language)
express-instant create my-project

# Create TypeScript project
express-instant create my-project ts

# Create JavaScript project
express-instant create my-project js
```

#### Start a Project

**Basic usage:**
```bash
express-instant start [path]
```
Auto-selects "Start a project" and skips the project path prompt, going directly to package manager selection.

**With all options:**
```bash
express-instant start [path] [package-manager] [command]
```
Skips all prompts and directly runs the project.

**Package manager options:**
- `bun` or `1` - Bun
- `npm` or `2` - npm

**Examples:**
```bash
# Start with path only (prompts for package manager and command)
express-instant start ./my-project

# Start with Bun
express-instant start ./my-project bun "npm run dev"

# Start with npm
express-instant start ./my-project npm "nodemon"

# Start with custom command
express-instant start ./my-project bun "bun run index.js"
```

## Project Configuration

When creating a new project interactively, you'll be prompted for:

1. **Project Name** - Name of your project folder
2. **Install Express** - Whether to install Express and dependencies
3. **Language** - JavaScript or TypeScript
4. **Path Alias Style** (if Express is installed):
   - `@` (e.g., @/controllers, @/models)
   - `/` (e.g., /controllers, /models)
   - None
5. **Package Manager** (if Express is installed):
   - Bun
   - npm
6. **Database**:
   - SQL (MySQL)
   - SQLite
   - MongoDB
   - Supabase
   - None
7. **Storage**:
   - Cloudinary
   - None

## Project Structure

After creation, your project will have the following structure:

```
my-project/
├── config/
│   ├── jwt.js/ts
│   ├── sql.js/ts (if SQL selected)
│   ├── sqlite.js/ts (if SQLite selected)
│   ├── mongodb.js/ts (if MongoDB selected)
│   ├── supabase.js/ts (if Supabase selected)
│   └── cloudinary.js/ts (if Cloudinary selected)
├── models/
│   └── model.js/ts
├── middleware/
│   └── middleware.js/ts
├── controllers/
│   └── controller.js/ts
├── routes/
│   └── route.js/ts
├── templates/
│   └── start.js/ts
├── .env
├── .env.example
├── .gitignore
├── nodemon.json
├── package.json
├── index.js/ts
└── tsconfig.json (if TypeScript selected)
```

## Included Packages

When Express is installed, the following packages are automatically included:

- **express** - Web framework
- **dotenv** - Environment variable management
- **nodemon** - Auto-restart on file changes
- **cors** - Cross-Origin Resource Sharing
- **bcrypt** - Password hashing
- **jsonwebtoken** - JWT authentication

Additional packages based on your choices:
- **module-alias** - Path alias support (JavaScript with @ or /)
- **typescript**, **tsx**, **@types/node**, **@types/express** - TypeScript support
- **mysql2** - MySQL database
- **better-sqlite3** - SQLite database
- **mongoose** - MongoDB database
- **@supabase/supabase-js** - Supabase database
- **cloudinary**, **multer** - Cloud storage

## Starting Your Project

After creating a project, you can start it in two ways:

### Option 1: Use the CLI
```bash
express-instant start ./my-project bun "npm run dev"
```

### Option 2: Manual start
```bash
cd my-project
npm run dev  # or bun run dev
```

The server will start at `http://localhost:3000` by default.

## Environment Variables

Edit the `.env` file to configure your project:

```env
PORT=3000
NODE_ENV=development

# Database (based on your selection)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=your_database
DB_USER=root
DB_PASSWORD=

# Or for SQLite
SQLITE_PATH=./database.sqlite

# Or for MongoDB
MONGODB_URI=mongodb://127.0.0.1:27017/your_database

# Or for Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Storage (if Cloudinary selected)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Credits

**Created by Jhon Ladines**

- Website: https://www.jhonladines.top/
- Repository: https://github.com/Allvexnation/express-instant

## License

MIT

---

**Express Instant** - No more manually creating folders, files, and packages! 🚀

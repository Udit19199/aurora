Aurora - AI Planner


Aurora is a next-generation productivity assistant that transforms your goals into actionable plans. Simply provide a goal and a deadline, and Aurora will:
	•	Break the goal into manageable tasks
	•	Schedule and prioritize them in your todo list
	•	Track your progress in real-time
	•	Continuously adapt and optimize your plan based on your completion patterns

Built for efficiency, Aurora goes beyond traditional task managers by combining automation, intelligent planning, and progress tracking to keep you focused and productive.

Whether you’re managing personal projects or complex professional goals, Aurora ensures you always know what to do next—helping you achieve more with less friction.

### Apps and Packages

- `apps/api`: The main API for Aurora.
- `packages/database`: Prisma schema and client for database access.
- `packages/config-eslint`: Shared ESLint configurations.
- `packages/config-typescript`: Shared TypeScript configurations.

Each package is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This monorepo is configured with the following tools:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
- [Prisma](https://prisma.io/) as the ORM for a PostgreSQL database.
- [pnpm](https://pnpm.io/) as the package manager.

## Getting Started

Follow these steps to set up and run the Aurora API.

### 1. Set up Environment Variables

You will need a PostgreSQL database. We recommend using a free project from [Supabase](https://supabase.com).

1.  Create a new Supabase project.
2.  Navigate to **Project Settings > Database**.
3.  Under **Connection string**, copy the `Prisma` URI.
4.  Create a `.env` file in the root of this project.
5.  Add the `DATABASE_URL` variable with the URI you copied:

```bash
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[HOST]:5432/postgres"
```

### 2. Install Dependencies

Install the necessary dependencies using `pnpm`:

```sh
pnpm install
```

### 3. Run Database Migrations

Apply the schema to your database by running the migration command:

```sh
pnpm db:migrate:dev
```

This will set up the `User`, `Goal`, and `Task` tables.

### 4. Start the Development Server

To start the API server, run:

```sh
pnpm dev
```

The API will be running and accessible for development.


## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.com/docs/reference/configuration)
- [CLI Usage](https://turborepo.com/docs/reference/command-line-reference)

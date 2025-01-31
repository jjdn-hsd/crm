# React CRM

A modern Customer Relationship Management (CRM) application built with React, TypeScript, and Supabase.

## Features

- User authentication and role-based access control
- Customer database management
- Contact tracking and communication history
- Deal/opportunity pipeline management
- Dashboard with key metrics and analytics
- Real-time updates using Supabase subscriptions
- File upload capabilities
- Search and filtering
- Data export functionality
- Responsive design

## Tech Stack

- React 18+
- TypeScript
- Ant Design
- React Router
- React Hook Form
- Supabase
- Vite
- Vitest for testing

## Prerequisites

- Node.js 16+
- npm or yarn
- Supabase account

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a Supabase project and get your project URL and anon key

4. Create a `.env` file in the root directory with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

5. Run the database migrations:
   - Copy the SQL from `supabase/migrations/create_initial_schema.sql`
   - Run it in your Supabase SQL editor

6. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── contexts/       # React contexts
├── hooks/          # Custom hooks
├── lib/           # Utility functions and configurations
├── pages/         # Page components
├── routes/        # Route configurations
├── types/         # TypeScript type definitions
└── utils/         # Helper functions
```

## Testing

Run the test suite:

```bash
npm run test
```

## Building for Production

```bash
npm run build
```

## License

MIT
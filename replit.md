# High Tide Aviation - Tour Booking Website Redesign

## Overview

This is a prototype of a redesigned tour booking website for High Tide Aviation, an aviation company offering scenic helicopter and airplane tours across three locations: Southport NC, St Simons Island GA, and Wilmington NC. The project addresses key usability complaints by implementing a clean, intuitive booking flow with clear step-by-step progression and prominent constraint visibility.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for development and production builds
- **Styling**: Tailwind CSS with custom coastal color palette
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Routing**: Wouter for client-side routing
- **State Management**: React hooks for local state, TanStack Query for server state
- **Icons**: Lucide React icons

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **Development**: TSX for TypeScript execution
- **Storage**: In-memory storage implementation (MemStorage class)
- **Database**: Configured for PostgreSQL with Drizzle ORM (production-ready)

## Key Components

### Design System
- **Component Library**: shadcn/ui with "new-york" style variant
- **Color Scheme**: Coastal theme with ocean blues, sandy beiges, and soft grays
- **Typography**: Clean, readable fonts optimized for accessibility
- **Layout**: Mobile-first responsive design with collapsible sections

### Booking Flow Components
1. **BookingModal**: Main booking interface with 4-step progression
2. **ProgressBar**: Visual step indicator with labeled progress
3. **LocationCard**: Display cards for tour locations
4. **TourCard**: Individual tour selection with constraints and pricing
5. **TestimonialCard**: Trust-building customer testimonials

### Navigation & Layout
- **Sticky Navigation**: Always-visible "Book a Tour" button
- **Mobile Menu**: Hamburger menu for mobile devices
- **Collapsible Sections**: Expandable content areas for About, FAQs, etc.

## Data Flow

### Booking Process
1. **Step 1**: Location selection from available venues
2. **Step 2**: Tour selection with constraint validation
3. **Step 3**: Passenger information collection
4. **Step 4**: Payment confirmation (mocked interface)

### State Management
- **useBooking Hook**: Centralized booking state management
- **Form Validation**: Real-time constraint checking
- **Progress Tracking**: Step-by-step navigation with validation gates

### Data Models
- **Tour Interface**: Includes pricing, duration, passenger limits, weight constraints for three locations
- **Location Interface**: Tour venue information and available tours for Southport NC, St Simons Island GA, and Wilmington NC
- **Booking State**: Complete booking flow state management with three-location support
- **Database Schema**: PostgreSQL tables for users and bookings with Drizzle ORM

## External Dependencies

### Core Libraries
- **React Ecosystem**: React DOM, React Query for data fetching
- **UI Framework**: Radix UI primitives, class-variance-authority for styling
- **Form Handling**: React Hook Form with Zod validation
- **Utilities**: date-fns for date manipulation, clsx for conditional classes

### Development Tools
- **Build Tools**: Vite, esbuild for production builds
- **Type Checking**: TypeScript with strict configuration
- **Database**: Drizzle ORM with PostgreSQL dialect
- **Development**: Replit-specific plugins for development environment

## Deployment Strategy

### Build Process
- **Development**: Hot module replacement with Vite dev server
- **Production**: Static asset generation with server-side rendering setup
- **Server**: Express.js serving both API and static files

### Environment Configuration
- **Database**: PostgreSQL connection via DATABASE_URL environment variable
- **Static Assets**: Vite builds to dist/public directory
- **Server Bundle**: esbuild creates optimized server bundle

### Mobile Optimization
- **Responsive Design**: Mobile-first approach with breakpoint-based layouts
- **Touch Interface**: Large buttons and touch-friendly interactions
- **Performance**: Optimized asset loading and minimal JavaScript bundle

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- July 07, 2025. Initial setup
- July 11, 2025. Added PostgreSQL database with Drizzle ORM for booking persistence
- July 11, 2025. Added third location (Wilmington, NC) with 5 new tours from PDF content
- July 11, 2025. Updated UI to support three-location grid layout and booking flow
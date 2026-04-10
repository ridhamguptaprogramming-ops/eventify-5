# Refined Project Prompt

Build a fully responsive event attendance platform for a college fest, campus function, or innovation summit.

The experience should feel premium and modern, with a startup-style landing page, polished glassmorphism cards, smooth animations, dark mode, and clear visual hierarchy.

## Product goals

- Create excitement around the event with a cinematic landing page
- Make signup, email verification, and event registration feel simple and trustworthy
- Give attendees a clear post-login dashboard with their QR pass and registration status
- Provide admins with a clean panel to review users and mark attendance
- Keep the stack practical and production-friendly using HTML, CSS, JavaScript, Node.js, Express, MongoDB, JWT auth, and Nodemailer

## Pages and sections

- Landing page with hero section, animated stats, CTAs, and event overview
- Event details section with schedule, venue, speaker lineup, and FAQs
- Registration flow with email signup, login, and attendance registration
- User dashboard after login with profile info, registration card, QR pass, and attendance status
- Admin panel with summary metrics, user list, registration list, and attendance check-in controls

## Frontend design direction

- Use glassmorphism, layered gradients, soft shadows, and strong typography
- Support both light and dark themes with a manual toggle
- Add responsive layouts for desktop, tablet, and mobile
- Add interaction polish:
  - ripple and scale animations on buttons
  - hover lift and color transitions on cards and links
  - reveal animations on scroll
  - smooth page transitions and loading states

## Backend requirements

- Email/password signup and login
- JWT-based authentication for protected pages and API routes
- Email verification using a one-time token
- MongoDB data layer for users and registrations
- Secure admin-only routes for attendance and reporting

## Database entities

- User: name, email, password hash, college, role, verified status
- EventRegistration: attendee profile, ticket type, attendance status, QR token, and timestamps

## Recommended extras

- Rate limiting on auth routes
- Security headers with Helmet
- Input validation with express-validator
- Toast notifications and skeleton loaders
- Resend verification email flow
- Admin access controlled by environment-defined email allowlist

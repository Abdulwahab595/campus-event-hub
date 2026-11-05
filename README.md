# Campus Event Hub

A Web Programming semester project for browsing and managing university events.

Group members: Abdul Wahab and Umair Maqsood, Section 7A.

## Run locally

    npm install
    npm run dev

Open the local address printed in the terminal.

## Current progress

- React application created with Vite.
- Basic navigation and routes connected using React Router.
- Redux Toolkit store with two sample events.
- Event cards showing the sample events, categories, descriptions, dates and venues.
- Event details pages linked from each event card.
- Title search and category/date filters that work together, with a clear-filters button.
- No-results feedback and an event-not-found page for unavailable events.
- Simple layout using plain CSS.
- Registration and login forms with required fields and password confirmation.
- In-memory demo accounts managed using Redux Toolkit.
- Six-digit demo verification codes, resend, verified-only login and logout.
- Navigation shows the logged-in user's name and role.

The My Registrations and organizer pages currently contain placeholder text.
Event registration, organizer event management and full page-access checks are later tasks.

## Browse events

Search by event title, choose a category or select an exact event date. The date
filter uses Pakistan time (PKT), matching the times shown on the event cards.
The filters work together. Choose Clear filters to show all events again.
Choose View details on a card to see the event's full information.

## Demo account flow

Register with made-up details and a dummy password. The verification page shows
a six-digit demo code. An unverified account cannot log in. Resend generates a
new code; after verification, log in to see the appropriate navigation and log out.

Accounts and login state exist only in memory and reset on a full page reload.
Dummy passwords are held in demo state only. There is no real email delivery,
JWT authentication, secure server-side authorization or database integration yet.
These remain requirements for the final project. Use only sample details here.

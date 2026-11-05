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
- Organizer dashboard with a sample-event list and create/edit form previews.
- Verified Students can register for events from their details pages.
- My Registrations shows only the current Student's events, with duplicate registration blocked.

Organizer save/delete actions, organizer ownership checks, browser persistence
and the remaining page-access checks are later tasks.

## Student event registration

Register, verify and log in using a Student demo account. Open an event's details
and choose Register for event. The button changes to Already registered and is
disabled, and the event appears in My Registrations. Each Student sees their own
events; the same event cannot be registered twice by the same Student.

Guests are asked to log in, and Organizer accounts cannot register as Students.
Registrations currently exist only in Redux memory and reset on a full reload.

## Organizer form previews

Register, verify and log in using an Organizer demo account, then choose Organizer
in the navigation. Create event opens an empty form; Preview edit form opens a
sample event with its current values filled in. The form includes title,
description, category, date/time in PKT and venue. Check form validates the inputs
and displays feedback. Cancel returns to the dashboard.

This task previews the layout using the shared sample events. It does not save,
update or delete events, and the sample list is not yet filtered by ownership.
Those connections are the next organizer task. Guests and Students cannot open
these organizer previews, but real authorization still requires the final backend.

## Browse events

Search by event title, choose a category or select an exact event date. The date
filter uses Pakistan time (PKT), matching the times shown on the event cards.
The filters work together. Choose Clear filters to show all events again.
Choose View details on a card to see the event's full information.

## Demo account flow

Register with made-up details and a dummy password. The verification page shows
a six-digit demo code. An unverified account cannot log in. Resend generates a
new code; after verification, log in to see the appropriate navigation and log out.

Accounts, login state and event registrations exist only in memory and reset on a full page reload.
Dummy passwords are held in demo state only. There is no real email delivery,
JWT authentication, secure server-side authorization or database integration yet.
These remain requirements for the final project. Use only sample details here.

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
- Organizer dashboard showing only the current Organizer's events.
- Organizer create/edit/delete actions connected to Redux, with ownership checks.
- Confirming event deletion also removes its associated student registrations.
- Verified Students can register for events from their details pages.
- My Registrations shows only the current Student's events, with duplicate registration blocked.
- Events and registrations are saved in browser localStorage and restored after refresh.

The remaining page-access/validation checks are later tasks.

## Student event registration

Register, verify and log in using a Student demo account. Open an event's details
and choose Register for event. The button changes to Already registered and is
disabled, and the event appears in My Registrations. Each Student sees their own
events; the same event cannot be registered twice by the same Student.

Guests are asked to log in, and Organizer accounts cannot register as Students.
Registrations are kept in this browser after refresh. Demo accounts still reset;
register and verify again with the same Student email to see that email's saved events.

## Organizer event management

Register, verify and log in using an Organizer demo account, then choose Organizer
in the navigation. A new account starts with an empty My events list. The two
public sample events belong to a separate demo organizer and are not editable
by newly registered accounts.

Create event saves an event with the logged-in Organizer's ID. Edit event opens
that Organizer's event with its current values filled in; Save changes updates
the same event. The form includes title, description, category, date/time in PKT
and venue. Cancel returns to the dashboard without saving.

The dashboard lists only the current Organizer's events. Opening another
Organizer's edit link shows Access denied. Delete asks for confirmation; Confirm
delete removes the event and its student registrations. Changes appear in public
browsing, details and My Registrations, and are kept after refresh.

Guests and Students cannot manage events. These are frontend demo checks;
secure server-side authorization remains a final-project requirement.

## Browse events

Search by event title, choose a category or select an exact event date. The date
filter uses Pakistan time (PKT), matching the times shown on the event cards.
The filters work together. Choose Clear filters to show all events again.
Choose View details on a card to see the event's full information.

## Demo account flow

Register with made-up details and a dummy password. The verification page shows
a six-digit demo code. An unverified account cannot log in. Resend generates a
new code; after verification, log in to see the appropriate navigation and log out.

Accounts and login state exist only in memory and reset after a full reload.
Dummy passwords are held in demo state only. There is no real email delivery,
JWT authentication, secure server-side authorization or database integration yet.
These remain requirements for the final project. Use only sample details here.

## Browser data after refresh

Events and registrations are saved under the localStorage key
campus-event-hub-data. Redux loads them when the app starts and saves changes
after actions. The sample events are used only when no readable saved data is
available. A saved empty list stays empty; deleted events are not recreated on refresh.

Account passwords, verification codes and login state are not saved. After a
refresh, register and verify a demo account again using the same email and role
to access its saved registrations or Organizer events. This is frontend demo
data, not secure account recovery or a database.

The data belongs to this browser and site address. Keep using the same Local
address/port when checking persistence. To restart the demo from its samples,
remove only campus-event-hub-data from the site's localStorage and reload.

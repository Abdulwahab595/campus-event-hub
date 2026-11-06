const storageKey = 'campus-event-hub-data'

export function loadDemoData() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey))
    if (!saved || !Array.isArray(saved.events) || !Array.isArray(saved.registrations)) return undefined

    const eventFields = ['id', 'title', 'description', 'category', 'date', 'venue', 'organizerId']
    const validEvents = saved.events.every((event) => event && eventFields.every(
      (field) => typeof event[field] === 'string' && event[field].trim() !== '',
    ) && !Number.isNaN(new Date(event.date).getTime()))
    const validRegistrations = saved.registrations.every((registration) => registration && ['id', 'eventId', 'studentId'].every(
      (field) => typeof registration[field] === 'string' && registration[field].trim() !== '',
    ))
    if (!validEvents || !validRegistrations) return undefined

    return {
      events: { items: saved.events },
      registrations: {
        items: saved.registrations.filter((registration) => saved.events.some((event) => event.id === registration.eventId)),
      },
    }
  } catch {
    // Start with the normal demo data if storage is unavailable or unreadable.
    return undefined
  }
}

export function saveDemoData(state) {
  try {
    localStorage.setItem(storageKey, JSON.stringify({
      events: state.events.items,
      registrations: state.registrations.items,
    }))
  } catch {
    // The app can still work in memory if the browser blocks storage.
  }
}

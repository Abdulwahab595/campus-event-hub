function PlaceholderPage({ title, children }) {
  return (
    <section className="page-panel">
      <h1>{title}</h1>
      {children}
    </section>
  )
}

export default PlaceholderPage

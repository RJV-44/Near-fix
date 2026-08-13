function SearchBar({ value, onChange, onSearch, placeholder = 'What service do you need?' }) {
  const submit = (event) => { event.preventDefault(); onSearch?.(value?.trim() ?? '') }
  return <form className="service-search" onSubmit={submit}><span aria-hidden="true">?</span><input type="search" value={value} onChange={(event) => onChange?.(event.target.value)} placeholder={placeholder} aria-label="Search services" /><button type="submit">Search</button></form>
}

export default SearchBar
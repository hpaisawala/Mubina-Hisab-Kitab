import Fuse from "fuse.js"
import type { Contact } from "./types"

export function createContactSearch(contacts: Contact[]) {
  const fuse = new Fuse(contacts, {
    keys: ["name", "phone"],
    threshold: 0.3,
    includeScore: true,
  })

  return (query: string) => {
    if (!query.trim()) return contacts.filter((c) => !c.isArchived)
    const results = fuse.search(query)
    return results.map((r) => r.item).filter((c) => !c.isArchived)
  }
}

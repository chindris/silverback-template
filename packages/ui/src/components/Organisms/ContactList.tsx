import { ContactFragment } from '@custom/schema';
import React from 'react';

import { ContactCard } from '../Molecules/ContactCard';

export function ContactList({
  contacts,
}: {
  contacts: Array<ContactFragment | undefined>;
}) {
  return contacts?.length ? (
    <ul
      role="list"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3"
    >
      {contacts
        .filter((contact): contact is ContactFragment => !!contact)
        .map((contact) => (
          <li key={contact.email}>
            <ContactCard {...contact} />
          </li>
        ))}
    </ul>
  ) : null;
}

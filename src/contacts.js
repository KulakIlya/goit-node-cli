import { nanoid } from 'nanoid';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const contactsPath = path.resolve('src', 'db', 'contacts.json');

const getContacts = async () => JSON.parse(await readFile(contactsPath));
const updateContacts = async newContacts =>
  await writeFile(contactsPath, JSON.stringify(newContacts, null, 1));

export async function listContacts() {
  return await getContacts();
}

export async function getContactById(contactId) {
  const contacts = await getContacts();
  const contact = contacts.find(item => contactId === item.id);

  return contact ?? null;
}

export async function removeContact(contactId) {
  const contacts = await getContacts();
  const contactIndex = contacts.findIndex(item => contactId === item.id);

  if (contactIndex === -1) return null;

  const [deletedContact] = contacts.splice(contactIndex, 1);
  await updateContacts(contacts);

  return deletedContact;
}

export async function addContact(name, email, phone) {
  const contacts = await getContacts();

  const newContact = { name, email, phone, id: nanoid() };
  contacts.push(newContact);
  await updateContacts(contacts);

  return newContact;
}

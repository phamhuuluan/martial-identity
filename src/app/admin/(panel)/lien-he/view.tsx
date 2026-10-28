import { parseContact } from "@/data/siteSchema";
import { ContactForm } from "@/components/admin/ContactForm";
import { readRepoFileOrThrow } from "@/lib/admin/github";

export default async function ContactAdminPage() {
  const file = await readRepoFileOrThrow("content/site/contact.json");
  return <ContactForm initial={parseContact(JSON.parse(file.content))} sha={file.sha} />;
}

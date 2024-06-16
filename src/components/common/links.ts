export interface MenuItem {
  label: string;
  link: string;
  className?: string;
}

export const links: MenuItem[] = [
  { label: "When & Where", link: "#whenAndWhere" },
  { label: "Guest Book", link: "#guestBook" },
  { label: "Registry", link: "#registry" },
  { label: "FAQs", link: "#faq" },
  { label: "Gallery", link: "#gallery" },
  { label: "RSVP", link: "#rsvp" },
];

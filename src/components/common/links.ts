export interface MenuItem {
  label: string;
  link?: string;
  links?: MenuItem[];
  className?: string;
}

export const links: MenuItem[] = [
  { label: "When & Where", link: "/#whenAndWhere" },
  { label: "Guest Book", link: "/#guestBook" },
  { label: "Registry", link: "/#registry" },
  { label: "FAQ", link: "/#faq" },
  { label: "Gallery", link: "/#gallery" },
  { label: "RSVP", link: "/#rsvp" },
  { label: "Upload Photos", link: "/#weddingGallery" },
];

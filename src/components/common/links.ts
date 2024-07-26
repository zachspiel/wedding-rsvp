export interface MenuItem {
  label: string;
  link: string;
  className?: string;
}

export const links: MenuItem[] = [
  { label: "When & Where", link: "#whenAndWhere" },
  { label: "Guest Book", link: "#guestBook" },
  // { label: "Registry", link: "#registry" },
  { label: "FAQ", link: "#faq" },
  { label: "Gallery", link: "#gallery" },
];

import { navigation } from "@/config/navigation.js";

export function getPageEntries() {
  const entries = [];
  for (const section of navigation) {
    for (const item of section.items) {
      if (item.to) {
        entries.push({
          id: item.to,
          labelKey: item.labelKey,
          to: item.to,
          icon: item.icon,
        });
      }
      item.children?.forEach((child) => {
        entries.push({
          id: child.to,
          labelKey: child.labelKey,
          to: child.to,
          icon: item.icon,
        });
      });
    }
  }
  return entries;
}

import {
  Calendar,
  House,
  Mail,
  MessageSquare,
  Settings,
  SquareCheckBig,
  Users,
} from "lucide-react";

export const navigation = [
  {
    items: [
      {
        labelKey: "nav.dashboards",
        icon: House,
        badge: 2,
        children: [
          { labelKey: "nav.analytics", to: "/dashboard/analytics" },
          { labelKey: "nav.ecommerce", to: "/dashboard/ecommerce" },
        ],
      },
    ],
  },
  {
    titleKey: "nav.appsPages",
    items: [
      { labelKey: "nav.email", icon: Mail, to: "/apps/email" },
      { labelKey: "nav.chat", icon: MessageSquare, to: "/apps/chat" },
      { labelKey: "nav.todo", icon: SquareCheckBig, to: "/apps/todo" },
      { labelKey: "nav.calendar", icon: Calendar, to: "/apps/calendar" },
      { labelKey: "nav.users", icon: Users, to: "/users" },
      { labelKey: "nav.settings", icon: Settings, to: "/settings" },
    ],
  },
];

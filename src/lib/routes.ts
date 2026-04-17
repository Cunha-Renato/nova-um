import { Home, Settings, Users, BarChart3 } from "lucide-react";
import Customers from "../components/routes/Customers";
import App from "../components/routes/App";

export const ROUTES = [
  { icon: Home, label: "Dashboard", href: "/", page: App },
  { icon: Users, label: "Customers", href: "/customers", page: Customers },
  // { icon: BarChart3, label: "Analytics", href: "/analytics" },
  // { icon: Settings, label: "Settings", href: "/settings" },
];

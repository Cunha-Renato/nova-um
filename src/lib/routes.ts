import { Home, Users } from "lucide-react";
import Customers from "../components/routes/customers/Customers";
import Dashboard from "../components/routes/dashboard/Dashboard";

export const ROUTES = [
  { icon: Home, label: "Dashboard", href: "/", page: Dashboard },
  { icon: Users, label: "Customers", href: "/customers", page: Customers },
];

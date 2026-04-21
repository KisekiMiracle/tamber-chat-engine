import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./layouts/home.tsx", [index("./routes/page.tsx")]),
  layout("./layouts/chat.tsx", [route("/chat", "./routes/chat/page.tsx")]),
] satisfies RouteConfig;

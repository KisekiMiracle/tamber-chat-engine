import LoginForm from "~/components/forms/login-form";
import RegisterForm from "~/components/forms/register-form";
import type { Route } from "./+types/page";
import TabsContainer from "~/components/tabs/tabs";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home | Tamber Engine" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Page() {
  return (
    <section>
      <TabsContainer
        RootClassName="border-none!"
        tabs={["Login", "Register"]}
        contents={[<LoginForm />, <RegisterForm />]}
      />
    </section>
  );
}

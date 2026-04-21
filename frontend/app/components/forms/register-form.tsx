import React from "react";

import * as z from "zod";
import { AuthSchema } from "~/utils/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "./form-input";
import { useToast } from "~/hooks/use-toast";
import { useServerFetch } from "~/hooks/useServerFetch";
import { Icon } from "@iconify-icon/react";
import { cn } from "@sglara/cn";

type FormData = z.infer<typeof AuthSchema>;

export default function RegisterForm() {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [status, setStatus] = React.useState<Record<string, any> | null>(null);

  const { toast } = useToast();
  const { $fetch } = useServerFetch();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(AuthSchema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const { success, message } = await $fetch({
      path: "auth/signup",
      method: "POST",
      body: data,
    });

    setStatus({
      success,
      message,
    });

    if (success) reset();

    setLoading(false);
  };

  return (
    <form
      className="flex flex-col gap-4 w-full p-2"
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormInput
        register={register}
        errors={errors}
        leadingIcon={
          <Icon
            icon="material-symbols:article-person-outline"
            width="21"
            className="label"
          />
        }
        label="name"
        placeholder="your name"
      />

      <FormInput
        register={register}
        errors={errors}
        leadingIcon={
          <Icon
            icon="material-symbols:mail-outline-rounded"
            width="21"
            className="label"
          />
        }
        type="email"
        label="email"
        placeholder="your@email.com"
      />

      <FormInput
        register={register}
        errors={errors}
        leadingIcon={
          <Icon
            icon="material-symbols:lock-outline"
            width="21"
            className="label"
          />
        }
        type="password"
        label="password"
        placeholder="********"
      />

      <FormInput
        register={register}
        errors={errors}
        leadingIcon={
          <Icon
            icon="material-symbols:mail-outline"
            width="21"
            className="label"
          />
        }
        type="password"
        label="confirmPassword"
        placeholder="********"
      />

      {status && (
        <div
          role="alert"
          className={cn("alert alert-soft", {
            "alert-success": status.success === true,
            "alert-error": status.success === false,
          })}
        >
          <span>{status.message}</span>
        </div>
      )}

      <button className="btn btn-neutral" type="submit" disabled={loading}>
        {loading ? <span>Loading...</span> : <span>Submit</span>}
      </button>
    </form>
  );
}

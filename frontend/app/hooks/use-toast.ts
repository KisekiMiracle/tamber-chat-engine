import { Toast } from "@base-ui/react/toast";

export function useToast() {
  const toastManager = Toast.useToastManager();

  const toast = ({
    title,
    description,
  }: {
    title: string;
    description: string;
  }) => {
    toastManager.add({
      title,
      description,
    });
  };

  return { toast };
}

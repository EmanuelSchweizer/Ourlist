import { toast } from "@heroui/react";

type AppToastVariant = "success" | "warning" | "danger";

const showToast = (title: string, description: string, variant: AppToastVariant) => {
    const id = toast(title, {
        actionProps: {
            children: "Dismiss",
            onPress: () => toast.close(id),
            variant: "tertiary" as const,
        },
        description,
        variant,
    });

    return id;
};

export const showSuccessToast = (description: string) => showToast("Success", description, "success");

export const showWarningToast = (description: string) => showToast("Warning", description, "warning");

export const showErrorToast = (description: string) => showToast("Error", description, "danger");
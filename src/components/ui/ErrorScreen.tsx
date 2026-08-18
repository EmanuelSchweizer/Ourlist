import { FiAlertTriangle } from "react-icons/fi";

import { Button } from "./Button";

interface Props {
    message?: string;
    onRetry?: () => void;
    title?: string;
}

export const ErrorScreen = ({
    message = "Please, try later again.",
    onRetry,
    title = "Something went wrong",
}: Props) => (
    <div
        role="alert"
        className="flex min-h-[50vh] w-full flex-col items-center justify-center gap-3 px-4 text-center"
    >
        <FiAlertTriangle className="text-red-600" size={40} aria-hidden />

        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="max-w-sm text-sm text-slate-600">{message}</p>

        {onRetry && (
            <Button intent="secondary" onPress={onRetry} className="mt-2 w-auto">
                Retry
            </Button>
        )}
    </div>
);
import { Spinner } from "@heroui/react";

export const LoadingSpinner = () => {
    return (<Spinner
        size="lg"
        className="text-violet-700"
    />)
}

export const LoadingScreen = () => (
    <div className="flex min-h-[50vh] w-full items-center justify-center">
        <LoadingSpinner />
    </div>
);


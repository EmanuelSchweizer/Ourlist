

export const DefaultPageLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    return (
        <div className="bg-gray-50 p-4 max-w-7xl mx-auto sm:px-6 lg:px-8">
            {children}
        </div>)
}
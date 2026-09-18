
interface Props{
    className?: string
}

export const DefaultPageLayout = ({ children, className }: Readonly<{ children: React.ReactNode }> & Props) => {
    return (
        <div className={`bg-gray-100 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full min-h-0 overflow-hidden ${className} sm:py-4 py-1`}>
            {children}
        </div>)
}
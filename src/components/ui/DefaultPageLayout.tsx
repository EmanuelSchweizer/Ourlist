
interface Props{
    className?: string
}

export const DefaultPageLayout = ({ children, className }: Readonly<{ children: React.ReactNode }> & Props) => {
    return (
        <div className={`bg-gray-100 p-4 max-w-7xl mx-auto sm:px-6 lg:px-8 ${className}`}>
            {children}
        </div>)
}

export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-100 border-t border-gray-200 py-6">
            <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
                <p>&copy; {currentYear} Shopping List App. All rights reserved.</p>
            </div>
        </footer>
    );
};
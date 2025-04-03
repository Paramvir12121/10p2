export default function Footer () {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()

    return (
        <div className="flex justify-center items-center text-xs h-6">
            &copy; {currentYear} . All rights reserved.
        </div>
    )
}
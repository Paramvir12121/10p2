export default function Footer () {
    const currentDate = new Date()
    console.log(currentDate)
    var currentYear = currentDate.getFullYear()

    return (
        <div className="flex justify-center text-xs pb-1 ">
            &copy; {currentYear} . All rights reserved.
        </div>
    )

}
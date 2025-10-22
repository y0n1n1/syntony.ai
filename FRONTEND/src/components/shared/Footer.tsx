import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <div>
        <footer className="w-screen">
            <hr className="h-1"/>
            <nav className="flex align-middle items-center justify-center p-4 flex-row ">
                <p className="text-base text-stone-600 mb-3 mx-5">© 2024 Syntony, Inc.</p>
                <Link className="text-base text-stone-600 mb-3 mx-5  hover:underline" to="/privacy-policy">Privacy Policy</Link>
                <Link className="text-base text-stone-600 mb-3 mx-5  hover:underline" to="/terms-of-service">Terms of Service</Link>
                
            </nav>
        </footer>
    </div>
  )
}

export default Footer
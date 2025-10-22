
import SmallFooter from "@/components/shared/SmallFooter";
import { Outlet, Navigate } from "react-router-dom"

const AuthLayout = () => {
  const isAuthenticated = false; 
  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/"/>
      ):(
        <>
        <div className="flex flex-col">
            <header className="h-40 w-screen">
                <nav className="flex items-center justify-center p-3">
                    <a href='/'>
                        <img src="public/assets/TEXT_LOGO.svg" alt="logo"
                            className="m-3 object-cover h-12 w-34" />
                    </a>
                </nav>
                <hr className="h-1"/>
            </header>
            <section className="flex justify-center items-center flex-col">
                <Outlet/>
            </section>
            <SmallFooter/>
        </div>
        </>
      )}
    </>
  )
}

export default AuthLayout
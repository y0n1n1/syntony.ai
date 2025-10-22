import Footer from "@/components/shared/Footer"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Link, Outlet } from "react-router-dom"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

const RootLayout = () => {
  let loggedIn = true;
  return (
    <div className="min-h-screen flex flex-col justify-between">
        <header className="h-35 w-screen">
            <nav className="flex items-center mx-auto justify-between p-3">
                <a href='/'><img src="public/assets/TEXT_LOGO.svg" alt="logo"
                className=" m-1 object-cover h-9 w-25.5"/></a>
                <nav className="flex items-center mx-auto justify-between w-3/12">
                <h2 className="text-lg px-5"><Link to="/library">Library</Link></h2> 
                <h2 className="text-lg px-5"><Link to="/search"><svg aria-hidden="true"  viewBox="0 0 16 16"><path fill="#333" d="M11.3,9.2C11.7,8.4,12,7.5,12,6.5C12,3.5,9.5,1,6.5,1S1,3.5,1,6.5S3.5,12,6.5,12c1,0,1.9-0.3,2.7-0.7l3.3,3.3c0.3,0.3,0.7,0.4,1.1,0.4s0.8-0.1,1.1-0.4c0.6-0.6,0.6-1.5,0-2.1L11.3,9.2zM6.5,10.3c-2.1,0-3.8-1.7-3.8-3.8c0-2.1,1.7-3.8,3.8-3.8c2.1,0,3.8,1.7,3.8,3.8C10.3,8.6,8.6,10.3,6.5,10.3z"></path></svg></Link></h2> 
                <h2 className="text-lg px-5">AI</h2> </nav>
                {loggedIn && (
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            
                            <Avatar>
                                <AvatarImage src="https://raw.githubusercontent.com/y0n1n1/delete/main/Screenshot%202024-08-20%20at%2009.23.10.png" />
                                <AvatarFallback>GG</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="mx-5">
                            <DropdownMenuLabel className="text-base hover:text-lg transition-all duration-100"><Link to="/my-account">My Account</Link></DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-base hover:text-lg transition-all duration-100"><Link to="/settings">Settings</Link></DropdownMenuItem>
                            <DropdownMenuItem className="text-base hover:text-lg transition-all duration-100"><Link to="/library">Library</Link></DropdownMenuItem>
                            <DropdownMenuItem className="text-base hover:text-lg transition-all duration-100"><Link to="/focus">Focus</Link></DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="font-bold hover:text-lg transition-all duration-100"><Link to="/sign-in">→ Log Out</Link></DropdownMenuItem>
                        </DropdownMenuContent>
                  </DropdownMenu>)}
                {!loggedIn && (
                    <Button className="mr-3" >
                        <h2 className="text-lg">Log In</h2>
                    </Button>
                )}
            </nav>
            <hr className="h-1"/>
        </header>
        <section className="flex justify-center items-center flex-col">
            <Outlet/>
        </section>

        <Footer/>
    </div>
    
  )
}

export default RootLayout
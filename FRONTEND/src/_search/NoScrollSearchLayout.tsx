
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Link, Outlet } from "react-router-dom" 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"


import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { useAuth } from './../api/authContext';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import Settings from "@/_root/pages/core/Settings";
import DeleteAccount from "@/_root/pages/core/DeleteAccount";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

const emojiList: string[] = [
  "😀", "😃", "😄", "😁", "😆", "🥹", "😅", "😂", "🤣", "😍",
  "😌", "😉", "🙃", "🙂", "😇", "😊", "☺️", "🥲", "🥰", "😘",
  "😗", "😙", "😚", "😋", "😛", "😝", "😜", "😏", "🥳", "🤩",
  "🥸", "😎", "🤓", "🧐", "🤨", "🤪", "😒", "😞", "😔", "😟",
  "😕", "🙁", "☹️", "😣", "😖", "😡", "😠", "😤", "😭", "😢",
  "🥺", "😩", "😫", "🤯", "😳", "🥵", "🥶", "😶‍🌫️", "😱", "😨",
  "😰", "😥", "🫠", "🤫", "🫡", "🫢", "🤭", "🫣", "🤔", "🤗",
  "😓", "🤥", "😶", "🫥", "😐", "🫤", "😑", "😬", "🙄", "😯",
  "😮‍💨", "😪", "🤤", "😴", "🥱", "😲", "😮", "😧", "😦", "😵",
  "😵‍💫", "🤐", "🤮", "🤧", "😷", "🤠", "🤑", "🤕", "👻", "👽",
  "👾", "🤖", "🎃", "😺", "😸", "🤲", "🫶", "😾", "😿", "🙀",
  "😽", "😼", "😻", "😹", "🦾", "💪", "👋", "👀", "🧠", "🗣",
  "🕵️‍♂️", "🕵️", "🕵️‍♀️", "👩‍🎓", "🧑‍🎓", "👨‍🏫", "🧑‍🏫", "👩‍🏫", "👨‍🎓", "👩‍💻",
  "🧑‍💻", "👨‍💻", "👩‍💼", "🧑‍💼", "👨‍🔬", "🧑‍🔬", "👩‍🔬", "👩‍🚀", "🧑‍🚀", "👨‍🚀",
  "🙇‍♀️", "🙇", "🙇‍♂️", "💁‍♀️", "🙋‍♀️", "🙆‍♂️", "🙆", "🙆‍♀️", "🙅‍♂️", "🙅",
  "🙅‍♀️", "💁‍♂️", "💁", "🙋", "🙋‍♂️", "🧏‍♀️", "🧏", "🧏‍♂️", "🤦‍♀️", "🤦",
  "🤦‍♂️", "🤷‍♀️", "🙍‍♂️", "🙍", "🙍‍♀️", "🙎‍♂️", "🙎", "🙎‍♀️", "🤷‍♂️", "🤷",
  "💆‍♀️", "💆", "💆‍♂️", "🦺", "🎓", "🧢", "🎩", "👑", "👓", "🌂",
  "🥽", "🐶", "🦊", "🐻", "🐼", "🐻‍❄️", "🐸", "🐒", "🐺", "🦇",
  "🦉", "🦅", "🦆", "🌕", "🌚", "🌜", "🌝", "🌞", "🌑", "🌎",
  "🌍", "🌏", "🔥", "✨", "🌟", "⭐️", "💫", "🪐", "🌪", "🌈",
  "⚽️", "🏀", "🏈", "⚾️", "🎾", "🎯", "🌁", "⌚️", "📱", "💻",
  "⌨️", "🖥", "🖨", "🖱", "🖲", "📸", "📼", "💿", "💾", "💽",
  "📡", "🔌", "💡", "💎", "🔑", "🎉", "🪩", "📄", "📑", "🗄",
  "📋", "📂", "🗂", "🗞", "📰", "📖", "📚"
];

function getRandomEmoji(): string {
  const randomIndex = Math.floor(Math.random() * emojiList.length);
  return emojiList[randomIndex];
}

const NoScrollSearchLayout = () => {
  const { user, logout } = useAuth(); // Access user and logout function

  return (
    <SidebarProvider>
    <div className="flex flex-row  w-screen">

    {(user?.id) && (
          <AppSidebar />
          )}
  
  <div className="flex justify-between flex-col flex-1">
    <div>
      <header className="h-35 w-full ">
        <nav className="flex justify-between items-center p-3">
        {(user?.id) && (
          <nav className="flex items-end justify-end align-middle ">
             <SidebarTrigger />
          </nav>
          )}
          {(!user?.id) && (
            <a href="/">
            <img src="public/assets/AST_LOGO.png" alt="logo" className="m-1 object-cover h-12 w-12" />
          </a>
          )}

          <nav className="flex items-center justify-between align-middle ">
          
            {user ? (
              <DropdownMenu >
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-stone-100"><p className="text-lg">Me</p></AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mx-5 w-56">
                  <p
                    className="text-lg font-bold pl-2 my-2"
                  >
                    {user.username}
                  </p>
                  <DropdownMenuItem className="text-lg hover:text-lg transition-all duration-100">
                  <Dialog >
                      {/* Prevent the Dropdown from closing when the DialogTrigger is clicked */}
                      <DialogTrigger onClick={(e) => e.stopPropagation()}>
                        Settings
                      </DialogTrigger>
                      <DialogContent  onClick={(e) => e.stopPropagation()} className="min-w-500 md:w-2/5 sm:w-2/5 h-3/5 md:h-2/3 sm:h-4/5 p-0 m-0 ">
                        <DialogHeader  onClick={(e) => e.stopPropagation()}>
                          <DialogTitle  onClick={(e) => e.stopPropagation()} className=" px-8 pt-5 text-4xl rounded-t-lg bg-stone-100 -mb-1 pb-4">Settings</DialogTitle>
                          <DialogDescription  onClick={(e) => e.stopPropagation()}>
                          <Tabs defaultValue="account-settings" className="w-full">
                            <TabsList className="w-full justify-between h-10 bg-stone-100 -mt-0.5 px-5 space-x-4 pb-5">
                                <TabsTrigger value="account-settings" className="w-1/2 text-sm">     Account Settings     </TabsTrigger>
                                <TabsTrigger value="delete-account" className="w-1/2 text-sm">Delete Account</TabsTrigger>
                            </TabsList>
                            <TabsContent value="account-settings" className="w-full p-5 bg-white">
                                
                                <Settings/>
                                    
                            </TabsContent>
                            <TabsContent value="delete-account" className="w-full h-full  p-5 bg-white">
                                <DeleteAccount/>
                            </TabsContent>
                            </Tabs>
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-lg font-bold hover:text-lg transition-all duration-100"
                  >
                    <p onClick={logout}>Log Out</p>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/sign-in">
                <Button className="mr-3">
                  <h2 className="text-xl">Log In</h2>
                </Button>
              </Link>
            )}
          </nav>
        </nav>
      </header>
      <Outlet />
      
    </div>
    <footer className="w-full absolute bottom-0 left-0 right-0">
      <nav className="flex align-middle items-center justify-center p-4 flex-row">
        <p className="text-base text-stone-600 mb-3 mx-5">© 2024 Syntony, Inc.</p>
        <Link className="text-base text-stone-600 mb-3 mx-5 hover:underline" to="/privacy-policy">
          Privacy Policy
        </Link>
        <Link className="text-base text-stone-600 mb-3 mx-5 hover:underline" to="/terms-of-service">
          Terms of Service
        </Link>
      </nav>
    </footer>
    
  </div>
  
  </div>
    </SidebarProvider>
  );
};

export default NoScrollSearchLayout;
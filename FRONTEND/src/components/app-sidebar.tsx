
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {  MessageSquareText, Library, SearchIcon, History } from "lucide-react";

interface AppSidebarProps {
  className?: string; // Accept className as an optional prop
}

export function AppSidebar({ className }: AppSidebarProps) {
  return (
    <Sidebar className={className}> {/* Apply the className here */}
      <SidebarContent className="h-full flex flex-col justify-between">
        <SidebarGroup>
          <SidebarGroupLabel className="my-12 w-full">
            <h2 className="text-lg  my-15">
              <a href="/">
                <img src="/public/assets/Logo_Text.png" alt="logo" className="m-1 ml-1 object-cover h-14 w-[340px]" />
              </a>
            </h2>
          </SidebarGroupLabel>
          <SidebarMenu className="mt-10">
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/search">
                  <SearchIcon />
                  <span className="text-xl">Search</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/saved">
                  <Library />
                  <span className="text-xl">Saved</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/history">
                  <History />
                  <span className="text-xl">History</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
          </SidebarMenu>
        </SidebarGroup>
        <SidebarFooter className="mb-6">
              <SidebarMenu>
              <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="/message-beta">
                  <MessageSquareText className="w-10 h-10" />
                  <span className="text-xl">Give Us Feedback</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
              </SidebarMenu>
           
            </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}

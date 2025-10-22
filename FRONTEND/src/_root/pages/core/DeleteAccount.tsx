import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { deleteUser } from "@/api/usersAPI";
import { useAuth } from "@/api/authContext";

const DeleteAccount = () => {
    const { user, logout } = useAuth(); // Access user data

    function handleDeleteAccount(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
     e.stopPropagation();
        logout()
        if (user?.id) {
            deleteUser(user)
                .then(() => {
                    console.log("User deleted successfully");
                    // Additional actions like redirecting or logging out can go here
                })
                .catch((error) => {
                    console.error("Error deleting user:", error);
                });
        } else {
            console.error("User ID not found");
        }
    }

    return (
        <div className="w-full">
            <div className="w-5/6 ml-10">
                <ScrollArea className="h-100 custom-scrollbar align-middle items-center justify-center flex flex-col">
                    <div className="m-30 custom-scrollbar sm:w-420 flex-left flex-col items-left text-left">
                        <div className="text-lg font-semibold">Are you sure you wish to delete your account?</div>
                        <div className="mb-10">Deleting your account is an irreversible action that removes all user data within a 30-day period from our records.</div>
                        <Button variant="destructive" onClick={handleDeleteAccount}>Delete Account</Button>
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
};

export default DeleteAccount;

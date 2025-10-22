import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Globe, Key } from "lucide-react"; // Ensure you have the correct imports for icons
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle"; // Ensure you have a Toggle component
import { createSavedFolder } from "@/api/savedFolderAPI";
import { useAuth } from "@/api/authContext";

// Define the schema for form validation
const formSchema = z.object({
  folderName: z.string().min(2, {
    message: "Folder name must be at least 2 characters.",
  }),
  descriptionName:z.string(),
  isPublic: z.boolean(),
});

export const NewArticleForm = () => {
  const { user } = useAuth()
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      folderName: "",
      descriptionName:"",
      isPublic: false,
    },
  });

  // On submit handler
  const onSubmit = async (data: { folderName: string; isPublic: boolean, descriptionName:string }) => {
    // Prepare data for API request
    const folderData = {
      user_id: user.id, // Replace with actual user ID from your context or state
      folder_name: data.folderName,
      description: data.descriptionName, // Add a description if needed
      is_public: data.isPublic,
    };

    try {
      const result = await createSavedFolder(folderData);
      console.log("Folder created successfully:", result);
      
      // Optionally reset the form or show success message here
      form.reset();
    } catch (error) {
      console.error("Error creating folder:", error);
      // Handle the error appropriately (e.g., show an error message to the user)
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="folderName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-3xl">Folder Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter folder name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="descriptionName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-2xl">Folder Description</FormLabel>
              <FormControl>
                <Input placeholder="Description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isPublic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Folder Visibility</FormLabel>
              <FormControl>
                <Toggle 
                  pressed={field.value}
                  onPressedChange={field.onChange}
                >
                  {field.value ? <Globe /> : <Key />}
                </Toggle>
              </FormControl>
              <FormDescription>Toggle to set the folder as public or private.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Create Folder</Button>
      </form>
    </Form>
  );
}

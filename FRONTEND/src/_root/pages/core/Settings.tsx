import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SignupValidation } from "@/lib/validation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import countries from "@/data/countries.json"; // Adjust the path to where your countries.json file is located

import { PasswordInput } from "@/components/custom/passwordinput";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/api/authContext";

const Settings = () => {
    const { user } = useAuth(); // Access user and logout function

    const form = useForm<z.infer<typeof SignupValidation>>({
        resolver: zodResolver(SignupValidation),
        defaultValues: {
            name: user.name,
            occupation: user.occupation,
            organization: user.organization,
            country: user.country,
            username: user.username,
            email: user.email,
            password: "we do not keep user passwords directly"
        },
    });


    function onSubmit(values: z.infer<typeof SignupValidation>) {
        console.log(values);
    }

    return (
        <div className="w-full">
      <div className="w-11/12 ml-5">
      <ScrollArea className="h-100 custom-scrollbar align-middle items-center justify-center flex flex-col ">
      <Form {...form} >
            <div className="m-30 mx-10 custom-scrollbar  flex-left flex-col items-left text-left  ">
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full  custom-scrollbar mb-10">
                    {/* Email Field */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-1xl bold">Email address</FormLabel>
                                <FormControl>
                                    <Input type="email" className="shad-input text-black" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="bg-transparent">
                                        <FormLabel className="text-1xl bold">Your Full Name</FormLabel>
                                        <FormControl>
                                            <Input type="text" className="shad-input text-black" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-1xl bold">Username</FormLabel>
                                        <FormControl>
                                            <Input type="text" className="shad-input text-black" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="occupation"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-1xl bold">Current title or occupation</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            {...field}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Undergraduate" className=" text-black">Undergraduate</SelectItem>
                                                <SelectItem value="Ms" className=" text-black">Masters</SelectItem>
                                                <SelectItem value="PhD" className=" text-black">PhD</SelectItem>
                                                <SelectItem value="Researcher/Industry" className=" text-black">Researcher/Industry</SelectItem>
                                                <SelectItem value="Other" className=" text-black">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="organization"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-1xl bold">Organization</FormLabel>
                                        <FormControl>
                                            <Input type="text" className="shad-input text-black" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Country Selector */}
                            <FormField
                                control={form.control}
                                name="country"
                                render={({ field }) => (
                                    <FormItem className=" text-black">
                                        <FormLabel className="text-1xl bold">Country</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            {...field}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a country" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent >
                                                {countries.map((country) => (
                                                    <SelectItem  key={country.id} value={country.name}>
                                                        {country.emoji} {country.name} 
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-1xl bold text-black">Password</FormLabel>
                                        <FormControl>
                                            <PasswordInput className="shad-input" {...field}/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                    
                    <Button type="submit">Save changes</Button>
                    
                    
                </form>
            </div>
        </Form>

      </ScrollArea></div>
        </div>
        
    );
};

export default Settings;

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import {  SearchFiltering } from "@/lib/core"
import { Textarea } from "../ui/textarea"

import { Toggle } from "../ui/toggle"

const SearchFilterForm = () => {
    const form = useForm<z.infer<typeof SearchFiltering>>({
        resolver: zodResolver(SearchFiltering),
        defaultValues: {
            default:true,
            citations: false,
            latest: false,
            trending: false,
        },
    });


    function onSubmit(values: z.infer<typeof SearchFiltering>) {
        console.log(values);
    }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex flex-row justify-between items-center -mb-4">
        
        <FormField
          control={form.control}
          name="default"
          render={() => (
            <FormItem>
                <FormField
                  control={form.control}
                  name="default"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormControl>
                            <Toggle
                                aria-pressed={field.value}
                            ><div
                            className="font-semibold text-stone-600">Default</div></Toggle>
                        </FormControl>
                      </FormItem>
                    )
                  }}
                />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="citations"
          render={() => (
            <FormItem>
                <FormField
                  control={form.control}
                  name="citations"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormControl>
                            <Toggle
                                aria-pressed={field.value}
                            ><div
                            className="font-semibold text-stone-600">Citations</div></Toggle>
                        </FormControl>
                      </FormItem>
                    )
                  }}
                />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="latest"
          render={() => (
            <FormItem>
                <FormField
                  control={form.control}
                  name="latest"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormControl>
                            <Toggle
                                aria-pressed={field.value}
                            ><div
                            className="font-semibold text-stone-600">Latest</div></Toggle>
                        </FormControl>
                      </FormItem>
                    )
                  }}
                />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="trending"
          render={() => (
            <FormItem>
                <FormField
                  control={form.control}
                  name="trending"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormControl>
                            <Toggle
                                aria-pressed={field.value}
                            ><div
                            className="font-semibold text-stone-600">Trending</div></Toggle>
                        </FormControl>
                      </FormItem>
                    )
                  }}
                />
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        <div className="px-2"><hr/></div>
        <FormField
            control={form.control}
            name="areas"
            render={({ field }) => (
                <FormItem>
                    <FormControl>
                        <div className="m-3"><Textarea
                        placeholder="Areas"
                        className="resize-none"
                        {...field}
                        /></div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="topics"
            render={({ field }) => (
                <FormItem>
                    <FormControl>
                    <div className="m-3">
                        <Textarea
                        placeholder="Topics"
                        className="resize-none"
                        {...field}
                        /></div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
        <FormField
                        control={form.control}
                        name="keywords"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                <div className="m-3">
                                    <Textarea
                                    placeholder="Keywords"
                                    className="resize-none"
                                    {...field}
                                    /></div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="authors"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                <div className="m-3">
                                    <Textarea
                                    placeholder="Authors"
                                    className="resize-none"
                                    {...field}
                                    /></div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="publicationsConferences"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                <div className="m-3">
                                    <Textarea
                                    placeholder="Publications and Conferences"
                                    className="resize-none"
                                    {...field}
                                    /></div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
        
        
      </form>
    </Form>
  )
}

export default SearchFilterForm
"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

const userFormSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    role: z.string().min(1, {
        message: "Please select a role.",
    }),
    plan: z.string().min(1, {
        message: "Please select a plan.",
    }),
    billing: z.string().min(1, {
        message: "Please select a billing method.",
    }),
    status: z.string().min(1, {
        message: "Please select a status.",
    }),
})

type UserFormValues = z.infer<typeof userFormSchema>

interface User {
    id: number
    name: string
    email: string
    avatar: string
    role: string
    plan: string
    billing: string
    status: string
    joinedDate: string
    lastLogin: string
}

interface UserFormSheetProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    mode: 'add' | 'edit'
    user?: User | null
    onSave: (userData: UserFormValues, userId?: number) => void
}

export function UserFormSheet({ open, onOpenChange, mode, user, onSave }: UserFormSheetProps) {
    const form = useForm<UserFormValues>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            name: "",
            email: "",
            role: "",
            plan: "",
            billing: "",
            status: "",
        },
    })

    // Update form when user changes (for edit mode)
    useEffect(() => {
        if (mode === 'edit' && user) {
            form.reset({
                name: user.name,
                email: user.email,
                role: user.role,
                plan: user.plan,
                billing: user.billing,
                status: user.status,
            })
        } else if (mode === 'add') {
            form.reset({
                name: "",
                email: "",
                role: "",
                plan: "",
                billing: "",
                status: "",
            })
        }
    }, [mode, user, form])

    function onSubmit(data: UserFormValues) {
        if (mode === 'edit' && user) {
            onSave(data, user.id)
        } else {
            onSave(data)
        }
        form.reset()
        onOpenChange(false)
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="left" className="w-[400px] sm:w-[400px] overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>{mode === 'add' ? 'Add New User' : 'Edit User'}</SheetTitle>
                    <SheetDescription>
                        {mode === 'add'
                            ? 'Create a new user account. Fill in the details below.'
                            : 'Update user information. Make changes and save when done.'}
                    </SheetDescription>
                </SheetHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter full name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter email address" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="role"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Role</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="cursor-pointer w-full">
                                                <SelectValue placeholder="Select role" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Admin">Admin</SelectItem>
                                            <SelectItem value="Author">Author</SelectItem>
                                            <SelectItem value="Editor">Editor</SelectItem>
                                            <SelectItem value="Maintainer">Maintainer</SelectItem>
                                            <SelectItem value="Subscriber">Subscriber</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="plan"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Plan</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="cursor-pointer w-full">
                                                <SelectValue placeholder="Select plan" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Basic">Basic</SelectItem>
                                            <SelectItem value="Professional">Professional</SelectItem>
                                            <SelectItem value="Enterprise">Enterprise</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="billing"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Billing</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="cursor-pointer w-full">
                                                <SelectValue placeholder="Select billing" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Auto Debit">Auto Debit</SelectItem>
                                            <SelectItem value="UPI">UPI</SelectItem>
                                            <SelectItem value="Paypal">Paypal</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="cursor-pointer w-full">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="Active">Active</SelectItem>
                                            <SelectItem value="Pending">Pending</SelectItem>
                                            <SelectItem value="Error">Error</SelectItem>
                                            <SelectItem value="Inactive">Inactive</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <SheetFooter>
                            <Button type="submit" className="cursor-pointer w-full">
                                {mode === 'add' ? 'Save User' : 'Update User'}
                            </Button>
                        </SheetFooter>
                    </form>
                </Form>
            </SheetContent>
        </Sheet>
    )
}

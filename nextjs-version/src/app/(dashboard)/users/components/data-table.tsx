"use client"

import { useState } from "react"
import {
  Search,
  Plus,
  Download,
  User,
  Shield,
  CreditCard,
  DollarSign,
  CheckCircle2,
  Calendar,
  Clock,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataGrid } from "./data-grid"
import { ChipCell, LinkCell, BadgeCell, TextCell } from "./grid-cells"
import { UserFormSheet } from "./user-form-sheet"

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

interface UserFormValues {
  name: string
  email: string
  role: string
  plan: string
  billing: string
  status: string
}

interface DataTableProps {
  users: User[]
  onDeleteUser: (id: number) => void
  onAddUser: (userData: UserFormValues) => void
  onUpdateUser: (id: number, userData: UserFormValues) => void
}

export function DataTable({ users, onDeleteUser, onAddUser, onUpdateUser }: DataTableProps) {
  const [globalFilter, setGlobalFilter] = useState("")
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())

  // Sheet state for Notion-style side panel
  const [sheetOpen, setSheetOpen] = useState(false)
  const [sheetMode, setSheetMode] = useState<'add' | 'edit'>('add')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20"
      case "Pending":
        return "text-orange-600 bg-orange-50 dark:text-orange-400 dark:bg-orange-900/20"
      case "Error":
        return "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20"
      case "Inactive":
        return "text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20"
      default:
        return "text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20"
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20"
      case "Editor":
        return "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20"
      case "Author":
        return "text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20"
      case "Maintainer":
        return "text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20"
      case "Subscriber":
        return "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-900/20"
      default:
        return "text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20"
    }
  }

  const getAvatarColor = (name: string) => {
    const colors = [
      '#E57373', '#F06292', '#BA68C8', '#9575CD',
      '#7986CB', '#64B5F6', '#4FC3F7', '#4DD0E1',
      '#4DB6AC', '#81C784', '#AED581', '#FFD54F',
      '#FFB74D', '#FF8A65', '#A1887F', '#90A4AE'
    ]
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    return colors[hash % colors.length]
  }

  const handleRowClick = (user: User) => {
    setSelectedUser(user)
    setSheetMode('edit')
    setSheetOpen(true)
  }

  const handleAddClick = () => {
    setSelectedUser(null)
    setSheetMode('add')
    setSheetOpen(true)
  }

  const handleSaveUser = (userData: UserFormValues, userId?: number) => {
    if (userId) {
      onUpdateUser(userId, userData)
    } else {
      onAddUser(userData)
    }
  }

  // Filter users based on search
  const filteredUsers = users.filter(user => {
    if (!globalFilter) return true
    const searchLower = globalFilter.toLowerCase()
    return (
      user.name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      user.role.toLowerCase().includes(searchLower)
    )
  })

  // Define columns
  const columns = [
    {
      id: 'name',
      label: 'User',
      width: '200px',
      icon: <User className="w-4 h-4" />,
      accessor: (user: User) => (
        <ChipCell
          text={user.name}
          avatar={user.avatar}
          subtext={user.email}
          color={getAvatarColor(user.name)}
        />
      )
    },
    {
      id: 'role',
      label: 'Role',
      width: '140px',
      icon: <Shield className="w-4 h-4" />,
      accessor: (user: User) => (
        <BadgeCell text={user.role} className={getRoleColor(user.role)} />
      )
    },
    {
      id: 'plan',
      label: 'Plan',
      width: '140px',
      icon: <CreditCard className="w-4 h-4" />,
      accessor: (user: User) => <TextCell text={user.plan} className="font-medium" />
    },
    {
      id: 'billing',
      label: 'Billing',
      width: '140px',
      icon: <DollarSign className="w-4 h-4" />,
      accessor: (user: User) => <TextCell text={user.billing} />
    },
    {
      id: 'status',
      label: 'Status',
      width: '120px',
      icon: <CheckCircle2 className="w-4 h-4" />,
      accessor: (user: User) => (
        <BadgeCell text={user.status} className={getStatusColor(user.status)} />
      )
    },
    {
      id: 'joinedDate',
      label: 'Joined',
      width: '140px',
      icon: <Calendar className="w-4 h-4" />,
      accessor: (user: User) => <TextCell text={user.joinedDate} className="text-sm" />
    },
    {
      id: 'lastLogin',
      label: 'Last Login',
      width: '140px',
      icon: <Clock className="w-4 h-4" />,
      accessor: (user: User) => <TextCell text={user.lastLogin} className="text-sm" />
    },
  ]

  return (
    <div className="w-full space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(String(event.target.value))}
              className="pl-9"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="cursor-pointer">
            <Download className="mr-2 size-4" />
            Export
          </Button>
          <Button onClick={handleAddClick} className="cursor-pointer">
            <Plus className="mr-2 size-4" />
            Add New User
          </Button>
        </div>
      </div>

      {/* Data Grid */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <DataGrid
          columns={columns}
          data={filteredUsers}
          onRowClick={handleRowClick}
          getRowId={(user) => user.id}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
        />
      </div>

      {/* Notion-style side panel */}
      <UserFormSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        mode={sheetMode}
        user={selectedUser}
        onSave={handleSaveUser}
      />
    </div>
  )
}

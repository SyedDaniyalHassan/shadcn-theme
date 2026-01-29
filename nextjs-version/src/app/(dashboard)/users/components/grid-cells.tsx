import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

// Chip cell with avatar for user names
interface ChipCellProps {
    text: string
    avatar: string
    subtext?: string
    color?: string
}

export function ChipCell({ text, avatar, subtext, color }: ChipCellProps) {
    return (
        <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7">
                <AvatarFallback className="text-xs font-medium" style={{ backgroundColor: color || '#E0E0E0' }}>
                    {avatar}
                </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
                <span className="font-medium truncate">{text}</span>
                {subtext && <span className="text-xs text-muted-foreground truncate">{subtext}</span>}
            </div>
        </div>
    )
}

// Link cell for URLs
interface LinkCellProps {
    url: string
    label?: string
}

export function LinkCell({ url, label }: LinkCellProps) {
    if (!url) return <span className="text-muted-foreground">—</span>

    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:underline truncate block"
            onClick={(e) => e.stopPropagation()}
        >
            {label || url}
        </a>
    )
}

// Badge cell for roles/status
interface BadgeCellProps {
    text: string
    variant?: 'default' | 'secondary' | 'destructive' | 'outline'
    className?: string
}

export function BadgeCell({ text, variant = 'secondary', className }: BadgeCellProps) {
    return (
        <Badge variant={variant} className={cn("font-normal", className)}>
            {text}
        </Badge>
    )
}

// Simple text cell
interface TextCellProps {
    text: string | number
    className?: string
}

export function TextCell({ text, className }: TextCellProps) {
    if (text === null || text === undefined || text === '') {
        return <span className="text-muted-foreground">—</span>
    }

    return <span className={cn("truncate block", className)}>{text}</span>
}

// Icon badge for system/special indicators
interface IconBadgeCellProps {
    icon: React.ReactNode
    text: string
    variant?: string
}

export function IconBadgeCell({ icon, text, variant }: IconBadgeCellProps) {
    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted">
                {icon}
            </div>
            <span className="font-medium">{text}</span>
        </div>
    )
}

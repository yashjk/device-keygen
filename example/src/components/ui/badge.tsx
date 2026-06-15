import * as React from 'react'
import { cn } from '../../lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Badge = ({ className, ...props }: BadgeProps) => (
  <div className={cn('theme-badge', className)} {...props} />
)

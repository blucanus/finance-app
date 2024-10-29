import React from 'react'
import PropTypes from 'prop-types'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

const alertVariants = cva(
  "relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
        success:
          "border-green-500/50 text-green-700 dark:border-green-500 [&>svg]:text-green-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export function Alert({
  className,
  variant,
  children,
  onClose,
  ...props
}) {
  return (
    <div
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {children}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Close alert"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

Alert.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'destructive', 'success']),
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func,
}

export function AlertTitle({ className, ...props }) {
  return (
    <h5
      className={cn("mb-1 font-medium leading-none tracking-tight", className)}
      {...props}
    />
  )
}

AlertTitle.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
}

export function AlertDescription({ className, ...props }) {
  return (
    <div
      className={cn("text-sm [&_p]:leading-relaxed", className)}
      {...props}
    />
  )
}

AlertDescription.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
}
"use client"

import * as React from "react"
import { twMerge } from "tailwind-merge"

type TabsContextValue = {
  activeTab: string
  setActiveTab: (value: string) => void
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined)

/**
 * Hook to access tabs context
 * @returns Tabs context value with activeTab and setActiveTab
 * @throws Error if used outside of Tabs provider
 */
const useTabs = () => {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error("Tab components must be used within a Tabs component")
  }
  return context
}

type TabsProps = {
  defaultValue: string
  value?: string
  onChange?: (value: string) => void
  children: React.ReactNode
  className?: string
}

/**
 * Tabs container component for managing tab state
 * @param defaultValue - The default active tab value
 * @param value - Controlled value for the active tab
 * @param onChange - Callback when active tab changes
 * @param children - Tab components
 * @param className - Additional CSS classes
 */
export const Tabs: React.FC<TabsProps> = ({
  defaultValue,
  value: controlledValue,
  onChange,
  children,
  className,
}) => {
  const [internalValue, setInternalValue] = React.useState(defaultValue)

  const activeTab = controlledValue ?? internalValue

  const setActiveTab = React.useCallback(
    (newValue: string) => {
      if (controlledValue === undefined) {
        setInternalValue(newValue)
      }
      onChange?.(newValue)
    },
    [controlledValue, onChange]
  )

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

type TabsListProps = {
  children: React.ReactNode
  className?: string
}

/**
 * Container for tab buttons
 * @param children - TabsTrigger components
 * @param className - Additional CSS classes
 */
export const TabsList: React.FC<TabsListProps> = ({ children, className }) => {
  return (
    <div
      className={twMerge("inline-flex px-1 w-full overflow-x-auto", className)}
      role="tablist"
    >
      {children}
    </div>
  )
}

type TabsTriggerProps = {
  value: string
  children: React.ReactNode
  className?: string
}

/**
 * Individual tab button trigger
 * @param value - The value this tab represents
 * @param children - Tab label content
 * @param className - Additional CSS classes
 */
export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  children,
  className,
}) => {
  const { activeTab, setActiveTab } = useTabs()
  const isActive = activeTab === value

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => setActiveTab(value)}
      className={twMerge(
        "px-4 py-2 text-sm font-medium transition-colors hover:bg-grayscale-50 border-b text-grayscale-500 border-grayscale-200",
        isActive && "text-grayscale-900 border-grayscale-900",
        className
      )}
    >
      {children}
    </button>
  )
}

type TabsContentProps = {
  value: string
  children: React.ReactNode
  className?: string
}

/**
 * Tab content panel that displays when its tab is active
 * @param value - The value this content is associated with
 * @param children - Content to display when active
 * @param className - Additional CSS classes
 */
export const TabsContent: React.FC<TabsContentProps> = ({
  value,
  children,
  className,
}) => {
  const { activeTab } = useTabs()

  if (activeTab !== value) {
    return null
  }

  return (
    <div role="tabpanel" className={className}>
      {children}
    </div>
  )
}

"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useDashContext } from "@/provider/dashContext"
import { 
  Clock, 
  Home,
  Target, 
  Music, 
  Image, 
  Settings, 
  Compass,
  Sun,
  Moon,
  Check,
  Timer,
  Coffee
} from "lucide-react" // Using lucide-react icons
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const springConfig = {
  duration: 0.3,
  ease: "easeInOut"
}

export default function Navbar({ className, ...props }) {
  const [activeIndex, setActiveIndex] = React.useState(null)
  const navRef = React.useRef(null)
  const [tooltipPosition, setTooltipPosition] = React.useState({ left: 0, width: 0 })
  const tooltipRef = React.useRef(null)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const { 
    setOpenTimer,
    showWorkTimer,
    showBreakTimer,
    toggleWorkTimer,
    toggleBreakTimer,
    toggleBothTimers
  } = useDashContext()
  
  // Only show theme toggle after mounting to avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  // Only after mounting do we use the theme-dependent icon logic
  const ThemeIcon = !mounted ? Sun : theme === 'dark' ? Sun : Moon
  
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { 
      icon: Clock, 
      label: "Timer", 
      dropdown: true,
      onClick: () => setOpenTimer(prev => !prev) 
    },
    { icon: Target, label: "Goals", onClick: () => console.log("Goals clicked") },
    { icon: Music, label: "Music", onClick: () => console.log("Music clicked") },
    { icon: Image, label: "Background", onClick: () => console.log("Background clicked") },
    { icon: Compass, label: "Inspiration", path: "/inspiration" },
    { icon: ThemeIcon, label: "Toggle Theme", onClick: toggleTheme },
    { icon: Settings, label: "Settings", onClick: () => console.log("Settings clicked") }
  ]

  React.useEffect(() => {
    if (activeIndex !== null && navRef.current && tooltipRef.current) {
      const navItem = navRef.current.children[activeIndex] 
      const navRect = navRef.current.getBoundingClientRect()
      const itemRect = navItem.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()
    
      const left = itemRect.left - navRect.left + (itemRect.width - tooltipRect.width) / 2
   
      setTooltipPosition({
        left: Math.max(0, Math.min(left, navRect.width - tooltipRect.width)),
        width: tooltipRect.width
      })
    }
  }, [activeIndex])

  const handleItemInteraction = (item, event) => {
    if (item.onClick) {
      event.preventDefault()
      item.onClick()
    }
  }

  return (
    <nav className={cn("fixed bottom-8 left-1/2 -translate-x-1/2 z-50", className)} {...props}>
      <div className="relative">
        <AnimatePresence>
          {activeIndex !== null && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={springConfig}
              className="absolute left-0 right-0 -bottom-[31px] pointer-events-none z-50"
            >
              <motion.div
                ref={tooltipRef}
                className={cn(
                  "h-7 px-3 rounded-lg inline-flex justify-center items-center overflow-hidden",
                  "bg-background/95 backdrop-blur",
                  "border border-border/50",
                  "shadow-[0_0_0_1px_rgba(0,0,0,0.08)]",
                  "dark:border-border/50 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
                )}
                initial={{ x: tooltipPosition.left }}
                animate={{ x: tooltipPosition.left }}
                transition={springConfig}
                style={{ width: "auto" }}
              >
                <p className="text-[13px] font-medium leading-tight whitespace-nowrap">
                  {navItems[activeIndex]?.label}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div 
          ref={navRef}
          className={cn(
            "h-12 px-2 inline-flex justify-center items-center gap-1 overflow-hidden",
            "rounded-full bg-background/95 backdrop-blur",
            "border border-border/50",
            "shadow-[0_0_0_1px_rgba(0,0,0,0.08),0_8px_16px_-4px_rgba(0,0,0,0.1)]",
            "dark:border-border/50 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_8px_16px_-4px_rgba(0,0,0,0.2)]"
          )}
        >
          {navItems.map((item, index) => {
            if (item.dropdown) {
              // Dropdown for Timer button
              return (
                <DropdownMenu key={index}>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="w-10 h-10 rounded-full flex justify-center items-center hover:bg-muted/80 transition-colors"
                      onMouseEnter={() => setActiveIndex(index)}
                      onMouseLeave={() => setActiveIndex(null)}
                    >
                      <div className="flex justify-center items-center">
                        <div className="w-5 h-5 flex justify-center items-center">
                          <item.icon className="w-full h-full" />
                        </div>
                      </div>
                      <span className="sr-only">{item.label}</span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-48">
                    <DropdownMenuLabel>Timer Controls</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem 
                      checked={showWorkTimer && showBreakTimer}
                      onCheckedChange={(checked) => toggleBothTimers(checked)}
                    >
                      <span className="flex items-center">
                        <Timer className="mr-2 h-3.5 w-3.5" />
                        Show Both Timers
                      </span>
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem 
                      checked={showWorkTimer}
                      onCheckedChange={toggleWorkTimer}
                    >
                      <span className="flex items-center">
                        <Clock className="mr-2 h-3.5 w-3.5" />
                        Work Timer
                      </span>
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem 
                      checked={showBreakTimer}
                      onCheckedChange={toggleBreakTimer}
                    >
                      <span className="flex items-center">
                        <Coffee className="mr-2 h-3.5 w-3.5" />
                        Break Timer
                      </span>
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setOpenTimer(true)}>
                      <span className="flex items-center">
                        <Check className="mr-2 h-3.5 w-3.5" />
                        Open Timers
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }

            const NavElement = item.path ? Link : 'button';
            const elementProps = item.path 
              ? { href: item.path } 
              : { type: 'button', onClick: (e) => handleItemInteraction(item, e) };
              
            return (
              <NavElement
                key={index}
                {...elementProps}
                className="w-10 h-10 rounded-full flex justify-center items-center hover:bg-muted/80 transition-colors"
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <div className="flex justify-center items-center">
                  <div className="w-5 h-5 flex justify-center items-center">
                    <item.icon className="w-full h-full" />
                  </div>
                </div>
                <span className="sr-only">{item.label}</span>
              </NavElement>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

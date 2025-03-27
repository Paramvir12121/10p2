"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { 
  Clock, 
  Target, 
  Music, 
  Image, 
  Settings, 
  Compass
} from "lucide-react" // Using lucide-react icons

const springConfig = {
  duration: 0.3,
  ease: "easeInOut"
}

export default function Navbar({ className, ...props }) {
  const [activeIndex, setActiveIndex] = React.useState(null)
  const navRef = React.useRef(null)
  const [tooltipPosition, setTooltipPosition] = React.useState({ left: 0, width: 0 })
  const tooltipRef = React.useRef(null)
  
  const navItems = [
    { icon: Clock, label: "Timer", path: "/timer" },
    { icon: Target, label: "Goals", path: "/goals" },
    { icon: Music, label: "Music", path: "/music" },
    { icon: Image, label: "Background", path: "/background" },
    { icon: Compass, label: "Inspiration", path: "/inspiration" },
    { icon: Settings, label: "Settings", path: "/settings" }
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
          {navItems.map((item, index) => (
            <Link 
              key={index}
              href={item.path}
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
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

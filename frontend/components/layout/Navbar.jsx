"use client"

import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Link from "next/link";
import { useTheme } from "next-themes";
import { useDashContext } from "@/provider/dashContext";
import { useDraggableContext } from "@/provider/draggableContext";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Settings, 
  Timer, 
  Clock, 
  Coffee, 
  Check, 
  LayoutGrid, 
  Image,
  CheckSquare,
  ListTodo,
  Sun,
  Moon
} from 'lucide-react';
import { BackgroundSwitcher } from "@/components/main/background/background";

export default function Navbar({ className, ...props }) {
  const [activeIndex, setActiveIndex] = useState(null);
  const navRef = useRef(null);
  const tooltipRef = useRef(null);
  const [tooltipPosition, setTooltipPosition] = useState({ left: 0 });
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  const { 
    resetAllPositions 
  } = useDraggableContext();
  
  const { 
    showWorkTimer, 
    showBreakTimer, 
    toggleWorkTimer, 
    toggleBreakTimer, 
    toggleBothTimers, 
    setOpenTimer,
    showTaskList,
    toggleTaskList,
    showMainTask,
    toggleMainTask,
    setOpenTaskList
  } = useDashContext();

  // Tooltip effect for showing label when hovering over nav items
  useEffect(() => {
    if (activeIndex !== null && navRef.current && tooltipRef.current) {
      const menuItem = navRef.current.children[activeIndex];
      if (!menuItem) return;
      
      const menuRect = navRef.current.getBoundingClientRect();
      const itemRect = menuItem.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      const left = itemRect.left - menuRect.left + (itemRect.width - tooltipRect.width) / 2;
      setTooltipPosition({
        left: Math.max(0, Math.min(left, menuRect.width - tooltipRect.width))
      });
    }
  }, [activeIndex]);

  const springConfig = { type: "spring", damping: 20, stiffness: 300 };
  
  // Only show theme toggle after mounting to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const ThemeIcon = !mounted ? Sun : theme === 'dark' ? Sun : Moon;

  // Define navigation items with proper icon components
  const navItems = [
    { label: "Timer", icon: Timer, dropdown: true },
    { label: "Tasks", icon: CheckSquare, dropdown: true },
    { label: "Settings", icon: Settings, dropdown: true },
    { label: "Toggle Theme", icon: ThemeIcon, onClick: toggleTheme },
  ];

  const handleItemInteraction = (item, event) => {
    if (item.onClick) {
      event.preventDefault();
      item.onClick();
    }
  };

  return (
    <nav className={cn("fixed bottom-6 left-1/2 -translate-x-1/2 z-50", className)} {...props}>
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
              if (item.icon === Timer) {
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
              } else if (item.icon === CheckSquare) {
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
                      <DropdownMenuLabel>Task Controls</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuCheckboxItem 
                        checked={showMainTask}
                        onCheckedChange={toggleMainTask}
                      >
                        <span className="flex items-center">
                          <CheckSquare className="mr-2 h-3.5 w-3.5" />
                          Show Main Task
                        </span>
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem 
                        checked={showTaskList}
                        onCheckedChange={toggleTaskList}
                      >
                        <span className="flex items-center">
                          <ListTodo className="mr-2 h-3.5 w-3.5" />
                          Show Task List
                        </span>
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setOpenTaskList(true)}>
                        <span className="flex items-center">
                          <Check className="mr-2 h-3.5 w-3.5" />
                          Open Task List
                        </span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              } else if (item.icon === Settings) {
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
                      <DropdownMenuLabel>Settings</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={resetAllPositions}>
                        <span className="flex items-center">
                          <LayoutGrid className="mr-2 h-3.5 w-3.5" />
                          Reset Layout
                        </span>
                      </DropdownMenuItem>
                      {/* Background settings */}
                      <DropdownMenuSeparator />
                      <BackgroundSwitcher />
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }
            }

            // For non-dropdown items like theme toggle
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

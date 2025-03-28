'use client';
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import {Button} from "@/components/ui/button"; 
import { ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

export default function DashboardCard({children, title, icon, className}) {
  const [isOpen, setIsOpen] = useState(true);

  const toggleCollapsible = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Card className={cn("shadow-sm border-slate-200 dark:border-slate-700", className)} style={{ flexGrow: 0, flexShrink: 0 }}>
      <Collapsible className="h-full" open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div 
            className="card-header flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-t-lg cursor-pointer" 
            onClick={toggleCollapsible}
          >
            <div className="flex items-center gap-2 font-medium">
              {icon && <span className="text-slate-500">{icon}</span>}
              {title}
            </div>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              <ChevronsUpDown className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          {children}
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
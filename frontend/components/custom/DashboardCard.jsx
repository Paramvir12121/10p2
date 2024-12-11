'use client';
import { useState } from 'react';
import { Card } from "@/components/ui/card";
import {Button} from "@/components/ui/button"; 
import { ChevronsUpDown } from "lucide-react";

  import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
  } from "@/components/ui/collapsible"

export default function DashboardCard({children, title}) {
    const [isOpen, setIsOpen] = useState(true);

    const toggleCollapsible = () => {
      setIsOpen(!isOpen);
    };

    return (
        <Card className="todo">
      <Collapsible className="custom-collapsible" open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className="card-header" onClick={toggleCollapsible}>
            {title}
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
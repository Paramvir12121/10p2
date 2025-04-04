"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function UsernamePrompt() {
  const [username, setUsername] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [hasUsername, setHasUsername] = useState(true); // Default to true to prevent flash

  // Only run on client-side to avoid hydration issues
  useEffect(() => {
    setIsClient(true);
    const savedUsername = localStorage.getItem('username');
    setHasUsername(!!savedUsername);
  }, []);

  const handleSaveUsername = () => {
    if (username.trim()) {
      localStorage.setItem('username', username.trim());
      setHasUsername(true);
    }
  };

  // Handle dialog close attempt
  const handleOpenChange = (open) => {
    // Only allow closing if we have a username
    if (!open && !hasUsername) {
      return; // Prevent closing
    }
  };

  // Don't render anything on the server to avoid hydration mismatch
  if (!isClient) return null;

  return (
    <AlertDialog open={!hasUsername} onOpenChange={handleOpenChange}>
      <AlertDialogContent onEscapeKeyDown={(e) => !username.trim() && e.preventDefault()}>
        <AlertDialogHeader>
          <AlertDialogTitle>Welcome to Awesome Focus!</AlertDialogTitle>
          <AlertDialogDescription>
            Please enter your name so we can personalize your experience.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Name
            </Label>
            <Input 
              id="username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your name"
              className="col-span-3"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter' && username.trim()) {
                  handleSaveUsername();
                }
              }}
            />
          </div>
        </div>

        <AlertDialogFooter>
          <Button onClick={handleSaveUsername} disabled={!username.trim()}>
            Continue
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

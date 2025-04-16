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
import {createNewUser} from '@/app/actions' 
import { toast } from 'sonner';

export default function UsernamePrompt() {
  const [username, setUsername] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [hasUsername, setHasUsername] = useState(true); // Default to true to prevent flash
  const [isLoading, setIsLoading] = useState(false);
  const [dbError, setDbError] = useState(false);

  // Only run on client-side to avoid hydration issues
  useEffect(() => {
    setIsClient(true);
    const savedUsername = localStorage.getItem('username');
    setHasUsername(!!savedUsername);
  }, []);

  const handleSaveUsername = async () => {
    if (username.trim()) {
      setIsLoading(true);
      setDbError(false);
      
      try {
        // First save to localStorage to ensure UI works even if DB fails
        localStorage.setItem('username', username.trim());
        
        // Then try to save to database
        const userData = await getUserOrCreate(username.trim());
        
        // If successful, also store user ID
        if (userData && userData.id) {
          localStorage.setItem('userId', userData.id.toString());
          console.log('User saved successfully:', userData);
          toast.success(`Welcome, ${username}!`);
        }
        
        setHasUsername(true);
      } catch (error) {
        console.error('Error saving username to database:', error);
        setDbError(true);
        
        // Show error but don't prevent app usage since we already saved to localStorage
        toast.error('Database connection issue detected. Your username was saved locally.', {
          description: "You can continue using the app, but some features may be limited."
        });
      } finally {
        setIsLoading(false);
      }
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
          
          {dbError && (
            <div className="col-span-4 text-amber-600 text-xs">
              Warning: Database connection issue detected. Your username will only be saved locally.
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <Button 
            onClick={handleSaveUsername} 
            disabled={!username.trim() || isLoading}
          >
            {isLoading ? 'Saving...' : 'Continue'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

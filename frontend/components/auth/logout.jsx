'use client';

import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { toast } from 'sonner';

const Logout = () => {
    const router = useRouter();

    const handleLogout = () => {
        // Show confirmation toast with action
        toast.info('Are you sure you want to log out?', {
            action: {
                label: 'Logout',
                onClick: () => performLogout()
            },
            duration: 5000,
        });
    };

    const performLogout = () => {
        // Update all data to db



        // Clear all user-related data from localStorage
        
        localStorage.removeItem('username');
        localStorage.removeItem('userId');
        localStorage.removeItem('focusTask');
        
        // Show success message
        toast.success('You have been logged out');
        
        // Refresh the page to trigger UsernamePrompt
        // The prompt will appear because localStorage no longer has username
        router.refresh();
        
        // Force a hard refresh as fallback
        setTimeout(() => {
            window.location.href = '/';
        }, 300);
    };


    return (performLogout)
    
};

export default Logout;
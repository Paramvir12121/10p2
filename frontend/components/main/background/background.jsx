"use client";

import { useState, useEffect, createContext, useContext } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

// Create context for background management
const BackgroundContext = createContext();

/**
 * Custom hook to access background context
 */
export function useBackground() {
  const context = useContext(BackgroundContext);
  if (!context) {
    throw new Error("useBackground must be used within BackgroundProvider");
  }
  return context;
}

/**
 * Background Provider component
 */
export function BackgroundProvider({ children }) {
  // Available background sets (each with light/dark variants)
  const backgroundSets = [
    {
      id: "lofi-village",
      name: "Lofi Village",
      light: "/backgrounds/lofi-village-day.png",
      dark: "/backgrounds/lofi-village-night.png",
    },
    // {
    //   id: "study-desk",
    //   name: "Study Desk",
    //   light: "/backgrounds/study-desk-day.jpg",
    //   dark: "/backgrounds/study-desk-night.jpg",
    // },
    // Add more background sets here in the future
  ];

  // Currently selected background set
  const [currentBackground, setCurrentBackground] = useState(backgroundSets[0]);

  // Function to change background set
  const changeBackground = (backgroundId) => {
    const newBackground = backgroundSets.find((bg) => bg.id === backgroundId);
    if (newBackground) {
      setCurrentBackground(newBackground);
    }
  };

  // Context value
  const value = {
    currentBackground,
    changeBackground,
    backgroundSets,
  };

  return (
    <BackgroundContext.Provider value={value}>
      <Background />
      {children}
    </BackgroundContext.Provider>
  );
}

/**
 * Background component that displays the current theme-aware background
 */
export default function Background() {
  const { theme } = useTheme();
  const { currentBackground } = useBackground();
  const [previousImage, setPreviousImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [isChanging, setIsChanging] = useState(false);

  // Update current image when theme or background changes
  useEffect(() => {
    if (!currentBackground) return;
    
    // Determine if we're in dark mode
    const isDarkMode = theme === "dark";
    
    // Save previous image for transition
    if (currentImage) {
      setPreviousImage(currentImage);
      setIsChanging(true);
    }
    
    // Set new image based on theme
    setCurrentImage(isDarkMode ? currentBackground.dark : currentBackground.light);

    // Reset changing state after animation completes
    const timer = setTimeout(() => {
      setIsChanging(false);
      setPreviousImage(null);
    }, 1000);

    return () => clearTimeout(timer);
  }, [theme, currentBackground, currentImage]);
  
  // Don't render anything until we have a current image
  if (!currentImage) return null;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <AnimatePresence mode="sync">
        {/* Current background image */}
        <motion.div
          key={currentImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <Image
            src={currentImage}
            alt="Background"
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
        </motion.div>
        
        {/* Previous image for smooth transition */}
        {isChanging && previousImage && (
          <motion.div
            key={`previous-${previousImage}`}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <Image
              src={previousImage}
              alt="Previous background"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Overlay with overflow hidden to prevent any background scrollbar issues backdrop-blur-[2px] */}
      <div className="absolute inset-0 bg-background/30 backdrop-blur-[1px]  dark:bg-background/50 overflow-hidden" />
    </div>
  );
}

/**
 * Background switcher component for selecting different backgrounds
 */
export function BackgroundSwitcher() {
  const { backgroundSets, changeBackground, currentBackground } = useBackground();
  
  return (
    <div className="flex flex-col gap-2 p-3">
      <h3 className="text-sm font-medium">Background Theme</h3>
      <div className="grid grid-cols-2 gap-2">
        {backgroundSets.map((background) => (
          <button
            key={background.id}
            onClick={() => changeBackground(background.id)}
            className={`relative h-20 overflow-hidden rounded-md border ${
              currentBackground.id === background.id 
                ? "ring-2 ring-primary" 
                : "hover:ring-1 hover:ring-primary/50"
            }`}
          >
            <Image
              src={background.light}
              alt={background.name}
              fill
              sizes="100px"
              className="object-cover opacity-90"
            />
            <span className="absolute inset-x-0 bottom-0 bg-background/70 px-2 py-1 text-[10px] font-medium backdrop-blur-sm">
              {background.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
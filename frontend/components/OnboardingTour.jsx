'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TIPS = [
  {
    title: '👋 Welcome to 10p2!',
    description: 'A focused productivity timer that helps you work smarter.',
    tip: 'Drag and drop components anywhere on your screen to customize your workspace.'
  },
  {
    title: '⏱️ How Timers Work',
    description: 'Start the work timer to begin earning break time.',
    tip: 'For every 5 minutes of work, you earn 1 minute of break time!'
  },
  {
    title: '✅ Managing Tasks',
    description: 'Add tasks and drag them to the focus area to work on them.',
    tip: 'Use Ctrl+N to quickly add a new task, or Ctrl+K to search.'
  },
  {
    title: '🎯 Focus Mode',
    description: 'Set a task as your current focus by dragging it to the focus area.',
    tip: 'The timer will auto-start when you set a focus task!'
  },
  {
    title: '⌨️ Keyboard Shortcuts',
    description: 'Work faster with keyboard shortcuts.',
    tip: 'Press Ctrl+K to search, Ctrl+N for new task, and Ctrl+Z to undo.'
  }
];

export default function OnboardingTour() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasSeenTour, setHasSeenTour] = useState(true);

  useEffect(() => {
    // Check if user has seen the tour
    const seen = localStorage.getItem('hasSeenOnboardingTour');
    if (!seen) {
      setHasSeenTour(false);
      // Show tour after a short delay
      setTimeout(() => {
        setIsVisible(true);
      }, 1000);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem('hasSeenOnboardingTour', 'true');
    setHasSeenTour(true);
  };

  const handleNext = () => {
    if (currentStep < TIPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    handleClose();
  };

  if (hasSeenTour) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          >
            <Card className="w-full max-w-md p-6 relative">
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 h-6 w-6 p-0"
                onClick={handleClose}
              >
                <X className="h-4 w-4" />
              </Button>

              <div className="space-y-4">
                <div className="text-4xl text-center">
                  {TIPS[currentStep].title.split(' ')[0]}
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    {TIPS[currentStep].title.substring(TIPS[currentStep].title.indexOf(' ') + 1)}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {TIPS[currentStep].description}
                  </p>
                  <div className="bg-primary/5 border border-primary/20 rounded-md p-3">
                    <p className="text-sm">
                      <span className="font-medium text-primary">💡 Tip:</span>{' '}
                      {TIPS[currentStep].tip}
                    </p>
                  </div>
                </div>

                {/* Progress indicators */}
                <div className="flex justify-center gap-1.5">
                  {TIPS.map((_, index) => (
                    <div
                      key={index}
                      className={`h-1.5 rounded-full transition-all ${
                        index === currentStep
                          ? 'w-6 bg-primary'
                          : index < currentStep
                          ? 'w-1.5 bg-primary/50'
                          : 'w-1.5 bg-muted'
                      }`}
                    />
                  ))}
                </div>

                {/* Navigation buttons */}
                <div className="flex justify-between items-center pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSkip}
                    className="text-muted-foreground"
                  >
                    Skip tour
                  </Button>

                  <div className="flex gap-2">
                    {currentStep > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrev}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Back
                      </Button>
                    )}

                    <Button
                      size="sm"
                      onClick={handleNext}
                    >
                      {currentStep === TIPS.length - 1 ? (
                        'Get Started'
                      ) : (
                        <>
                          Next
                          <ChevronRight className="h-4 w-4 ml-1" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="text-center text-xs text-muted-foreground">
                  {currentStep + 1} of {TIPS.length}
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

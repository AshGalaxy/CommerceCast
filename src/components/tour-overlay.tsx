'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';

const steps = [
    {
        title: 'Welcome to CommerceCast!',
        description: 'Let\'s take a quick tour of your new dashboard. This platform helps you analyze your sales data and get AI-powered insights.',
        target: 'body', // General welcome
    },
    {
        title: 'Dashboard Overview',
        description: 'Here you can see your key performance indicators, sales trends, and recent activity at a glance.',
        target: '/dashboard',
    },
    {
        title: 'Data Sources',
        description: 'Upload your CSV files or connect to Google Sheets here. This is where your data journey begins.',
        target: '/dashboard/data-sources',
    },
    {
        title: 'Settings',
        description: 'Customize your experience, including where you land after logging in.',
        target: '/dashboard/settings',
    }
];

export function TourOverlay() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const shouldStart = window.localStorage.getItem('start-tour');
        if (shouldStart === 'true') {
            setIsOpen(true);
        }
    }, []);

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleClose();
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        window.localStorage.removeItem('start-tour');
    };

    if (!isOpen) return null;

    const step = steps[currentStep];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <Card className="w-full max-w-md shadow-xl border-primary/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-bold text-primary">
                        {step.title}
                    </CardTitle>
                    <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8">
                        <X className="h-4 w-4" />
                    </Button>
                </CardHeader>
                <CardContent className="pt-4">
                    <p className="text-muted-foreground">
                        {step.description}
                    </p>
                    <div className="mt-4 flex justify-between text-xs text-muted-foreground">
                        <span>Step {currentStep + 1} of {steps.length}</span>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={handleClose}>
                        Skip Tour
                    </Button>
                    <Button onClick={handleNext}>
                        {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

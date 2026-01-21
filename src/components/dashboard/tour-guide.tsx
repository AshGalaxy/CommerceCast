
'use client';

import { useEffect } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export function TourGuide() {
    useEffect(() => {
        const shouldStartTour = window.localStorage.getItem('start-tour');

        if (shouldStartTour === 'true') {
            const driverObj = driver({
                showProgress: true,
                steps: [
                    {
                        element: 'body',
                        popover: {
                            title: 'Welcome to CommerceCast!',
                            description: 'Let\'s take a quick tour of your new dashboard.'
                        }
                    },
                    {
                        element: '.font-headline',
                        popover: {
                            title: 'Dashboard Overview',
                            description: 'This is your main command center. Here you can see a high-level view of your business performance.'
                        }
                    },
                    {
                        element: '[href="/dashboard/data-sources"]',
                        popover: {
                            title: 'Connect Your Data',
                            description: 'Start here! Upload your CSV files or connect Google Sheets to populate your dashboard with real data.'
                        }
                    },
                    {
                        element: '.lucide-filter',
                        popover: {
                            title: 'Powerful Filters',
                            description: 'Slice and dice your data by time, region, category, and more to find specific insights.'
                        }
                    },
                    {
                        element: '.lucide-activity',
                        popover: {
                            title: 'Key Metrics',
                            description: 'Track your Revenue, Sales, and Customer growth at a glance.'
                        }
                    },
                    {
                        element: 'body',
                        popover: {
                            title: 'You\'re All Set!',
                            description: 'Explore the other tabs for Forecasting, Reports, and more. Enjoy using CommerceCast!'
                        }
                    }
                ],
                onDestroyStarted: () => {
                    if (!driverObj.hasNextStep() || confirm("Are you sure you want to skip the tour?")) {
                        driverObj.destroy();
                        window.localStorage.removeItem('start-tour');
                    }
                },
            });

            driverObj.drive();
        }
    }, []);

    return null;
}

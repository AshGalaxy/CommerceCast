'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'INR' | 'JPY';

type CurrencyContextType = {
    currency: CurrencyCode;
    setCurrency: (currency: CurrencyCode) => void;
    formatCurrency: (amount: number) => string;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const currencyMap: Record<CurrencyCode, { locale: string; currency: string }> = {
    USD: { locale: 'en-US', currency: 'USD' },
    EUR: { locale: 'de-DE', currency: 'EUR' },
    GBP: { locale: 'en-GB', currency: 'GBP' },
    INR: { locale: 'en-IN', currency: 'INR' },
    JPY: { locale: 'ja-JP', currency: 'JPY' },
};

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
    const [currency, setCurrency] = useState<CurrencyCode>('INR');

    useEffect(() => {
        const savedCurrency = localStorage.getItem('app-currency') as CurrencyCode;
        if (savedCurrency && currencyMap[savedCurrency]) {
            setCurrency(savedCurrency);
        }
    }, []);

    const updateCurrency = (newCurrency: CurrencyCode) => {
        setCurrency(newCurrency);
        localStorage.setItem('app-currency', newCurrency);
    };

    const formatCurrency = (amount: number) => {
        const { locale, currency: currencyCode } = currencyMap[currency];
        return new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: currencyCode,
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(amount);
    };

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency: updateCurrency, formatCurrency }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};

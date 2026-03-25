

export const formatCurrency = (price: number, currency: string) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
}).format(price)
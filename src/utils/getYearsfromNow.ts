
export const getYearsFromNow = (year: number | string) => {
    const currentYear = new Date().getFullYear();
    return currentYear - Number(year);
};
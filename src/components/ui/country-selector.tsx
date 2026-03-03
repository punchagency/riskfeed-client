import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import countries from 'world-countries';

interface CountrySelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  valueType: "name" | "code";
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
}

const europeanCountries = [
  'Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic', 'Denmark',
  'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Ireland', 'Italy',
  'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Netherlands', 'Poland', 'Portugal',
  'Romania', 'Slovakia', 'Slovenia', 'Spain', 'Sweden', 'United Kingdom', 'Norway',
  'Switzerland', 'Iceland', 'Albania', 'Bosnia and Herzegovina', 'Montenegro',
  'North Macedonia', 'Serbia', 'Kosovo', 'Moldova', 'Ukraine', 'Belarus'
];

const countryList = countries.map(country => ({
  name: country.name.common,
  code: country.cca2,
  flag: country.flag
})).sort((a, b) => {
  if (a.name === 'United States') return -1;
  if (b.name === 'United States') return 1;
  
  const aIsEuropean = europeanCountries.includes(a.name);
  const bIsEuropean = europeanCountries.includes(b.name);
  
  if (aIsEuropean && !bIsEuropean) return -1;
  if (!aIsEuropean && bIsEuropean) return 1;
  
  return a.name.localeCompare(b.name);
});

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  value,
  onValueChange,
  placeholder = 'Select country',
  error,
  valueType = "code",
  disabled = false,
  readOnly = false,
  className
}) => {
  const [search, setSearch] = React.useState('');

  const filteredCountries = search
    ? countryList.filter(country =>
        country.name.toLowerCase().includes(search.toLowerCase())
      )
    : countryList;

  const selectedCountry = countryList.find(c => c.name === value);

  return (
    <div>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className={cn("w-full", className, error && "border-destructive")} disabled={disabled} aria-readonly={readOnly}>
          <SelectValue placeholder={placeholder}>
            {selectedCountry && (
              <span className="flex items-center gap-2">
                <span className="text-lg">{selectedCountry.flag}</span>
                {selectedCountry.name}
              </span>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <div className="px-2 py-1.5">
            <Input
              placeholder="Search country..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9"
            />
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {filteredCountries.map((country) => (
              <SelectItem key={country.code} value={valueType === "code" ? country.code : country.name}>
                <span className="flex items-center gap-2">
                  <span className="text-lg">{country.flag}</span>
                  {country.name}
                </span>
              </SelectItem>
            ))}
          </div>
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive mt-1">{error}</p>}
    </div>
  );
};

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import countries from "world-countries";

interface PhoneInputProps extends Omit<React.ComponentProps<typeof Input>, "value" | "onChange"> {
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  defaultCountry?: string;
  countryCodeClass?: string
}

const countryPhoneCodes = countries.map(country => ({
  name: country.name.common,
  code: country.cca2,
  flag: country.flag,
  dialCode: country.idd.root + (country.idd.suffixes.length > 1 ? '' : country.idd.suffixes[0]),
})).filter(c => c.dialCode).sort((a, b) => {
  if (a.code === 'US') return -1;
  if (b.code === 'US') return 1;
  return a.name.localeCompare(b.name);
});

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, value = "", onChange, error, defaultCountry = "US", countryCodeClass, ...props }, ref) => {
    const [countryCode, setCountryCode] = React.useState(defaultCountry);
    const [phoneNumber, setPhoneNumber] = React.useState("");

    React.useEffect(() => {
      if (value) {
        const country = countryPhoneCodes.find(c => value.startsWith(c.dialCode));
        if (country) {
          setCountryCode(country.code);
          setPhoneNumber(value.slice(country.dialCode.length));
        } else {
          setPhoneNumber(value);
        }
      }
    }, []);

    const selectedCountry = countryPhoneCodes.find(c => c.code === countryCode);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value.replace(/\D/g, '');
      setPhoneNumber(input);
      if (selectedCountry && onChange) {
        onChange(selectedCountry.dialCode + input);
      }
    };

    const handleCountryChange = (code: string) => {
      setCountryCode(code);
      const country = countryPhoneCodes.find(c => c.code === code);
      if (country && onChange) {
        onChange(country.dialCode + phoneNumber);
      }
    };

    const isValid = React.useMemo(() => {
      if (!phoneNumber) return true;
      return phoneNumber.length >= 7 && phoneNumber.length <= 15;
    }, [phoneNumber]);

    return (
      <div className="space-y-1">
        <div className="flex gap-2">
          <Select value={countryCode} onValueChange={handleCountryChange}>
            <SelectTrigger className={cn("w-[120px]", countryCodeClass, error && "border-destructive")}>
              <SelectValue>
                {selectedCountry && (
                  <span className="flex items-center gap-2">
                    <span className="text-lg">{selectedCountry.flag}</span>
                    <span className="text-sm">{selectedCountry.dialCode}</span>
                  </span>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-[300px] w-fit">
                {countryPhoneCodes.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    <span className="flex items-center gap-2">
                      <span className="text-lg">{country.flag}</span>
                      <span className="text-sm">{country.name}</span>
                      <span className="text-xs text-muted-foreground">{country.dialCode}</span>
                    </span>
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <Input
            ref={ref}
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            className={cn(
              "flex-1",
              error && "border-destructive",
              !isValid && phoneNumber && "border-amber-500",
              className
            )}
            placeholder="Phone number"
            {...props}
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        {!isValid && phoneNumber && !error && (
          <p className="text-sm text-amber-600">Phone number should be 7-15 digits</p>
        )}
      </div>
    );
  }
);

PhoneInput.displayName = "PhoneInput";

export { PhoneInput };

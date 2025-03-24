import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { GlowInput } from "./ui/glow-input";
// Country data with name, code, flag and dial code
const countries = [
  { name: "United States", code: "US", dialCode: "+1" },
  { name: "United Kingdom", code: "GB", dialCode: "+44" },
  { name: "Canada", code: "CA", dialCode: "+1" },
  { name: "Australia", code: "AU", dialCode: "+61" },
  { name: "Germany", code: "DE", dialCode: "+49" },
  { name: "France", code: "FR", dialCode: "+33" },
  { name: "India", code: "IN", dialCode: "+91" },
  { name: "China", code: "CN", dialCode: "+86" },
  { name: "Japan", code: "JP", dialCode: "+81" },
  { name: "Brazil", code: "BR", dialCode: "+55" },
  { name: "Mexico", code: "MX", dialCode: "+52" },
  { name: "Spain", code: "ES", dialCode: "+34" },
  { name: "Italy", code: "IT", dialCode: "+39" },
  { name: "Russia", code: "RU", dialCode: "+7" },
  { name: "South Korea", code: "KR", dialCode: "+82" },
];

interface PhoneInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  selectedCountry: { code: string; dialCode: string };
  setSelectedCountry: (country: { code: string; dialCode: string }) => void;
  phoneNumber: string;
  onPhoneNumberChange: (phoneNumber: string) => void;
}

export default function PhoneInput({
  selectedCountry,
  setSelectedCountry,
  phoneNumber,
  onPhoneNumberChange,
  ...props
}: PhoneInputProps) {
  const [open, setOpen] = React.useState(false);

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers, spaces, and dashes
    const value = e.target.value.replace(/[^\d\s-]/g, "");
    onPhoneNumberChange(value);
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[140px] justify-between"
            >
              <span className="flex items-center gap-1 truncate">
                <span>{selectedCountry.code}</span>
                <span>{selectedCountry.dialCode}</span>
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0">
            <Command>
              <CommandInput placeholder="Search country..." />
              <CommandList>
                <CommandEmpty>No country found.</CommandEmpty>
                <CommandGroup className="max-h-[300px] overflow-y-auto">
                  {countries.map((country) => (
                    <CommandItem
                      key={country.code}
                      value={`${country.name} ${country.dialCode}`}
                      onSelect={() => {
                        setSelectedCountry(country);
                        setOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex-1 truncate">{country.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {country.dialCode}
                        </span>
                      </div>
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedCountry.code === country.code
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <GlowInput
          placeholder="Enter phone number"
          className="flex-1 w-full"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          {...props}
        />
      </div>
    </div>
  );
}

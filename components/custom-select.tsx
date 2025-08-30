import { cn } from '@/lib/utils';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Option{
    label : string;
    value : string
}

interface CustomSelectProps{
    placeholder : string; 
    options : Option[];
    onChange : (Value : string) => void
    value?: string | null;
    className?: string;
}

export const CustomSelect = ({placeholder, options, onChange, value, className} : CustomSelectProps) => {
  return (
   <Select onValueChange={onChange} value={value ?? ""}>
  <SelectTrigger className={cn("w-full", className)}>
    <SelectValue placeholder={placeholder} />
  </SelectTrigger>
  <SelectContent>  
   {options.map(opt => (
    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
   ))}   
  </SelectContent>
</Select>

  );  
};

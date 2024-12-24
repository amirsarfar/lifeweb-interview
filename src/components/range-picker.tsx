import { DateRange, DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const RangePicker: React.FC<{
  date: DateRange;
  setDate: (v: DateRange) => void;
}> = ({ date, setDate }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from ? format(date.from, "PPP") : <span>Pick a date</span>}
          {" - "}
          {date?.to ? format(date.to, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4">
        <DayPicker required mode="range" selected={date} onSelect={setDate} />
      </PopoverContent>
    </Popover>
  );
};

"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export interface DateTimePickerProps {
    /** The selected date and time value */
    value?: Date
    /** Callback when date or time changes, provides combined Date object */
    onChange?: (date: Date | undefined) => void
    /** Label for the date picker */
    dateLabel?: string
    /** Label for the time picker */
    timeLabel?: string
    /** Placeholder text for date button */
    datePlaceholder?: string
    /** Date format string (date-fns format tokens) */
    dateFormat?: string
    /** Additional CSS classes for the container */
    className?: string
    /** Minimum selectable date */
    minDate?: Date
    /** Maximum selectable date */
    maxDate?: Date
    /** Whether to show seconds in time picker */
    showSeconds?: boolean
    /** Custom ID prefix for accessibility */
    id?: string
    /** Whether the date time picker is disabled */
    disabled?: boolean
    /** Minimum selectable year */
    fromYear?: number
    /** Maximum selectable year */
    toYear?: number
}

export function DateTimePicker({
    value,
    onChange,
    dateLabel = "Date",
    timeLabel = "Time",
    datePlaceholder = "Select date",
    dateFormat = "PPP",
    className = "",
    minDate,
    maxDate,
    showSeconds = false,
    id = "datetime-picker",
    disabled = false,
    fromYear,
    toYear,
}: DateTimePickerProps) {
    const [open, setOpen] = React.useState(false)
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(value)
    const [timeValue, setTimeValue] = React.useState<string>(() => {
        if (value) {
            const hours = value.getHours().toString().padStart(2, "0")
            const minutes = value.getMinutes().toString().padStart(2, "0")
            const seconds = value.getSeconds().toString().padStart(2, "0")
            return showSeconds ? `${hours}:${minutes}:${seconds}` : `${hours}:${minutes}`
        }
        return ""
    })

    // Update internal state when value prop changes
    React.useEffect(() => {
        if (value) {
            setSelectedDate(value)
            const hours = value.getHours().toString().padStart(2, "0")
            const minutes = value.getMinutes().toString().padStart(2, "0")
            const seconds = value.getSeconds().toString().padStart(2, "0")
            setTimeValue(showSeconds ? `${hours}:${minutes}:${seconds}` : `${hours}:${minutes}`)
        }
    }, [value, showSeconds])

    const combineDateTime = (date: Date | undefined, time: string): Date | undefined => {
        if (!date) return undefined

        const [hours, minutes, seconds = 0] = time.split(":").map(Number)
        const combined = new Date(date)
        combined.setHours(hours || 0, minutes || 0, seconds || 0, 0)
        return combined
    }

    const handleDateSelect = (date: Date | undefined) => {
        setSelectedDate(date)
        setOpen(false)

        const combined = combineDateTime(date, timeValue)
        onChange?.(combined)
    }

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = e.target.value
        setTimeValue(time)

        const combined = combineDateTime(selectedDate, time)
        onChange?.(combined)
    }

    return (
        <div className={`flex gap-4 ${className}`}>
            <div className="flex w-full flex-col gap-3">
                <Label htmlFor={`${id}-date`} className="px-1">
                    {dateLabel}
                </Label>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            disabled={disabled}
                            variant="outline"
                            id={`${id}-date`}
                            className="w-full justify-between font-normal"
                        >
                            {selectedDate ? format(selectedDate, dateFormat) : datePlaceholder}
                            <ChevronDownIcon />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            captionLayout="dropdown"
                            fromYear={fromYear}
                            toYear={toYear}
                            onSelect={handleDateSelect}
                            disabled={(date) => {
                                if (minDate && date < minDate) return true
                                if (maxDate && date > maxDate) return true
                                return false
                            }}
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="flex flex-col gap-3">
                <Label htmlFor={`${id}-time`} className="px-1">
                    {timeLabel}
                </Label>
                <Input
                    type="time"
                    id={`${id}-time`}
                    step={showSeconds ? "1" : "60"}
                    value={timeValue}
                    onChange={handleTimeChange}
                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />
            </div>
        </div>
    )
}

// Keep the old export for backward compatibility
export const Calendar24 = DateTimePicker

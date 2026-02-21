'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface SliderProps {
  value?: number[]
  onValueChange?: (value: number[]) => void
  max?: number
  step?: number
  disabled?: boolean
  className?: string
}

const Slider = React.forwardRef<HTMLDivElement, SliderProps>(
  ({ value = [0], onValueChange, max = 100, step = 1, disabled, className }, ref) => {
    const currentValue = value[0] || 0
    const percentage = (currentValue / max) * 100

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex w-full touch-none select-none items-center',
          disabled && 'opacity-50',
          className
        )}
      >
        <div className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-gray-200">
          <div
            className="absolute h-full bg-blue-500 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <input
          type="range"
          min={0}
          max={max}
          step={step}
          value={currentValue}
          onChange={(e) => onValueChange?.([parseInt(e.target.value)])}
          disabled={disabled}
          className="absolute w-full h-6 opacity-0 cursor-pointer"
        />
        <div
          className="absolute h-4 w-4 rounded-full border-2 border-blue-500 bg-white shadow pointer-events-none"
          style={{ left: `calc(${percentage}% - 8px)` }}
        />
      </div>
    )
  }
)
Slider.displayName = 'Slider'

export { Slider }

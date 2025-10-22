import React, { useState } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

type TwoSliderProps = {
  className?: string;
  min: number;
  max: number;
  minStepsBetweenThumbs: number;
  step: number;
  formatLabel?: (value: number) => string;
  value?: [number, number];
  onValueChange?: (values: [number, number]) => void;
};

const TwoSlider = React.forwardRef(
  (
    {
      className,
      min,
      max,
      step,
      minStepsBetweenThumbs,
      formatLabel,
      value,
      onValueChange,
      ...props
    }: TwoSliderProps,
    ref
  ) => {
    const initialValue: [number, number] = value || [min, max];
    const [localValues, setLocalValues] = useState<[number, number]>(initialValue);

    const handleValueChange = (newValues: number[]) => {
      if (newValues[1] < newValues[0]) {
        return;
      }

      if (newValues[1] - newValues[0] < minStepsBetweenThumbs * step) {
        return;
      }

      setLocalValues([newValues[0], newValues[1]]);
      if (onValueChange) {
        onValueChange([newValues[0], newValues[1]]);
      }
    };

    return (
      <div className="w-full">
        <SliderPrimitive.Root
          ref={ref as React.RefObject<HTMLDivElement>}
          min={min}
          max={max}
          step={step}
          value={localValues}
          onValueChange={handleValueChange}
          className={cn(
            "relative flex w-full touch-none select-none items-center",
            className
          )}
          {...props}
        >
          <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
            <SliderPrimitive.Range className="absolute h-full bg-primary" />
          </SliderPrimitive.Track>

          {/* First thumb */}
          <SliderPrimitive.Thumb 
            className={cn(
              "block h-4 w-4 rounded-full border border-primary/50 bg-background shadow",
              "transition-colors focus-visible:outline-none focus-visible:ring-1",
              "focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            )}
          />

          {/* Second thumb */}
          <SliderPrimitive.Thumb 
            className={cn(
              "block h-4 w-4 rounded-full border border-primary/50 bg-background shadow",
              "transition-colors focus-visible:outline-none focus-visible:ring-1",
              "focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            )}
          />
        </SliderPrimitive.Root>

        {/* Values display div */}
        <div className="flex justify-between mt-6 px-2">
          <div className="text-sm font-medium">
            {formatLabel ? formatLabel(localValues[0]) : localValues[0]}
          </div>
          <div className="text-sm font-medium">
            {formatLabel ? formatLabel(localValues[1]) : localValues[1]}
          </div>
        </div>
      </div>
    );
  }
);

TwoSlider.displayName = SliderPrimitive.Root.displayName;

export { TwoSlider };
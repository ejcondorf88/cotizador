import { useState, useCallback } from 'react';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';

interface PropertyCountSelectorProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  companyName: string;
  error?: string;
}

export function PropertyCountSelector({
  value,
  onChange,
  min = 1,
  max = 100,
  companyName,
  error,
}: PropertyCountSelectorProps) {
  const [localValue, setLocalValue] = useState<number>(value);

  const handleDecrement = useCallback(() => {
    const newValue = Math.max(min, localValue - 1);
    setLocalValue(newValue);
    onChange(newValue);
  }, [localValue, min, onChange]);

  const handleIncrement = useCallback(() => {
    const newValue = Math.min(max, localValue + 1);
    setLocalValue(newValue);
    onChange(newValue);
  }, [localValue, max, onChange]);

  const handleInputChange = useCallback(
    (e: { value: number | null }) => {
      const newValue = e.value ?? min;
      const clampedValue = Math.max(min, Math.min(max, newValue));
      setLocalValue(clampedValue);
      onChange(clampedValue);
    },
    [min, max, onChange]
  );

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Icon */}
      <div className="w-20 h-20 rounded-full bg-[#C9A84C]/20 flex items-center justify-center">
        <i className="pi pi-building text-4xl text-[#C9A84C]"></i>
      </div>

      {/* Question */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-white">
          ¿Cuántos inmuebles quiere asegurar
        </h2>
        <h2 className="text-2xl md:text-3xl font-bold text-white">la empresa?</h2>
      </div>

      {/* Company Name Badge */}
      <div className="bg-[#252540] border border-[#C9A84C]/30 rounded-lg px-6 py-3 flex items-center gap-3">
        <i className="pi pi-building text-[#C9A84C]"></i>
        <span className="text-white font-medium">{companyName}</span>
      </div>

      {/* Selector */}
      <div className="flex flex-col items-center space-y-4 mt-4">
        <span className="text-gray-400 text-sm">Seleccione la cantidad:</span>

        <div className="flex items-center gap-4">
          {/* Decrement Button */}
          <Button
            icon="pi pi-minus"
            onClick={handleDecrement}
            disabled={localValue <= min}
            className="w-12 h-12 rounded-full bg-[#252540] border border-[#C9A84C]/50 text-[#C9A84C] hover:bg-[#C9A84C] hover:text-white transition-all"
            disabledClassName="opacity-50 cursor-not-allowed"
          />

          {/* Input Number */}
          <div className="w-24">
            <InputNumber
              value={localValue}
              onChange={handleInputChange}
              min={min}
              max={max}
              className="w-full"
              inputClassName="w-full text-center text-3xl font-bold text-white bg-[#1A1A2E] border border-[#C9A84C]/50 rounded-lg py-3 focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent"
              showButtons={false}
            />
          </div>

          {/* Increment Button */}
          <Button
            icon="pi pi-plus"
            onClick={handleIncrement}
            disabled={localValue >= max}
            className="w-12 h-12 rounded-full bg-[#252540] border border-[#C9A84C]/50 text-[#C9A84C] hover:bg-[#C9A84C] hover:text-white transition-all"
            disabledClassName="opacity-50 cursor-not-allowed"
          />
        </div>

        {/* Help Text */}
        <p className="text-gray-500 text-sm">
          Puede asegurar entre {min} y {max} inmuebles
        </p>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <i className="pi pi-exclamation-circle"></i>
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}

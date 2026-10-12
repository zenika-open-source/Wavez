interface CheckboxDotProps {
  name: string;
  checked: boolean;
  color: string;
  onSelect: () => void;
  disabled?: boolean;
  /** Shows a dash instead of a checkmark, for a "some but not all selected" state. */
  indeterminate?: boolean;
}

// Square checkbox with a runtime-supplied color, used where a skill mode is
// toggled on/off directly rather than chosen among exclusive radio options.
export function CheckboxDot({
  name,
  checked,
  color,
  onSelect,
  disabled = false,
  indeterminate = false,
}: CheckboxDotProps) {
  const filled = checked || indeterminate;
  return (
    <label className={`flex justify-center ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}>
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onSelect}
        disabled={disabled}
        className="sr-only"
      />
      <span
        className={`flex h-[18px] w-[18px] flex-none items-center justify-center rounded-[5px] border-2 ${
          disabled ? "opacity-40" : ""
        }`}
        style={{
          borderColor: filled ? color : "#e3c9d3",
          background: filled ? color : "transparent",
        }}
      >
        {indeterminate ? (
          <span className="h-[2px] w-[10px] rounded-full bg-white" />
        ) : (
          checked && (
            <svg viewBox="0 0 12 12" className="h-[10px] w-[10px]" fill="none">
              <path
                d="M2.5 6.2L4.8 8.5L9.5 3.5"
                stroke="white"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )
        )}
      </span>
    </label>
  );
}

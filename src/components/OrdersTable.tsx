import { useState } from "react";

export function ToggleText({ text }: { text: string }) {
  const [expanded, setExpanded] = useState<boolean>(false);

  const toggle = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <>
      <div className={expanded ? "" : "truncate"} title={text}>
        {text}
      </div>

      {text && text.length > 40 && (
        <button
          type="button"
          onClick={() => toggle()}
          className="text-indigo-600 text-xs mt-1 hover:underline focus:outline-none">
          {!expanded ? "إظهار" : "إخفاء"}
        </button>
      )}
    </>
  );
}

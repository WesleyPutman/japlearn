import React, { useState } from "react";

export default function Input({ type = "text", value, onChange, placeholder = "", className = "", data = [], showSuggestions = false, onSelectSuggestion, ...props
}) {
  const [focused, setFocused] = useState(false);

  const suggestions = showSuggestions && value
    ? [...new Set(
        data.filter(item => 
          item?.toLowerCase().includes(value.toLowerCase())
        )
      )].slice(0, 10)
    : [];

  return (
    <div className={`relative ${className}`}>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} className="rounded-4xl bg-blue-900 h-12.5 w-full placeholder-white px-5" autoComplete="off" onFocus={() => setFocused(true)} onBlur={() => setTimeout(() => setFocused(false), 100)} {...props}/>
      {showSuggestions && focused && suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border w-full mt-1 rounded-2xl shadow ">
          {suggestions.map((s, i) => (
            <li key={i} className="px-3 py-2 hover:bg-gray-100 rounded-2xl cursor-pointer !text-black" onMouseDown={() => { onSelectSuggestion && onSelectSuggestion(s);}}>
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
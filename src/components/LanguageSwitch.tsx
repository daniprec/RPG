import type { Language } from "../game/types";

interface Props {
  language: Language;
  onChange: (language: Language) => void;
}

export function LanguageSwitch({ language, onChange }: Props) {
  return (
    <div className="language-switch" aria-label="Language / Idioma">
      {(["en", "es"] as Language[]).map((item) => (
        <button
          type="button"
          key={item}
          className={language === item ? "active" : ""}
          onClick={() => onChange(item)}
          aria-pressed={language === item}
        >
          {item.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

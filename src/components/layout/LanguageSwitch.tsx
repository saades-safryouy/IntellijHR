import type { Language } from '../../contexts/I18nContext'

export function LanguageSwitch({
  language,
  onChange,
}: {
  language: Language
  onChange: (language: Language) => void
}) {
  return (
    <div className="language-switcher">
      <button
        className={language === 'en' ? 'active' : ''}
        onClick={() => onChange('en')}
      >
        EN
      </button>

      <button
        className={language === 'fr' ? 'active' : ''}
        onClick={() => onChange('fr')}
      >
        FR
      </button>

      <button
        className={language === 'ar' ? 'active' : ''}
        onClick={() => onChange('ar')}
      >
        ع
      </button>
    </div>
  )
}

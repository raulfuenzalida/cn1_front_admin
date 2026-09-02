import { useTheme } from '../../context/ThemeContext';

/**
 * ThemeSwitch - Toggle switch para cambiar entre Light Mode y Dark Mode
 * 
 * Características:
 * - role="switch" y aria-checked para accesibilidad
 * - Navegación por teclado (Enter/Space)
 * - Estados visuales claros (sol/luna)
 * - Responsive en desktop y móvil
 */
const ThemeSwitch = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleTheme();
    }
  };

  return (
    <button
      className="theme-switch"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      onClick={toggleTheme}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <span className="theme-switch-track">
        <span className={`theme-switch-thumb ${isDark ? 'dark' : 'light'}`}>
          {isDark ? '🌙' : '☀️'}
        </span>
      </span>
      <span className="theme-switch-label d-none d-sm-inline">
        {isDark ? 'Oscuro' : 'Claro'}
      </span>
    </button>
  );
};

export default ThemeSwitch;

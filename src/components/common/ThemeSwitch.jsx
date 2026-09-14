import { useTheme } from '../../context/ThemeContext';

/**
 * ThemeSwitch - Toggle para cambiar entre Light Mode y Dark Mode.
 *
 * Características:
 * - role="switch" y aria-checked para accesibilidad
 * - Navegación por teclado (Enter/Space)
 * - Mantiene un diseño visual simple sin iconos ni etiquetas
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
      title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      onClick={toggleTheme}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <span className="theme-switch-track">
        <span
          className={`theme-switch-thumb ${isDark ? 'dark' : 'light'}`}
        />
      </span>
    </button>
  );
};

export default ThemeSwitch;
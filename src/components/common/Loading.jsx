import { Spinner } from 'react-bootstrap';

/**
 * Componente de carga para Suspense
 * 
 * Muestra un spinner con estilo consistente con PrintWorks
 * mientras se cargan componentes lazy-loaded.
 */
const Loading = () => {
  return (
    <div className="loading-spinner">
      <Spinner animation="border" role="status" style={{ color: 'var(--pw-primary)' }} />
      <p className="loading-text">Cargando...</p>
    </div>
  );
};

export default Loading;

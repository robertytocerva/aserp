/**
 * Componente para mostrar los logos institucionales.
 *
 * Uso:
 *   <LogoInstitucional tipo="principal" altura={50} />
 *   <LogoInstitucional tipo="programa" altura={40} />
 *
 * Para personalizar, coloca tus imágenes en:
 *   public/assets/logos/logo-itsuruapan.png
 *   public/assets/logos/logo-asesores-par.png
 */
function LogoInstitucional({ tipo = 'principal', altura = 50, className = '' }) {
  const rutas = {
    principal: '/assets/logos/logo-itsuruapan.png',
    programa:  '/assets/logos/logo-asesores-par.png',
  };

  const textos = {
    principal: 'ITSU Uruapan',
    programa:  'Asesorías Par',
  };

  return (
    <img
      src={rutas[tipo]}
      alt={textos[tipo]}
      style={{ height: `${altura}px`, objectFit: 'contain' }}
      className={className}
      onError={(e) => {
        // Si el logo no existe todavía, mostrar placeholder visual
        e.target.style.display = 'none';
        const placeholder = e.target.nextSibling;
        if (placeholder) placeholder.style.display = 'inline-flex';
      }}
    />
  );
}

/**
 * Placeholder que se ve mientras no subes el logo real.
 * Se oculta automáticamente cuando agregas la imagen.
 */
export function LogoPlaceholder({ texto = 'LOGO', altura = 50 }) {
  return (
    <div
      style={{
        display: 'none',
        height: `${altura}px`,
        minWidth: `${altura * 2.5}px`,
        border: '2px dashed var(--amarillo-primario)',
        borderRadius: '6px',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--amarillo-primario)',
        fontWeight: 'bold',
        fontSize: '11px',
        letterSpacing: '1px',
        padding: '0 10px',
        backgroundColor: 'rgba(255,255,255,0.1)',
      }}
    >
      {texto}
    </div>
  );
}

export default LogoInstitucional;
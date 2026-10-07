import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'aserp_sesion';

/**
 * Contexto de autenticación.
 *
 * ⚠️ IMPORTANTE: El backend actual no tiene autenticación real (no hay login
 * ni JWT). Por ahora simulamos la sesión guardando los datos del usuario en
 * localStorage. Cuando el backend implemente autenticación, se reemplaza la
 * función `login` por una llamada real a POST /api/auth/login.
 */
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Al montar, restaurar sesión desde localStorage
  useEffect(() => {
    try {
      const guardada = localStorage.getItem(STORAGE_KEY);
      if (guardada) {
        setUsuario(JSON.parse(guardada));
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setCargando(false);
    }
  }, []);

  /**
   * Login simulado.
   *
   * TODO: Cuando el backend tenga autenticación real, reemplazar por:
   *   const { data } = await axiosClient.post('/api/auth/login', { correo, password });
   *   setUsuario(data.usuario);
   *   localStorage.setItem(STORAGE_KEY, JSON.stringify(data.usuario));
   *
   * Por ahora, simulamos que cualquier correo con contraseña >= 4 caracteres
   * es válido, y el rol se determina por el dominio del correo:
   *   - admin@        → administrador
   *   - @uruapan...   → alumno
   */
  const login = ({ correo, password }) => {
    if (!correo || !password || password.length < 4) {
      throw new Error('Credenciales inválidas.');
    }

    let rol = 'alumno';
    if (correo.toLowerCase().startsWith('admin@')) {
      rol = 'administrador';
    } else if (correo.toLowerCase().includes('asesor')) {
      rol = 'asesor';
    }

    // Simulamos un usuario "autenticado"
    const usuarioSimulado = {
      idAlumno: 1,
      nombre: correo.split('@')[0],
      correo,
      rol,
      // Nota: idAsesor solo existiría si el alumno ya se registró como asesor
      idAsesor: rol === 'asesor' ? 1 : null,
    };

    setUsuario(usuarioSimulado);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarioSimulado));
    return usuarioSimulado;
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  /**
   * Después de un registro exitoso, iniciar sesión automáticamente.
   */
  const loginDesdeRegistro = (alumno) => {
    const usuarioNuevo = {
      idAlumno: alumno.idAlumno,
      nombre: alumno.nombre,
      correo: alumno.correo,
      rol: 'alumno',
      idAsesor: null,
    };
    setUsuario(usuarioNuevo);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usuarioNuevo));
    return usuarioNuevo;
  };

  const value = {
    usuario,
    cargando,
    estaLogueado: !!usuario,
    esAlumno: usuario?.rol === 'alumno',
    esAsesor: usuario?.rol === 'asesor',
    esAdmin: usuario?.rol === 'administrador',
    login,
    logout,
    loginDesdeRegistro,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }
  return ctx;
}
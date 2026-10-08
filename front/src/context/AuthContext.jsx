import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/authApi';
import { asesoresApi } from '../api/asesoresApi';
import axiosClient, { setToken, removeToken, getToken } from '../api/axiosClient';

const AuthContext = createContext(null);

const USUARIO_KEY = 'aserp_usuario';

/**
 * Contexto de autenticación REAL con JWT.
 */
export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Restaurar sesión al montar
  useEffect(() => {
    try {
      const token = getToken();
      const usuarioGuardado = localStorage.getItem(USUARIO_KEY);
      if (token && usuarioGuardado) {
        setUsuario(JSON.parse(usuarioGuardado));
      } else {
        removeToken();
        localStorage.removeItem(USUARIO_KEY);
      }
    } catch {
      removeToken();
      localStorage.removeItem(USUARIO_KEY);
    } finally {
      setCargando(false);
    }
  }, []);

  /**
   * Busca el perfil de asesor del alumno logueado.
   * Devuelve el asesor si existe, o null.
   */
  const buscarPerfilAsesor = useCallback(async (idAlumno) => {
    if (!idAlumno) return null;
    try {
      const lista = await asesoresApi.listarTodos();
      return lista.find((a) => a.idAlumno === idAlumno) || null;
    } catch {
      return null;
    }
  }, []);

  /**
   * Login real contra el backend.
   */
  const login = useCallback(async ({ correo, password }) => {
    const data = await authApi.login({ correo, password });
    setToken(data.token);

    let usuarioCompleto = {
      idUsuario: data.idUsuario,
      idAlumno: data.idAlumno,
      idAsesor: null,
      rol: data.rol,
      correo,
      nombre: correo.split('@')[0],
      nombreCompleto: correo.split('@')[0],
    };

    // Si es alumno o asesor, traer datos completos
    if (data.idAlumno) {
      try {
        const { data: alumno } = await axiosClient.get(`/api/alumnos/${data.idAlumno}`);
        usuarioCompleto = {
          ...usuarioCompleto,
          nombre: alumno.nombre,
          apellidoPaterno: alumno.apellidoPaterno,
          apellidoMaterno: alumno.apellidoMaterno,
          nombreCompleto: `${alumno.nombre} ${alumno.apellidoPaterno}`.trim(),
          idCarrera: alumno.idCarrera,
          nombreCarrera: alumno.nombreCarrera,
          semestre: alumno.semestre,
          matricula: alumno.matricula,
        };

        // Buscar si ya tiene perfil de asesor
        const asesor = await buscarPerfilAsesor(data.idAlumno);
        if (asesor) {
          usuarioCompleto.idAsesor = asesor.idAsesor;
          usuarioCompleto.asesorValidado = asesor.validado;
          usuarioCompleto.asesorActivo = asesor.activo;
        }
      } catch {
        // Si falla, seguimos con los datos básicos
      }
    } else if (data.rol === 'ADMIN') {
      usuarioCompleto.nombreCompleto = 'Administrador';
    }

    setUsuario(usuarioCompleto);
    localStorage.setItem(USUARIO_KEY, JSON.stringify(usuarioCompleto));
    return usuarioCompleto;
  }, [buscarPerfilAsesor]);

  const logout = useCallback(() => {
    removeToken();
    localStorage.removeItem(USUARIO_KEY);
    setUsuario(null);
  }, []);

  /**
   * Refresca la info del usuario desde el backend.
   * Útil después de postularse como asesor.
   */
  const refrescarUsuario = useCallback(async () => {
    if (!usuario?.idAlumno) return usuario;

    try {
      const { data: alumno } = await axiosClient.get(`/api/alumnos/${usuario.idAlumno}`);
      const asesor = await buscarPerfilAsesor(usuario.idAlumno);

      const actualizado = {
        ...usuario,
        nombre: alumno.nombre,
        nombreCompleto: `${alumno.nombre} ${alumno.apellidoPaterno}`.trim(),
        nombreCarrera: alumno.nombreCarrera,
        semestre: alumno.semestre,
        idAsesor: asesor?.idAsesor || null,
        asesorValidado: asesor?.validado ?? null,
        asesorActivo: asesor?.activo ?? null,
      };

      setUsuario(actualizado);
      localStorage.setItem(USUARIO_KEY, JSON.stringify(actualizado));
      return actualizado;
    } catch {
      return usuario;
    }
  }, [usuario, buscarPerfilAsesor]);

  const value = {
    usuario,
    cargando,
    estaLogueado: !!usuario,
    esAlumno: usuario?.rol === 'ALUMNO',
    esAsesor: usuario?.rol === 'ASESOR',
    esAdmin: usuario?.rol === 'ADMIN',
    tienePerfilAsesor: !!usuario?.idAsesor,
    login,
    logout,
    refrescarUsuario,
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
import { Routes, Route, Navigate } from 'react-router-dom';

import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import PanelAsesorLayout from './components/layout/PanelAsesorLayout';
import RutaProtegida from './components/ui/RutaProtegida';

// Públicas
import Home from './pages/Home';
import Login from './pages/Login';
import RegistroAlumno from './pages/RegistroAlumno';
import Asesores from './pages/Asesores';
import PerfilAsesor from './pages/PerfilAsesor';
import Programa from './pages/Programa';
import PostularAsesor from './pages/PostularAsesor';
import NoEncontrada from './pages/NoEncontrada';

// Solicitudes
import MisSolicitudes from './pages/MisSolicitudes';

// Admin
import DashboardAdmin from './pages/admin/Dashboard';
import GestionAsesores from './pages/admin/GestionAsesores';
import GestionMaterias from './pages/admin/GestionMaterias';
import Solicitudes from './pages/admin/Solicitudes';
import Bitacoras from './pages/admin/Bitacoras';
import Reportes from './pages/admin/Reportes';

// Asesor
import DashboardAsesor from './pages/asesor/Dashboard';
import MisHorarios from './pages/asesor/MisHorarios';
import SolicitudesRecibidas from './pages/asesor/SolicitudesRecibidas';
import Agenda from './pages/asesor/Agenda';

function App() {
  return (
    <Routes>
      {/* ============ PÚBLICAS ============ */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<RegistroAlumno />} />
        <Route path="/asesores" element={<Asesores />} />
        <Route path="/asesores/:id" element={<PerfilAsesor />} />
        <Route path="/programa" element={<Programa />} />

        {/* 404 dentro del layout público */}
        <Route path="/404" element={<NoEncontrada />} />
      </Route>

      {/* ============ PROTEGIDAS (cualquier logueado) ============ */}
      <Route
        element={
          <RutaProtegida>
            <Layout />
          </RutaProtegida>
        }
      >
        <Route path="/postular-asesor" element={<PostularAsesor />} />
        <Route path="/mis-solicitudes" element={<MisSolicitudes />} />
      </Route>

      {/* ============ ADMIN ============ */}
      <Route
        element={
          <RutaProtegida rolRequerido="ADMIN">
            <Layout />
          </RutaProtegida>
        }
      >
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardAdmin />} />
          <Route path="asesores" element={<GestionAsesores />} />
          <Route path="materias" element={<GestionMaterias />} />
          <Route path="solicitudes" element={<Solicitudes />} />
          <Route path="bitacoras" element={<Bitacoras />} />
          <Route path="reportes" element={<Reportes />} />
        </Route>
      </Route>

      {/* ============ ASESOR ============ */}
      <Route
        element={
          <RutaProtegida rolRequerido="ASESOR">
            <Layout />
          </RutaProtegida>
        }
      >
        <Route path="/panel-asesor" element={<PanelAsesorLayout />}>
          <Route index element={<DashboardAsesor />} />
        </Route>
        <Route path="/mis-horarios" element={<PanelAsesorLayout />}>
          <Route index element={<MisHorarios />} />
        </Route>
        <Route path="/solicitudes-recibidas" element={<PanelAsesorLayout />}>
          <Route index element={<SolicitudesRecibidas />} />
        </Route>
        <Route path="/mi-agenda" element={<PanelAsesorLayout />}>
          <Route index element={<Agenda />} />
        </Route>
      </Route>

      {/* ============ 404 GLOBAL ============ */}
      <Route element={<Layout />}>
        <Route path="*" element={<NoEncontrada />} />
      </Route>
    </Routes>
  );
}

export default App;
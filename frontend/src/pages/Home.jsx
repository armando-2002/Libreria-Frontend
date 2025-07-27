import React, { useState, useEffect } from "react";
import "../css/Home.css";
// import axios from "axios"; // Descomenta si usarás Axios para llamadas al backend

const Home = () => {
  const [usuario, setUsuario] = useState({
    nombre: "Juan",
    apellido1: "Pérez",
    apellido2: "Gómez",
    email: "juan.perez@ejemplo.com",
    estado: "ACTIVO",
    tipo: "ALUMNO",
    telefonoPadres: "0999999999",
    departamento: "Matemáticas"
  });

  const [librosRecomendados, setLibrosRecomendados] = useState([
    { id: 1, titulo: "Cien años de soledad", autor: "Gabriel García Márquez" },
    { id: 2, titulo: "Don Quijote de la Mancha", autor: "Miguel de Cervantes" },
    { id: 3, titulo: "La sombra del viento", autor: "Carlos Ruiz Zafón" }
  ]);

  const [historialPrestamos, setHistorialPrestamos] = useState([
    {
      id: 1,
      tituloLibro: "1984",
      fechaPrestamo: "2023-05-01",
      fechaPrevista: "2023-05-10",
      fechaDevolucion: "2023-05-09",
      estado: true
    },
    {
      id: 2,
      tituloLibro: "El principito",
      fechaPrestamo: "2023-06-01",
      fechaPrevista: "2023-06-10",
      fechaDevolucion: "2023-06-15",
      estado: true
    }
  ]);

  const [historialMultas, setHistorialMultas] = useState([
    {
      id: 1,
      fechaInicio: "2023-06-16",
      diasAcumulados: 5,
      fechaFin: "2023-06-21"
    }
  ]);

  // Descomenta este bloque cuando tengas un backend configurado
  /*
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resUsuario = await axios.get("/api/usuario/logeado"); // Ajusta endpoint
        setUsuario(resUsuario.data);

        const resLibros = await axios.get("/api/libros/recomendados");
        setLibrosRecomendados(resLibros.data);

        const resPrestamos = await axios.get("/api/prestamos/historial");
        setHistorialPrestamos(resPrestamos.data);

        const resMultas = await axios.get("/api/multas/historial");
        setHistorialMultas(resMultas.data);

      } catch (error) {
        console.error("Error al cargar los datos:", error);
      }
    };

    fetchData();
  }, []);
  */

  return (
    <div className="home-container">
      <div className="home-left">
        {/* Botón de Catálogo de Libros */}
        <div className="catalogo-boton-container">
        <button className="catalogo-boton">
            📖 Catálogo de Libros
        </button>
      </div>
        <div className="home-section">
          <h2>📚 Libros Recomendados</h2>
          <ul>
            {librosRecomendados.map((libro) => (
              <li key={libro.id}>
                <strong>{libro.titulo}</strong> — {libro.autor}
              </li>
            ))}
          </ul>
        </div>

        <div className="home-section">
          <h2>📘 Historial de Préstamos</h2>
          <table>
            <thead>
              <tr>
                <th>Título</th>
                <th>Fecha Préstamo</th>
                <th>Fecha Prevista</th>
                <th>Fecha Devolución</th>
                <th>Devuelto</th>
              </tr>
            </thead>
            <tbody>
              {historialPrestamos.map((p) => (
                <tr key={p.id}>
                  <td>{p.tituloLibro}</td>
                  <td>{p.fechaPrestamo}</td>
                  <td>{p.fechaPrevista}</td>
                  <td>{p.fechaDevolucion}</td>
                  <td>{p.estado ? "Sí" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="home-section">
          <h2>💰 Historial de Multas</h2>
          <table>
            <thead>
              <tr>
                <th>Fecha Inicio</th>
                <th>Días Acumulados</th>
                <th>Fecha Fin</th>
              </tr>
            </thead>
            <tbody>
              {historialMultas.map((m) => (
                <tr key={m.id}>
                  <td>{m.fechaInicio}</td>
                  <td>{m.diasAcumulados}</td>
                  <td>{m.fechaFin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="home-right">
        <h2>👤 Perfil del Usuario</h2>
        <p><strong>Nombre:</strong> {usuario.nombre} {usuario.apellido1} {usuario.apellido2}</p>
        <p><strong>Email:</strong> {usuario.email}</p>
        <p><strong>Estado:</strong> {usuario.estado}</p>
        <p><strong>Tipo:</strong> {usuario.tipo}</p>
        {usuario.tipo === "ALUMNO" && (
          <p><strong>Teléfono Padres:</strong> {usuario.telefonoPadres}</p>
        )}
        {usuario.tipo === "PROFESOR" && (
          <p><strong>Departamento:</strong> {usuario.departamento}</p>
        )}
        {/* Botón de cerrar sesión */}
        <button
        className="cerrar-sesion-boton"
        onClick={() => {
        localStorage.removeItem("token");
        // window.location.href = "/login"; // Redirige al Login cuando esté disponible
        }}
        >
        Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default Home;

import { Link } from "react-router-dom";
import {
  FaChartLine,
  FaCheckCircle,
  FaColumns,
  FaLightbulb,
  FaRegClock,
  FaRoute,
} from "react-icons/fa";

const capabilities = [
  {
    icon: <FaLightbulb />,
    title: "Objetivos claros",
    description:
      "Define el resultado que quieres alcanzar, organiza prioridades y mantén visible el propósito de cada iniciativa.",
  },
  {
    icon: <FaRoute />,
    title: "Metas accionables",
    description:
      "Divide cada objetivo en metas medibles para avanzar por etapas sin perder el contexto del proyecto.",
  },
  {
    icon: <FaCheckCircle />,
    title: "Actividades concretas",
    description:
      "Crea tareas, asigna estados, fechas límite y responsables para convertir la planificación en ejecución diaria.",
  },
  {
    icon: <FaChartLine />,
    title: "Dashboard inteligente",
    description:
      "Consulta métricas de avance, vencimientos y trabajo próximo para tomar mejores decisiones con datos actualizados.",
  },
  {
    icon: <FaColumns />,
    title: "Flujo visual",
    description:
      "Revisa el trabajo en tableros y grillas de planificación para detectar bloqueos, cargas y próximos pasos.",
  },
  {
    icon: <FaRegClock />,
    title: "Seguimiento de horas",
    description:
      "Registra tiempo invertido en actividades y compara esfuerzo real contra el avance de objetivos y metas.",
  },
];

const steps = [
  "Crea un objetivo principal con una descripción breve y una fecha esperada.",
  "Agrega metas relacionadas para dividir el objetivo en resultados intermedios.",
  "Carga actividades dentro de cada meta, define prioridad, estado y vencimiento.",
  "Actualiza avances desde el dashboard, la grilla o el detalle de cada elemento.",
];

const Landing = () => {
  return (
    <main className="landing-page">
      <nav className="landing-nav" aria-label="Navegación principal">
        <Link to="/" className="landing-brand" aria-label="A.M.O. iQ inicio">
          <img src="/1.png" alt="" className="landing-brand__logo" />
          <span>A.M.O. iQ</span>
        </Link>

        <div className="landing-nav__actions">
          <a href="#capacidades">Capacidades</a>
          <a href="#uso">Cómo usarla</a>
          <Link to="/verify-email">Registarse</Link>
          <Link to="/login" className="landing-nav__button">
            Iniciar sesión
          </Link>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="landing-hero__content">
          <span className="landing-kicker">Actividades, Metas & Objetivos Inteligentes</span>
          <h1>Gestiona proyectos desde la estrategia hasta la acción diaria.</h1>
          <p>
            A.M.O. iQ centraliza objetivos, metas, actividades, métricas y tiempos para que tu equipo trabaje con foco,
            claridad y seguimiento continuo.
          </p>

          <div className="landing-hero__actions">
            <Link to="/login" className="pm-button landing-cta">
              Entrar a la app
            </Link>
            <a href="#uso" className="pm-button pm-button-secondary landing-cta">
              Ver cómo funciona
            </a>
            <Link to="/verify-email" className="pm-button pm-button-secondary landing-cta">
              <Registrarse></Registrarse>
            </Link>

          </div>
        </div>

        <div className="landing-preview" aria-label="Resumen visual de la aplicación">
          <div className="landing-preview__header">
            <span />
            <span />
            <span />
          </div>
          <div className="landing-preview__body">
            <div className="landing-preview__metric">
              <span>Avance general</span>
              <strong>78%</strong>
            </div>
            <div className="landing-preview__bar"><span style={{ width: "78%" }} /></div>
            <div className="landing-preview__grid">
              <div>Objetivos<br /><strong>12</strong></div>
              <div>Metas<br /><strong>34</strong></div>
              <div>Actividades<br /><strong>128</strong></div>
            </div>
          </div>
        </div>
      </section>

      <section id="capacidades" className="landing-section">
        <div className="landing-section__header">
          <span className="landing-kicker">Capacidades</span>
          <h2>Todo lo necesario para planificar, ejecutar y medir.</h2>
        </div>

        <div className="landing-capabilities">
          {capabilities.map((capability) => (
            <article className="landing-capability pm-card" key={capability.title}>
              <div className="landing-capability__icon">{capability.icon}</div>
              <h3>{capability.title}</h3>
              <p>{capability.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="uso" className="landing-section landing-how">
        <div className="landing-section__header">
          <span className="landing-kicker">Uso resumido</span>
          <h2>De una idea a un plan controlado en cuatro pasos.</h2>
        </div>

        <ol className="landing-steps">
          {steps.map((step, index) => (
            <li key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{step}</p>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
};

export default Landing;

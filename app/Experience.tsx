"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type RouteName = "salto" | "paisaje" | "azar" | null;
type Sample = { x: number; y: number; inside: boolean };

type Cell = {
  id: number;
  index: string;
  label: string;
  title: string;
  eyebrow: string;
  prompt: string;
  paragraphs: string[];
};

const cells: Cell[] = [
  {
    id: 0,
    index: "00",
    label: "Umbral",
    title: "Una ventana no es el mundo",
    eyebrow: "Punto de partida",
    prompt: "¿Qué aparece cuando elegimos una forma de mirar?",
    paragraphs: [
      "Esta experiencia toma el título de la sesión como una consigna de lectura: las matemáticas no sustituyen el mundo que habitamos; abren una ventana para reconocer relaciones, escalas, regularidades e incertidumbres.",
      "El recorrido no tiene un orden obligatorio. Como en Rayuela, el sentido cambia con cada salto. Como en María, el paisaje deja de ser fondo y se vuelve una presencia que organiza distancias, ritmos y afectos.",
    ],
  },
  {
    id: 1,
    index: "01",
    label: "Patrón",
    title: "Encontrar una relación",
    eyebrow: "Matemáticas / observación",
    prompt: "Un número aislado informa poco; una relación comienza a explicar.",
    paragraphs: [
      "Contar no consiste solamente en acumular cantidades. También permite comparar, encontrar repeticiones y formular preguntas sobre aquello que permanece cuando todo parece cambiar.",
      "Una secuencia convierte observaciones dispersas en una estructura. Esa estructura no elimina la singularidad de cada caso: ofrece un lenguaje para ponerlos en relación.",
    ],
  },
  {
    id: 2,
    index: "02",
    label: "Escala",
    title: "Cambiar la distancia",
    eyebrow: "María / paisaje",
    prompt: "La misma forma puede contar historias distintas según la escala.",
    paragraphs: [
      "En María, el paisaje participa de la narración: caminos, vegetación, clima y lejanía modulan la experiencia de los personajes. Mirarlo matemáticamente no significa reducirlo a cifras, sino preguntar por proporciones, duraciones y transformaciones.",
      "De la nervadura de una hoja al contorno de un valle, cambiar de escala revela patrones nuevos y también impone límites a lo que podemos observar.",
    ],
  },
  {
    id: 3,
    index: "03",
    label: "Modelo",
    title: "Trazar sin confundir",
    eyebrow: "Matemáticas / representación",
    prompt: "Todo modelo ilumina una relación y deja otras fuera del marco.",
    paragraphs: [
      "Una ecuación es una representación deliberadamente incompleta. Su potencia reside en seleccionar variables, proponer vínculos y permitir que una idea sea examinada.",
      "La ventana matemática es valiosa precisamente porque tiene bordes: obliga a reconocer qué estamos midiendo, qué suponemos y qué parte del mundo permanece fuera.",
    ],
  },
  {
    id: 4,
    index: "04",
    label: "Azar",
    title: "Medir la incertidumbre",
    eyebrow: "Probabilidad / aproximación",
    prompt: "No saber con certeza no equivale a no poder comprender.",
    paragraphs: [
      "La probabilidad ofrece una forma rigurosa de trabajar con lo incierto. Al repetir una experiencia aleatoria, un comportamiento colectivo puede emerger aun cuando cada resultado individual sea imprevisible.",
      "Comprender el mundo exige aceptar esta tensión: medir no siempre produce una respuesta exacta, pero puede acercarnos de manera verificable.",
    ],
  },
  {
    id: 5,
    index: "05",
    label: "Salto",
    title: "Leer como un grafo",
    eyebrow: "Rayuela / estructura",
    prompt: "¿Y si el orden de lectura fuera también una forma de conocimiento?",
    paragraphs: [
      "Rayuela convierte el orden en una decisión del lector. Sus capítulos pueden entenderse como nodos y sus posibles recorridos como conexiones: una arquitectura próxima a la idea matemática de grafo.",
      "El libro muestra que cambiar la secuencia no modifica únicamente el camino; transforma las relaciones que percibimos y, con ellas, el sentido construido.",
    ],
  },
  {
    id: 6,
    index: "06",
    label: "Paisaje",
    title: "Habitar una geometría sensible",
    eyebrow: "María / territorio",
    prompt: "El espacio narrado también tiene ritmos, límites y recorridos.",
    paragraphs: [
      "En María, la naturaleza acompaña la memoria y la pérdida. El territorio se organiza por retornos, separaciones y distancias que no son únicamente físicas: cada lugar adquiere una intensidad afectiva.",
      "La mirada matemática permite interrogar esa organización espacial sin agotar su dimensión humana. Una coordenada localiza; la literatura revela lo que significa estar allí.",
    ],
  },
  {
    id: 7,
    index: "07",
    label: "Ventana",
    title: "Entender es relacionar",
    eyebrow: "Confluencia",
    prompt: "La fórmula, el relato y el paisaje son modos distintos de construir relaciones.",
    paragraphs: [
      "Las matemáticas hacen visible la estructura; la literatura hace sensible la experiencia. Juntas recuerdan que comprender el mundo implica reconocer patrones sin borrar diferencias y construir modelos sin confundirlos con la realidad.",
      "La ventana permanece abierta: no ofrece una vista definitiva, sino una posición desde la cual observar mejor, formular nuevas preguntas y elegir el siguiente salto.",
    ],
  },
  {
    id: 8,
    index: "08",
    label: "Archivo",
    title: "Referencias del recorrido",
    eyebrow: "Registro / APA",
    prompt: "Las fuentes también forman una constelación.",
    paragraphs: [
      "Las referencias se presentan alfabéticamente. Los datos editoriales corresponden a las primeras ediciones y pueden ajustarse posteriormente a los ejemplares consultados.",
    ],
  },
];

const routeMap: Record<Exclude<RouteName, null>, number[]> = {
  salto: [0, 5, 1, 3, 4, 7, 8],
  paisaje: [0, 6, 2, 1, 3, 7, 8],
  azar: [0, 4, 2, 5, 3, 6, 1, 7, 8],
};

const references = [
  "Cortázar, J. (1963). Rayuela. Editorial Sudamericana.",
  "Isaacs, J. (1867). María. Imprenta de José Benito Gaitán.",
  "Maya López, J. C. (2026). Las matemáticas: ‘una ventana para entender el mundo que habitamos’ [Conferencia]. Cátedra APUN, Universidad Nacional de Colombia.",
  "Sierra, B. M. A., Sierra, L. A., & Zapata, O. O. (2012). Propuesta de una estructura de clase basada en orientación intrínseca y aprendizaje autorregulado para el estudio de un tema de dinámica y su aplicación en investigación en el aula y puesta en práctica siguiendo los principios del Acuerdo 033 (2007).",
];

function AmbientField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let frame = 0;
    let width = 0;
    let height = 0;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height);
      context.lineWidth = 1;
      context.strokeStyle = "rgba(235, 229, 211, 0.055)";
      const grid = 44;
      for (let x = 0; x <= width; x += grid) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, height);
        context.stroke();
      }
      for (let y = 0; y <= height; y += grid) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.stroke();
      }

      const phase = reduced ? 0 : time * 0.00018;
      context.beginPath();
      for (let x = -20; x <= width + 20; x += 5) {
        const y = height * 0.5 + Math.sin(x * 0.012 + phase) * height * 0.16 + Math.cos(x * 0.004 - phase) * 32;
        if (x === -20) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.strokeStyle = "rgba(220, 255, 92, 0.13)";
      context.lineWidth = 1.25;
      context.stroke();

      for (let i = 0; i < 11; i += 1) {
        const x = (width / 10) * i;
        const y = height * 0.5 + Math.sin(x * 0.012 + phase) * height * 0.16 + Math.cos(x * 0.004 - phase) * 32;
        context.beginPath();
        context.arc(x, y, i % 3 === 0 ? 3.2 : 1.8, 0, Math.PI * 2);
        context.fillStyle = i % 3 === 0 ? "rgba(255, 96, 70, 0.62)" : "rgba(235, 229, 211, 0.35)";
        context.fill();
      }

      if (!reduced) frame = window.requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    frame = window.requestAnimationFrame(draw);
    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas className="ambient-field" ref={canvasRef} aria-hidden="true" />;
}

function PatternLab() {
  const [n, setN] = useState(5);
  const triangular = (n * (n + 1)) / 2;

  return (
    <div className="lab pattern-lab" aria-label="Laboratorio de patrones numéricos">
      <div className="lab-heading">
        <span>OBSERVACIÓN N.º {String(n).padStart(2, "0")}</span>
        <span>mueve el control</span>
      </div>
      <input aria-label="Número de la secuencia" type="range" min="1" max="12" value={n} onChange={(event) => setN(Number(event.target.value))} />
      <div className="number-relations">
        <div><small>n</small><strong>{n}</strong></div>
        <div><small>n²</small><strong>{n * n}</strong></div>
        <div><small>Σ 1…n</small><strong>{triangular}</strong></div>
      </div>
      <p>El mismo valor ocupa tres relaciones distintas. El patrón aparece al comparar.</p>
    </div>
  );
}

function ScaleLab() {
  const [scale, setScale] = useState(38);
  const stops = [
    { max: 22, label: "nervadura", measure: "milímetros" },
    { max: 48, label: "jardín", measure: "metros" },
    { max: 74, label: "hacienda", measure: "hectáreas" },
    { max: 101, label: "valle", measure: "kilómetros" },
  ];
  const current = stops.find((stop) => scale < stop.max) ?? stops[stops.length - 1];

  return (
    <div className="lab scale-lab" style={{ "--lens-scale": 0.7 + scale / 70 } as React.CSSProperties}>
      <div className="contour-field" aria-hidden="true"><i /><i /><i /><i /></div>
      <div className="scale-copy">
        <span>ESCALA DE OBSERVACIÓN</span>
        <strong>{current.label}</strong>
        <small>{current.measure}</small>
      </div>
      <input aria-label="Escala del paisaje" type="range" min="0" max="100" value={scale} onChange={(event) => setScale(Number(event.target.value))} />
    </div>
  );
}

function ModelLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [slope, setSlope] = useState(1.2);
  const [intercept, setIntercept] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);

    context.strokeStyle = "rgba(235,229,211,.16)";
    context.lineWidth = 1;
    for (let x = 0; x <= width; x += width / 8) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, height);
      context.stroke();
    }
    for (let y = 0; y <= height; y += height / 6) {
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(width, y);
      context.stroke();
    }

    context.strokeStyle = "rgba(220,255,92,.95)";
    context.lineWidth = 2.2;
    context.beginPath();
    for (let px = 0; px <= width; px += 2) {
      const x = (px / width) * 8 - 4;
      const y = slope * x + intercept;
      const py = height / 2 - (y / 8) * height;
      if (px === 0) context.moveTo(px, py);
      else context.lineTo(px, py);
    }
    context.stroke();
  }, [slope, intercept]);

  return (
    <div className="lab model-lab">
      <div className="model-formula">y = <em>{slope.toFixed(1)}</em>x {intercept >= 0 ? "+" : "−"} <em>{Math.abs(intercept).toFixed(1)}</em></div>
      <canvas ref={canvasRef} aria-label="Gráfica del modelo lineal" />
      <label>pendiente <input aria-label="Pendiente" type="range" min="-3" max="3" step="0.1" value={slope} onChange={(event) => setSlope(Number(event.target.value))} /></label>
      <label>origen <input aria-label="Intercepto" type="range" min="-3" max="3" step="0.1" value={intercept} onChange={(event) => setIntercept(Number(event.target.value))} /></label>
    </div>
  );
}

function ChanceLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [samples, setSamples] = useState<Sample[]>([]);
  const inside = samples.filter((sample) => sample.inside).length;
  const estimate = samples.length ? (4 * inside) / samples.length : 0;

  const addSamples = () => {
    const next = Array.from({ length: 180 }, () => {
      const x = Math.random();
      const y = Math.random();
      return { x, y, inside: x * x + y * y <= 1 };
    });
    setSamples((previous) => [...previous, ...next].slice(-1800));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    context.clearRect(0, 0, width, height);
    context.strokeStyle = "rgba(235,229,211,.38)";
    context.strokeRect(0.5, 0.5, width - 1, height - 1);
    context.beginPath();
    context.arc(0, height, Math.min(width, height), -Math.PI / 2, 0);
    context.strokeStyle = "rgba(220,255,92,.8)";
    context.stroke();
    samples.forEach((sample) => {
      context.fillStyle = sample.inside ? "rgba(220,255,92,.62)" : "rgba(255,96,70,.72)";
      context.fillRect(sample.x * width - 1, height - sample.y * height - 1, 2, 2);
    });
  }, [samples]);

  return (
    <div className="lab chance-lab">
      <canvas ref={canvasRef} aria-label="Estimación probabilística de pi" />
      <div className="chance-result"><span>π ≈</span><strong>{samples.length ? estimate.toFixed(4) : "—"}</strong><small>{samples.length} puntos</small></div>
      <button type="button" onClick={addSamples}>Lanzar 180 puntos</button>
    </div>
  );
}

function LiteraryMap({ focus }: { focus: "rayuela" | "maria" }) {
  const [selected, setSelected] = useState(focus === "rayuela" ? "orden" : "distancia");
  const options = focus === "rayuela"
    ? [
        ["orden", "La secuencia también produce significado."],
        ["nodo", "Cada capítulo adquiere sentido por sus conexiones."],
        ["lector", "Elegir un camino convierte la lectura en acción."],
      ]
    : [
        ["distancia", "La separación física intensifica la memoria."],
        ["ritmo", "Los retornos del paisaje organizan el relato."],
        ["lugar", "Una coordenada se vuelve experiencia vivida."],
      ];
  const current = options.find(([key]) => key === selected) ?? options[0];

  return (
    <div className={`lab literary-map ${focus}`}>
      <div className="literary-nodes">
        {options.map(([key]) => (
          <button type="button" className={selected === key ? "selected" : ""} onClick={() => setSelected(key)} key={key}>{key}</button>
        ))}
      </div>
      <p>{current[1]}</p>
    </div>
  );
}

function SynthesisLab() {
  const [aperture, setAperture] = useState(56);
  const labels = aperture < 34 ? ["precisión", "detalle"] : aperture < 68 ? ["relación", "contexto"] : ["complejidad", "pregunta"];
  return (
    <div className="lab synthesis-lab">
      <div className="aperture" style={{ "--aperture": `${aperture}%` } as React.CSSProperties} aria-hidden="true"><i /><i /></div>
      <label>
        apertura de la mirada
        <input aria-label="Apertura de la mirada" type="range" min="10" max="90" value={aperture} onChange={(event) => setAperture(Number(event.target.value))} />
      </label>
      <div className="aperture-labels"><span>{labels[0]}</span><span>{labels[1]}</span></div>
    </div>
  );
}

export default function Experience() {
  const [activeId, setActiveId] = useState(0);
  const [routeName, setRouteName] = useState<RouteName>(null);
  const [route, setRoute] = useState<number[]>([]);
  const [visited, setVisited] = useState<number[]>([0]);
  const active = cells[activeId];

  const openCell = useCallback((id: number) => {
    setActiveId(id);
    setVisited((previous) => previous.includes(id) ? previous : [...previous, id]);
  }, []);

  const chooseRoute = useCallback((name: Exclude<RouteName, null>) => {
    let nextRoute = routeMap[name];
    if (name === "azar") {
      const middle = [1, 2, 3, 4, 5, 6].sort(() => Math.random() - 0.5);
      nextRoute = [0, ...middle, 7, 8];
    }
    setRouteName(name);
    setRoute(nextRoute);
    openCell(nextRoute[1]);
  }, [openCell]);

  const nextInRoute = useMemo(() => {
    if (!route.length) return null;
    const currentIndex = route.indexOf(activeId);
    return route[(currentIndex + 1) % route.length];
  }, [route, activeId]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLButtonElement) return;
      if (/^[0-8]$/.test(event.key)) openCell(Number(event.key));
      if (event.key === "ArrowRight" || event.key === "ArrowDown") openCell(nextInRoute ?? (activeId + 1) % cells.length);
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") openCell(activeId === 0 ? cells.length - 1 : activeId - 1);
      if (event.key === "Escape") openCell(0);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeId, nextInRoute, openCell]);

  const renderLab = () => {
    if (activeId === 1) return <PatternLab />;
    if (activeId === 2) return <ScaleLab />;
    if (activeId === 3) return <ModelLab />;
    if (activeId === 4) return <ChanceLab />;
    if (activeId === 5) return <LiteraryMap focus="rayuela" />;
    if (activeId === 6) return <LiteraryMap focus="maria" />;
    if (activeId === 7) return <SynthesisLab />;
    if (activeId === 8) {
      return <ol className="references">{references.map((reference) => <li key={reference}>{reference}</li>)}</ol>;
    }
    return (
      <div className="route-picker" aria-label="Elegir un recorrido">
        <button type="button" onClick={() => chooseRoute("salto")}><span>A</span><strong>Ruta salto</strong><small>Rayuela → modelo → incertidumbre</small></button>
        <button type="button" onClick={() => chooseRoute("paisaje")}><span>B</span><strong>Ruta paisaje</strong><small>María → escala → relación</small></button>
        <button type="button" onClick={() => chooseRoute("azar")}><span>?</span><strong>Ruta aleatoria</strong><small>el orden se decide al entrar</small></button>
      </div>
    );
  };

  return (
    <main className="experience">
      <AmbientField />
      <aside className="index-rail" aria-label="Datos de la sesión">
        <div className="rail-mark">∴</div>
        <div className="rail-title">MATEMÁTICAS<br />× LITERATURA</div>
        <div className="rail-session">CÁTEDRA APUN<br />MEDELLÍN · 2026</div>
        <div className="rail-count">{visited.length}/9</div>
      </aside>

      <section className="board-zone" aria-label="Rayuela de capítulos">
        <header className="board-header">
          <div>
            <span>ENSAYO INTERACTIVO / SESIÓN</span>
            <h1>Rayuela para<br />entender el mundo</h1>
          </div>
          <div className="route-status">
            <span>RECORRIDO</span>
            <strong>{routeName ?? "libre"}</strong>
          </div>
        </header>

        <div className="hopscotch">
          {cells.map((cell) => {
            const routePosition = route.indexOf(cell.id);
            return (
              <button
                type="button"
                key={cell.id}
                className={`hop-cell cell-${cell.id} ${activeId === cell.id ? "active" : ""} ${visited.includes(cell.id) ? "visited" : ""} ${routePosition >= 0 ? "on-route" : ""}`}
                onClick={() => openCell(cell.id)}
                aria-pressed={activeId === cell.id}
                style={{ "--route-order": routePosition } as React.CSSProperties}
              >
                <span className="cell-index">{cell.index}</span>
                <span className="cell-label">{cell.label}</span>
                {routePosition >= 0 && <i>{routePosition + 1}</i>}
              </button>
            );
          })}
        </div>

        <div className="board-instruction">
          <span>clic / teclas 0–8 / flechas</span>
          <button type="button" onClick={() => chooseRoute("azar")}>barajar recorrido ↻</button>
        </div>
      </section>

      <article className="reading-window" key={activeId} aria-live="polite">
        <div className="window-grid" aria-hidden="true"><i /><i /><i /></div>
        <header className="window-header">
          <span>{active.eyebrow}</span>
          <strong>{active.index} / 08</strong>
        </header>
        <div className="window-content">
          <p className="window-label">{active.label}</p>
          <h2>{active.title}</h2>
          <p className="window-prompt">{active.prompt}</p>
          <div className="window-copy">
            {active.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
          {renderLab()}
        </div>

        {activeId === 0 && (
          <div className="speaker-card">
            <span>SESIÓN</span>
            <strong>Juan Carlos Maya López</strong>
            <p>Profesor asociado · Universidad Nacional de Colombia<br />Ingeniero químico · Doctor en Sistemas Energéticos<br />Vicedecano Académico · Facultad de Minas</p>
          </div>
        )}

        <footer className="window-footer">
          <button type="button" onClick={() => openCell(activeId === 0 ? 8 : activeId - 1)} aria-label="Capítulo anterior">←</button>
          <span>{routeName ? `ruta ${routeName}` : "recorrido libre"} · nodo {active.index}</span>
          <button type="button" onClick={() => openCell(nextInRoute ?? (activeId + 1) % cells.length)} aria-label="Siguiente capítulo">→</button>
        </footer>
      </article>
    </main>
  );
}

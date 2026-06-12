# Cookly Web

Aplicación web de búsqueda y gestión de recetas de cocina. Versión web de la app móvil Cookly, construida con React + Vite + TypeScript como parte de la materia **Rich Internet Applications 2026** (Docente: Andrés Pastorini).

Consume la API pública [TheMealDB](https://www.themealdb.com/) sin backend propio.

---

## Stack tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| React | 19 | Framework UI |
| Vite | 8 | Bundler y dev server |
| TypeScript | 6 | Tipado estático |
| React Router DOM | 7 | Navegación SPA (4 rutas) |
| Bootstrap | 5.3 | UI framework (obligatorio por la materia) |
| lucide-react | latest | Iconos SVG |
| Vitest | 4 | Tests unitarios e integración |
| React Testing Library | 16 | Testing de componentes |

---

## Funcionalidades

- **Pantalla de bienvenida** — se muestra solo en la primera visita, con presentación de la app y link a la versión móvil.
- **Home** — grilla de recetas con barra de categorías y scroll circular. Carga esqueletos animados mientras se obtienen los datos.
- **Buscar** — búsqueda de recetas por nombre + botón "Sorprendeme" para una receta aleatoria.
- **Favoritos** — guardado en `localStorage` con panel de filtros (búsqueda, categoría, orden). Filtros persistidos en `sessionStorage`.
- **Detalle de receta** — imagen con badges de categoría y nacionalidad, lista de ingredientes con cantidades, instrucciones numeradas paso a paso y link a YouTube si hay video.
- **Modo oscuro** — toggle en la navbar, persistido en `localStorage`.
- **Navbar lateral** — se expande al pasar el mouse, con badge de cantidad de favoritos.
- **Traducciones** — categorías y nacionalidades traducidas al español sin API externa.

---

## Instalación y uso

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Correr tests
npm test

# Tests con interfaz visual
npm run test:ui

# Build de producción
npm run build
```

---

## Estructura de archivos

```
cookly-web/
├── public/
│   └── logo.png
├── src/
│   ├── App.tsx                     # Rutas + lógica de welcome screen
│   ├── main.tsx                    # Entry point, imports de Bootstrap y CSS
│   ├── styles/                     # Estilos organizados por módulo
│   │   ├── variables.css           # Variables CSS y overrides de Bootstrap
│   │   ├── global.css              # Reset y estilos base
│   │   ├── layout.css              # .layout y .main-content
│   │   ├── navbar.css              # Sidebar lateral
│   │   ├── cards.css               # Cards de recetas, categorías, skeleton
│   │   ├── search.css              # Página de búsqueda
│   │   ├── detail.css              # Detalle de receta
│   │   ├── favorites.css           # Favoritos y panel de filtros
│   │   └── landing.css             # Pantalla de bienvenida
│   ├── components/
│   │   └── Navbar.tsx              # Sidebar hover, dark mode, badge favoritos
│   ├── pages/
│   │   ├── Landing.tsx             # Pantalla bienvenida (primera visita)
│   │   ├── Home.tsx                # Grid recetas + categorías
│   │   ├── Search.tsx              # Búsqueda + sorprendeme
│   │   ├── Favorites.tsx           # Favoritos + panel de filtros
│   │   └── RecipeDetail.tsx        # Detalle completo de receta
│   ├── services/
│   │   └── mealDbApi.ts            # Fetch a TheMealDB
│   └── constants/
│       ├── categoryTranslations.ts # Traducciones de categorías
│       └── areaTranslations.ts     # Traducciones de nacionalidades
├── tests/
│   ├── unit/
│   │   ├── translations.test.ts    # 7 tests de constantes
│   │   └── mealDbApi.test.ts       # 5 tests del servicio API
│   └── integration/
│       ├── Home.test.tsx           # 4 tests
│       ├── Search.test.tsx         # 4 tests
│       └── Favorites.test.tsx      # 4 tests
└── prompts/
    └── prompts-relevantes.md       # Registro de prompts de IA utilizados
```

---

## Rutas de la aplicación

| Ruta | Página | Descripción |
|---|---|---|
| `/` | Home | Grilla de recetas con filtro por categoría |
| `/search` | Search | Búsqueda por nombre + receta aleatoria |
| `/favorites` | Favorites | Lista de favoritos con filtros |
| `/recipe/:id` | RecipeDetail | Detalle completo de una receta |

La pantalla de bienvenida (`Landing`) no tiene ruta propia — se renderiza condicionalmente si es la primera visita del usuario.

---

## API

**TheMealDB** — `https://www.themealdb.com/api/json/v1/1/`

| Endpoint | Uso |
|---|---|
| `/search.php?s=` | Buscar recetas por nombre |
| `/categories.php` | Listar categorías |
| `/filter.php?c=` | Recetas por categoría |
| `/lookup.php?i=` | Detalle de receta por ID |
| `/random.php` | Receta aleatoria |

---

## Tests

24 tests en 5 archivos, todos pasando:

```
tests/unit/translations.test.ts   — 7 tests (categoryTranslations, areaTranslations)
tests/unit/mealDbApi.test.ts       — 5 tests (fetch mock con vi.stubGlobal)
tests/integration/Home.test.tsx    — 4 tests
tests/integration/Search.test.tsx  — 4 tests
tests/integration/Favorites.test.tsx — 4 tests
```

---

## Herramientas de IA utilizadas

- **Claude (Anthropic)** — arquitectura, generación de código, resolución de errores y decisiones de diseño. Ver `prompts/prompts-relevantes.md` para el registro completo.

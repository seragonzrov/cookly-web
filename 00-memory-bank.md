# 00 - Memory Bank: Cookly Web

Archivo de contexto del proyecto para uso con herramientas de IA.  
Materia: Rich Internet Applications 2026 — Docente: Andrés Pastorini

---

## Descripción del proyecto

**Cookly Web** es una aplicación RIA de búsqueda y gestión de recetas de cocina. Es la versión web de una app móvil (React Native) preexistente, construida reutilizando los mismos servicios y constantes de traducción. Consume la API pública **TheMealDB** sin backend propio.

---

## Stack tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| React | 19 | Framework UI |
| Vite | 8 | Bundler y dev server |
| TypeScript | 6 | Tipado estático |
| React Router DOM | 7 | Navegación SPA |
| Bootstrap | 5.3 | UI framework (obligatorio por la materia) |
| lucide-react | latest | Iconos SVG |
| Vitest | 4 | Tests unitarios e integración |
| React Testing Library | 16 | Testing de componentes |

---

## Estructura de archivos clave

```
src/
├── App.tsx                        # Rutas + lógica de welcome screen
├── main.tsx                       # Bootstrap import, BrowserRouter, imports CSS
├── test-setup.ts                  # Setup de jest-dom
├── styles/                        # Estilos organizados por módulo
│   ├── variables.css              # Variables CSS y overrides de Bootstrap
│   ├── global.css                 # Reset y estilos base (body, headings, .page)
│   ├── layout.css                 # .layout, .main-content
│   ├── navbar.css                 # .side-nav y todos sus elementos
│   ├── cards.css                  # Cards de recetas, categorías, skeleton
│   ├── search.css                 # Página de búsqueda
│   ├── detail.css                 # Detalle de receta
│   ├── favorites.css              # Favoritos y panel de filtros
│   └── landing.css                # Pantalla de bienvenida
├── components/
│   └── Navbar.tsx                 # Sidebar hover, dark mode, badge favoritos
├── pages/
│   ├── Landing.tsx                # Pantalla bienvenida (primera visita)
│   ├── Home.tsx                   # Grid recetas + categorías circulares
│   ├── Search.tsx                 # Búsqueda + sorprendeme
│   ├── Favorites.tsx              # Favoritos + panel de filtros
│   └── RecipeDetail.tsx           # Detalle con badges, ingredientes, pasos
├── services/
│   └── mealDbApi.ts               # Fetch a TheMealDB
└── constants/
    ├── categoryTranslations.ts    # Record<string, {label, emoji}>
    └── areaTranslations.ts        # Record<string, string>

tests/
├── unit/
│   ├── translations.test.ts       # 7 tests de constantes
│   └── mealDbApi.test.ts          # 5 tests del servicio API
└── integration/
    ├── Home.test.tsx              # 4 tests
    ├── Search.test.tsx            # 4 tests
    └── Favorites.test.tsx         # 4 tests
```

---

## Rutas de la aplicación

| Ruta | Componente | Descripción |
|---|---|---|
| `/` | Home | Grid de recetas + categorías |
| `/search` | Search | Búsqueda + receta aleatoria |
| `/favorites` | Favorites | Lista de favoritos + filtros |
| `/recipe/:id` | RecipeDetail | Detalle completo de receta |

La pantalla de bienvenida (`Landing`) no tiene ruta propia — se renderiza condicionalmente en `App.tsx` si `localStorage.getItem('hasVisited')` es null.

---

## API utilizada

**TheMealDB** — `https://www.themealdb.com/api/json/v1/1/`

| Endpoint | Función |
|---|---|
| `/search.php?s=` | Buscar recetas por nombre |
| `/categories.php` | Listar categorías |
| `/filter.php?c=` | Recetas por categoría |
| `/lookup.php?i=` | Detalle de receta por ID |
| `/random.php` | Receta aleatoria |

---

## Persistencia (sin backend)

| Key | Storage | Contenido |
|---|---|---|
| `favorites` | localStorage | Array de `{idMeal, strMeal, strMealThumb, strCategory, savedAt}` |
| `darkMode` | localStorage | `"true"` o `"false"` |
| `hasVisited` | localStorage | `"true"` si ya vio la landing |
| `lastCategory` | sessionStorage | Última categoría seleccionada en Home |
| `fav_search` | sessionStorage | Último texto de búsqueda en filtros |
| `fav_categories` | sessionStorage | Categorías seleccionadas en filtros |
| `fav_sort` | sessionStorage | Orden seleccionado en filtros |

---

## Decisiones de arquitectura

- **`side-nav`** en vez de `navbar` para evitar conflicto con la clase Bootstrap homónima.
- **Evento custom `favoritesUpdated`** para sincronizar el badge de la navbar sin prop drilling ni estado global.
- **`vi.mock` inline** en tests (sin variables externas) porque Vitest hoistea `vi.mock` al tope del archivo.
- **Bootstrap variables CSS** sobrescritas en `:root` y `body.dark` para mantener el color naranja del proyecto (`#e17b39`) sin modificar Bootstrap directamente.
- **Traducciones estáticas** (sin API) mediante `Record<string, ...>` con fallback al valor original para categorías y nacionalidades.

---

## Comandos

```bash
npm run dev        # Servidor de desarrollo
npm test           # Correr todos los tests
npm run test:ui    # Tests con interfaz visual
npm run build      # Build de producción
```

---

## Estado actual (Junio 2026)

- [x] App funcional con 4 rutas
- [x] Consumo de TheMealDB
- [x] Favoritos con localStorage
- [x] Dark mode
- [x] Filtros en favoritos (persistidos en sessionStorage)
- [x] Bootstrap 5 integrado
- [x] 24 tests pasando (unitarios + integración)
- [x] Repositorio público en GitHub
- [x] README.md completo
- [ ] Lighthouse > 80
- [ ] Video demo 30s
- [ ] PPT presentación

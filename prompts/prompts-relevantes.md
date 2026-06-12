# Prompts - Cookly Web (RIA)

Herramienta utilizada: **Claude (Anthropic)**  
Proyecto: Cookly Web — migración de React Native a React + Vite  
Materia: Rich Internet Applications 2026

---

## 1. Arquitectura inicial

**Prompt:**  
Tengo una app de recetas en React Native llamada Cookly que usa TheMealDB. Para otra materia me piden hacer una RIA con las mismas APIs. ¿Cómo la migrarías reutilizando lo que ya tengo?

**Respuesta clave:**  
Se sugirió usar React + Vite para web, reutilizando directamente `mealDbApi.ts`, `categoryTranslations.ts` y `areaTranslations.ts` sin cambios. Solo se reescribiría la UI adaptando el JSX de React Native a HTML. Para navegación se usaría React Router en vez de React Navigation, y `localStorage` en vez de SQLite para favoritos.

---

## 2. Estructura de carpetas

**Prompt:**  
¿Qué carpetas creo para el proyecto?

**Respuesta clave:**  
```
cookly-web/
├── src/
│   ├── pages/        # equivalente a screens/
│   ├── services/     # mealDbApi.ts
│   ├── components/   # componentes reutilizables
│   ├── constants/    # categoryTranslations, areaTranslations
│   └── assets/
├── tests/
│   ├── unit/
│   └── integration/
├── prompts/
├── index.html
└── package.json
```

---

## 3. Configuración de rutas

**Prompt:**  
¿Cómo configuro la navegación entre páginas?

**Respuesta clave:**  
Se usó `react-router-dom` con `BrowserRouter` en `main.tsx` y `Routes`/`Route` en `App.tsx`. Las rutas definidas fueron `/`, `/search`, `/favorites` y `/recipe/:id`.

---

## 4. Persistencia de favoritos

**Prompt:**  
¿Cómo guardo los favoritos sin base de datos?

**Respuesta clave:**  
Se usó `localStorage` para guardar y leer favoritos. Al agregar: `localStorage.setItem('favorites', JSON.stringify(favs))`. Al leer: `JSON.parse(localStorage.getItem('favorites'))`. Para sincronizar el contador en la navbar se usa un evento custom: `window.dispatchEvent(new Event('favoritesUpdated'))`.

---

## 5. Categorías y recetas populares

**Prompt:**  
En la app de celular aparece una categoría llamada "Recetas Populares" si no hay nada seleccionado. ¿Se puede poner eso?

**Respuesta clave:**  
Se cambió `selectedCategory` a `null` por defecto. Cuando no hay categoría seleccionada se llama a `searchMeals('')` para traer todas las recetas. El título muestra "Recetas Populares" o el nombre de la categoría seleccionada. Se agregó `sessionStorage` para persistir la categoría al volver desde el detalle.

---

## 6. Navbar lateral con efecto hover

**Prompt:**  
¿Podés hacer que la navbar esté a la izquierda y se expanda al pasar el mouse?

**Respuesta clave:**  
Se usó `position: sticky` con `width: 60px` por defecto y `width: 200px` en `:hover`, con `transition` para la animación. Se usó layout `flexbox` en `App.tsx`. La clase se nombró `side-nav` (no `navbar`) para evitar conflicto con la clase homónima de Bootstrap.

---

## 7. Iconos en la navbar

**Prompt:**  
¿Cómo pongo iconos blancos en la navbar?

**Respuesta clave:**  
Se instaló `lucide-react` para usar iconos SVG coloreables con CSS. Se usaron `Home`, `Search`, `Heart`, `Moon`, `Sun`, `Shuffle`, `ChevronLeft`, `ChevronRight`, `SlidersHorizontal` y `Smartphone`.

---

## 8. Modo oscuro

**Prompt:**  
¿Cómo implemento modo oscuro?

**Respuesta clave:**  
Se usaron variables CSS en `:root` para los colores. Al activar dark mode se agrega la clase `dark` al `body` con `document.body.classList.toggle('dark', dark)`. El estado se persiste en `localStorage` con la key `darkMode`. Los colores de Bootstrap se sobrescriben en `body.dark` con `--bs-body-bg`, `--bs-card-bg`, etc.

---

## 9. Skeleton loading

**Prompt:**  
¿Cómo hago que mientras cargan las recetas se vea algo en vez de una pantalla en blanco?

**Respuesta clave:**  
Se crearon componentes `.meal-card-skeleton` con animación `shimmer` usando `linear-gradient` animado con `background-position`. Se muestran 8 skeletons mientras `loading === true`, reemplazados por las cards reales al completar el fetch.

---

## 10. Navegación circular de categorías

**Prompt:**  
¿Se puede hacer que las flechas de categorías sean circulares — que al llegar al final vuelvan al principio?

**Respuesta clave:**  
Se usó `useRef` en el contenedor scrollable. Al detectar que `scrollLeft + clientWidth >= scrollWidth - 1` se hace `scrollTo({ left: 0 })` para volver al inicio. Lo mismo al revés: si `scrollLeft <= 0` se va al final con `scrollTo({ left: scrollWidth })`.

---

## 11. Filtros en Favoritos

**Prompt:**  
¿Se puede agregar filtros en la pestaña de favoritos? Orden alfabético, categoría y fecha de guardado.

**Respuesta clave:**  
Se creó un panel de filtros con `position: absolute` sobre un botón con ícono `SlidersHorizontal`. El estado incluye `search`, `selectedCategories` (array), `sortBy` (newest/oldest/az/za). El panel se cierra al hacer click fuera con un listener `mousedown` + `useRef`. Los filtros se persisten en `sessionStorage` para sobrevivir navegación entre páginas.

---

## 12. Detalle de receta rediseñado

**Prompt:**  
¿Podés rediseñar el detalle de receta para que los ingredientes tengan bullets naranjas y las instrucciones estén numeradas?

**Respuesta clave:**  
Los ingredientes se muestran con un punto naranja (`.ingredient-bullet`, `border-radius: 50%`) y la medida alineada a la derecha. Las instrucciones se parsean con `.split(/\r?\n/)` para separar pasos, y cada uno se muestra con un círculo naranja numerado (`.step-number`). Los badges de categoría y nacionalidad se posicionan sobre la imagen con `position: absolute`.

---

## 13. Traducciones sin API externa

**Prompt:**  
¿Se puede traducir al español el tipo de comida y la nacionalidad sin usar una API de traducción paga?

**Respuesta clave:**  
Se crearon dos archivos de constantes: `categoryTranslations.ts` (mapea categorías a `{label, emoji}`) y `areaTranslations.ts` (mapea nacionalidades a nombres en español). Ambos son `Record<string, ...>` consultados directamente en el JSX con fallback al valor original si no existe la traducción.

---

## 14. Pantalla de bienvenida (primera visita)

**Prompt:**  
¿Podés hacer una pantalla de presentación que aparezca solo la primera vez que el usuario entra?

**Respuesta clave:**  
Se creó el componente `Landing.tsx` renderizado condicionalmente en `App.tsx` según `!localStorage.getItem('hasVisited')`. Al hacer click en "Empezar" se guarda `hasVisited: true` en localStorage y se muestra la app. La pantalla no vuelve a aparecer en visitas posteriores. Incluye 3 feature cards con Bootstrap y un link de promoción a la app móvil.

---

## 15. Migración a Bootstrap

**Prompt:**  
¿Qué necesito para que se considere que usé Bootstrap? ¿Y qué framework elegiría para mantener el diseño lo más parecido posible?

**Respuesta clave:**  
Se eligió Bootstrap 5 sobre Material Design por ser más neutral visualmente. Se sobrescribió `--bs-primary` con el color naranja del proyecto. Se migraron: grilla con `row row-cols-*`, cards con `card`/`card-body`/`card-img-top`, botones con `btn btn-primary`, formulario de búsqueda con `input-group`/`form-control`, y badges con `badge bg-primary`. La clase `navbar` se renombró a `side-nav` para evitar conflicto con Bootstrap.

---

## 16. Testing con Vitest

**Prompt:**  
¿Cómo agrego tests unitarios e integración?

**Respuesta clave:**  
Se instaló Vitest (nativo de Vite, sin config extra) + React Testing Library. En `vite.config.ts` se agregó `test: { globals: true, environment: 'jsdom' }`. Los tests unitarios cubren traducciones y el servicio de API (con `vi.stubGlobal('fetch', ...)`). Los tests de integración usan `vi.mock` para mockear el módulo de API y `MemoryRouter` para simular el router. Se crearon 24 tests en 5 archivos, todos pasando.

---

## 17. Organización de estilos CSS

**Prompt:**  
¿Por qué es tan largo el index.css? ¿Podés dividirlo en varios archivos?

**Respuesta clave:**  
Se creó la carpeta `src/styles/` con 9 archivos CSS separados por módulo: `variables.css` (variables y overrides de Bootstrap), `global.css` (reset y estilos base), `layout.css` (`.layout`, `.main-content`), `navbar.css` (sidebar), `cards.css` (recetas, categorías, skeleton), `search.css` (búsqueda), `detail.css` (detalle de receta), `favorites.css` (filtros), `landing.css` (pantalla de bienvenida). Se importan todos desde `main.tsx` en orden. Se eliminó `index.css`.

---

## Herramientas de IA utilizadas

- **Claude (Anthropic)** — claude.ai — para arquitectura, generación de código, resolución de errores y decisiones de diseño.

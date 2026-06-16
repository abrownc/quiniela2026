# Quiniela 2026 — Guía de instalación
### De cero a URL compartible en ~20 minutos

---

## Lo que necesitas

- Cuenta en [GitHub](https://github.com) (gratis)
- Cuenta en [Supabase](https://supabase.com) (gratis)
- Cuenta en [Netlify](https://netlify.com) (gratis)
- Esta carpeta de archivos

---

## PASO 1 — Crear la base de datos en Supabase

1. Ve a [supabase.com](https://supabase.com) → **Start your project** → crea cuenta con Google
2. Clic en **New project**
   - Nombre: `quiniela2026`
   - Password: pon cualquiera (no la vas a usar)
   - Region: `East US` o la más cercana
3. Espera ~2 minutos a que termine de crear
4. En el menú izquierdo: **SQL Editor** → clic en **New query**
5. Pega TODO esto y haz clic en **Run**:

```sql
-- Jugadores
create table players (
  id uuid default gen_random_uuid() primary key,
  name text unique not null,
  created_at timestamptz default now()
);

-- Pronósticos de partidos
create table predictions (
  id uuid default gen_random_uuid() primary key,
  player_id uuid references players(id) on delete cascade,
  match_id text not null,
  home_goals int,
  away_goals int,
  created_at timestamptz default now(),
  unique(player_id, match_id)
);

-- Resultados reales (solo admin los llena)
create table results (
  id uuid default gen_random_uuid() primary key,
  match_id text unique not null,
  home_goals int not null,
  away_goals int not null,
  updated_at timestamptz default now()
);

-- Pronósticos extras (campeón, goleo, México, grupos)
create table extras (
  id uuid default gen_random_uuid() primary key,
  player_id uuid references players(id) on delete cascade unique,
  champion text,
  top_scorer text,
  mexico_round text,
  group_winners jsonb,
  updated_at timestamptz default now()
);

-- Permisos: cualquiera puede leer y escribir (la seguridad la maneja la contraseña admin)
alter table players enable row level security;
alter table predictions enable row level security;
alter table results enable row level security;
alter table extras enable row level security;

create policy "public_all" on players for all using (true) with check (true);
create policy "public_all" on predictions for all using (true) with check (true);
create policy "public_all" on results for all using (true) with check (true);
create policy "public_all" on extras for all using (true) with check (true);
```

6. Debe decir "Success. No rows returned" — eso es correcto.

---

## PASO 2 — Obtener las credenciales de Supabase

1. En el menú izquierdo: **Project Settings** → **API**
2. Copia dos valores:
   - **Project URL** → algo como `https://abcdefgh.supabase.co`
   - **anon public** key → una cadena larga que empieza con `eyJ...`
3. Guárdalos, los necesitas en el siguiente paso.

---

## PASO 3 — Subir el código a GitHub

1. Ve a [github.com](https://github.com) → **New repository**
   - Nombre: `quiniela2026`
   - Visibilidad: **Private** (para que nadie vea tu código con la contraseña)
   - Clic en **Create repository**

2. En tu computadora, abre Terminal (Mac) o Command Prompt (Windows):
```bash
cd ruta/a/la/carpeta/quiniela2026
npm install
git init
git add .
git commit -m "quiniela inicial"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/quiniela2026.git
git push -u origin main
```

---

## PASO 4 — Desplegar en Netlify

1. Ve a [netlify.com](https://netlify.com) → Log in con GitHub
2. Clic en **Add new site** → **Import an existing project** → **GitHub**
3. Selecciona el repositorio `quiniela2026`
4. En **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. **MUY IMPORTANTE** — antes de hacer deploy, clic en **Environment variables** → **Add a variable** y agrega las tres:

   | Key | Value |
   |-----|-------|
   | `VITE_SUPABASE_URL` | `https://tuproyecto.supabase.co` |
   | `VITE_SUPABASE_ANON_KEY` | `eyJ...` (la anon key de Supabase) |
   | `VITE_ADMIN_PASSWORD` | La contraseña que quieras para el admin |

6. Clic en **Deploy site**
7. Espera ~2 minutos. Netlify te da una URL tipo `https://random-name-123.netlify.app`
8. Puedes cambiarla en **Site settings** → **Domain management** → **Options** → **Edit site name**

---

## PASO 5 — Compartir con el grupo

Manda la URL por WhatsApp. Eso es todo.

Cada quien entra, pone su nombre, y empieza a pronosticar.

---

## Cómo ingresar resultados (admin)

1. Abre la app en tu teléfono o computadora
2. En la parte inferior hay un campo de contraseña — ingresa tu `VITE_ADMIN_PASSWORD`
3. Aparece la pestaña **⚙️ Admin**
4. Ingresa el marcador de cada partido y haz clic en ✓
5. Los puntos se actualizan automáticamente para todos

---

## Puntuación

| Puntos | Condición |
|--------|-----------|
| 0 | Ganador incorrecto (o empate fallado) |
| 1 | Ganador correcto, diferencia de goles distinta |
| 2 | Ganador correcto, diferencia de goles exacta |
| 3 | Marcador exacto |

Ejemplo: pronosticas **Francia 2-0**, gana Francia:
- Francia 1-0 → **1 pt** (ganador correcto, diferencia distinta... espera, 1 gol vs 2 goles → 1 pt)
- Francia 3-1 → **2 pts** (ganador correcto, diferencia de 2 goles = igual)
- Francia 2-0 → **3 pts** (exacto)
- Senegal gana o empate → **0 pts**

---

## Preguntas frecuentes

**¿Qué pasa si alguien entra su nombre dos veces?**
Si escribe exactamente el mismo nombre, recupera sus pronósticos anteriores. Si escribe diferente, se crea como nuevo jugador.

**¿Se pueden cambiar los pronósticos?**
Sí, hasta que el admin ingrese el resultado del partido. Una vez que hay resultado, el campo se bloquea.

**¿Puedo actualizar el código después?**
Sí — cualquier cambio que hagas en los archivos y subas a GitHub se despliega automáticamente en Netlify.

**¿Cuánto cuesta esto?**
Cero. Supabase free tier aguanta miles de requests. Netlify free tier aguanta sin problema para 20 personas.

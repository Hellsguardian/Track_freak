# Track Freak V2 Architecture Report

## 1. PROJECT OVERVIEW
=================================================

### High-level architecture
Track Freak V2 is a React application built with TypeScript and Vite. It utilizes a highly modular file structure separating business logic, state management, and UI rendering. The backend is powered by **Supabase** (PostgreSQL), utilizing its Realtime capabilities to keep multiple clients synchronized.

### Data flow
The application strictly follows a unidirectional data and dependency flow:
```text
Component (UI & user interaction)
  ↓
Hook (State management & local cache)
  ↓
Service (Supabase API layer)
  ↓
Supabase (PostgreSQL Database)
```

### State management flow
1. **Local State**: Managed in modular React hooks (e.g., `useProductivity.ts`).
2. **Mutation**: User actions trigger Hook methods, which call Service layer functions to update Supabase.
3. **Synchronization**: Realtime channel listeners in Services receive Postgres changes and trigger callbacks in Hooks to update local state, ensuring all clients stay in sync.

---

## 2. DATABASE SCHEMA
==================

### `sleep_sessions`
* **Purpose**: Tracks individual sleep intervals. Separated from nodes to support multiple naps/sessions per day.
* **Columns**:
  - `id` (uuid)
  - `created_at` (timestamptz)
  - `sleep_date` (date)
  - `start_time` (time)
  - `end_time` (time, nullable)
  - `duration` (integer)
  - `is_active` (boolean)
* **Defaults**: `duration` = 0, `is_active` = false.
* **Relationships**: None.

### `wellness_nodes`
* **Purpose**: Daily tracker for wellness metrics (1 row per day).
* **Columns**:
  - `id` (uuid)
  - `created_at` (timestamptz)
  - `log_date` (date) - Unique
  - `breakfast` (boolean)
  - `lunch` (boolean)
  - `dinner` (boolean)
  - `hydration_units` (integer)
* **Defaults**: booleans = false, `hydration_units` = 0.
* **Relationships**: None.

### `productivity_nodes`
* **Purpose**: Daily tracker for productivity and hobbies (1 row per day).
* **Columns**:
  - `id` (uuid)
  - `created_at` (timestamptz)
  - `log_date` (date) - Unique
  - `coding_seconds` (integer)
  - `coding_started_at` (timestamptz, nullable)
  - `is_coding` (boolean)
  - `book_reading` (boolean)
  - `ukulele_practice` (boolean)
  - `workout` (boolean)
* **Defaults**: `coding_seconds` = 0, booleans = false.
* **Relationships**: None.

### `vibe_nodes`
* **Purpose**: Daily tracker for emotional and stress state (1 row per day).
* **Columns**:
  - `id` (uuid)
  - `created_at` (timestamptz)
  - `log_date` (date) - Unique
  - `mood` (integer, nullable)
  - `stress_level` (integer, nullable)
* **Defaults**: `mood` = null, `stress_level` = null.
* **Relationships**: None.

### `digital_nodes`
* **Purpose**: Daily tracker for digital behavior (1 row per day).
* **Columns**:
  - `id` (uuid)
  - `created_at` (timestamptz)
  - `log_date` (date) - Unique
  - `screen_time` (integer)
  - `insta_time` (integer)
* **Defaults**: `screen_time` = 0, `insta_time` = 0.
* **Relationships**: None.

### `projects`
* **Purpose**: Master records for tracked projects.
* **Columns**:
  - `id` (uuid)
  - `created_at` (timestamptz)
  - `project_name` (text)
  - `description` (text, nullable)
  - `tech_stack` (text, nullable)
  - `is_archived` (boolean)
* **Defaults**: `is_archived` = false.
* **Relationships**: None.

### `project_logs`
* **Purpose**: Daily progress log mapped to individual projects (for the 10-day streak heatmap).
* **Columns**:
  - `id` (uuid)
  - `created_at` (timestamptz)
  - `project_id` (uuid)
  - `log_date` (date)
  - `worked_today` (boolean)
* **Defaults**: `worked_today` = false.
* **Relationships**: `project_id` -> `projects(id)`.

---

## 3. FOREIGN KEYS
===============

* **`project_logs.project_id`** → References **`projects.id`**
  - Enables joining the project's historical daily streak data.

---

## 4. RLS POLICIES
===============

In the current MVP architecture, policies are configured for `anon` access (as there is no user authentication yet).

* **SELECT policies**: `true` (Allow all) on all tables.
* **INSERT policies**: `true` (Allow all) on all tables.
* **UPDATE policies**: `true` (Allow all) on all tables.
* **DELETE policies**: `true` on `sleep_sessions` (Required by the Daily Reset System).

**Special Requirements**: 
- Ensure `DELETE` is allowed on `sleep_sessions`, as the `resetService` physically deletes today's sleep rows during a daily wipe. All other node tables rely strictly on `UPDATE` for resetting data.

---

## 5. REALTIME ARCHITECTURE
========================

The application uses Supabase Postgres Changes to sync state across clients.

* **Tables Subscribed & Channel Names**:
  - `productivity_nodes` → `productivity_nodes_changes`
  - `projects` → `projects_changes`
  - `project_logs` → `project_logs_table_changes`
  - `digital_nodes` → `digital_nodes_changes`
  - `vibe_nodes` → `vibe_nodes_changes`
* **State Update Flow**:
  1. A client mutates a row in Supabase.
  2. Postgres emits an `UPDATE` event to the subscribed channel.
  3. The `Service` listener receives the payload and invokes a callback.
  4. The corresponding React `Hook` updates its internal state with the incoming payload, instantly re-rendering the UI.

---

## 6. DAILY RESET SYSTEM
=====================

Triggered via the `resetService` when the user initiates a system cleanse.

* **Tables Affected**: `sleep_sessions`, `wellness_nodes`, `productivity_nodes`, `digital_nodes`, `vibe_nodes`, `project_logs`.
* **Operations Performed**:
  - **DELETE**: Drops all rows in `sleep_sessions` where `sleep_date` equals today.
  - **UPDATE**: Modifies today's row in all node tables (`wellness_nodes`, `productivity_nodes`, etc.) setting metrics to their default baseline (e.g., `0`, `false`, `null`).
* **Safety Behavior**: 
  - Strictly scopes all queries using `.eq('log_date', today)` or `.eq('sleep_date', today)`.
  - Operations are executed sequentially. If any step throws an error, it is caught to prevent partial corruption and gracefully logs the failure.

---

## 7. KNOWN DESIGN DECISIONS
=========================

* **Why projects and project_logs are separated**: 
  To support the 10-day GitHub-style streak view, we need a daily history. Storing this in the main `projects` table would require mutating an array/JSON column continuously. A normalized `project_logs` table cleanly maps `(project_id, date)` to a boolean state.
* **Why coding timer uses timestamp architecture**: 
  By persisting `coding_started_at` (a timestamptz) in `productivity_nodes`, the timer isn't reliant on the client-side browser loop. If the user closes the app and reopens it, the UI can calculate exactly how much time elapsed by diffing `now()` with `coding_started_at`.
* **Why project deletion uses archiving**: 
  Hard deleting a project (`DELETE`) would orphan or cascade-delete all historical `project_logs`. Using `is_archived: true` preserves the historical integrity of the database while removing the project from the active UI.
* **Why sleep sessions use dedicated rows**: 
  Unlike wellness or vibe which have one state per day (a "Node"), a user can have multiple distinct sleep intervals (e.g., a night's sleep + an afternoon nap). Dedicated rows allow capturing precise start/end bounds and duration for each instance.

---

## 8. COMMON BUGS FIXED
====================

* **Sleep UTC/local date bug**: Using `new Date().toISOString()` logged sessions to the wrong calendar day depending on the user's timezone. Fixed by writing custom `getLocalDateString()` to construct dates precisely from local `.getFullYear()`, `.getMonth()`, etc.
* **Missing DELETE RLS policy**: The Daily Reset System originally failed to clear sleep sessions because the Postgres `DELETE` policy was missing on `sleep_sessions`.
* **Digital Nodes column typo**: Fixed a mismatch between the React state (`insta_time`) and database columns.
* **Project realtime overwrite bug**: Concurrent parallel client mounts caused race conditions on node creation. Fixed by catching unique constraint errors (`23505`) during `INSERT` and falling back to a `SELECT` retry to fetch the concurrently created row.
* **Duplicate project log issue**: Same as above, ensuring `ensureTodayLog` safely handles `23505` constraint violations to guarantee exactly one log per project per day.

---

## 9. FEATURE DEVELOPMENT GUIDE
============================

When adding a new feature or module to the ecosystem:

* **Where Hooks Go**: Create a new hook in `src/hooks/` (e.g., `useNewFeature.ts`). It should encapsulate all React state (`useState`) and effects for this domain.
* **Where Services Go**: Create a new API wrapper in `src/services/` (e.g., `newFeatureService.ts`). It should contain pure async Supabase calls.
* **How Realtime Should Be Implemented**: 
  1. Add a `subscribeToNodes(callback)` function to your Service.
  2. Call it inside a `useEffect` on mount in your Hook.
  3. Ensure you return the cleanup function `supabase.removeChannel(channel)` to prevent memory leaks on unmount.
* **How RLS Should Be Configured**: Ensure any newly created tables have `SELECT`, `INSERT`, and `UPDATE` allowed for the `anon` role. If the Daily Reset system needs to wipe rows, add `DELETE` permissions.

---

## 10. CURRENT MVP STATUS
======================

**Completed Features**:
* Fully modular React architecture.
* Realtime Supabase integration across all nodes.
* Offline-resilient productivity timer (Timestamp architecture).
* 10-day streak heatmaps for active projects.
* Daily reset orchestrator.
* Unique constraint race-condition safeguards.

**Future Feature Ideas**:
* Authentication / Multi-user support.
* Historical analytics and charts dashboard.
* Custom project categories.

**Technical Debt**:
* **Global Anon Access**: RLS policies are public. Before a production multi-user launch, Auth must be implemented, and policies locked to `auth.uid()`.
* **Prop Drilling**: The `resetAll` orchestrator requires passing setter callbacks from all hooks. If the app scales further, this should be refactored into a React Context.

---

## 11. FILE STRUCTURE
==================

* `src/components/` 
  * `ui/`: Reusable, generic UI elements (Buttons, Cards).
  * `layout/`: Macro-structural elements (Header, Navbar, Footer, Background).
  * `features/`: Domain-specific chunks containing the actual business interface (Wellness, Productivity, Vibe).
* `src/hooks/`: Business logic, React state, and Realtime orchestrators.
* `src/services/`: Pure functions interfacing with the Supabase PostgreSQL database.
* `src/types/`: Centralized TypeScript interfaces corresponding to DB schemas.
* `src/utils/`: Pure helper functions (time/date formatting).

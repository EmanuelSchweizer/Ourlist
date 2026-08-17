# NOTES.md — Shopping List

Kurze Notizen zu Entscheidungen, die man später nicht mehr aus dem Code ablesen kann.
Format: **Was** — **Warum** — **Wo**.

---

## Projektstruktur (Frontend)

**Feature-basiert statt nach Typ.** Zusammengehöriges liegt zusammen.

```
src/ 
  lib/
    errors.ts              ApiError-Klasse
    server/
      api-client.ts        serverFetch + authFetch (server-only!)
      action.ts            createAction-Wrapper
  features/
    auth/
      auth-options.ts      NextAuth-Config
      actions/             Server Actions (signUp, ...)
      types.ts             SignUpInput, SignUpUser, ...
      components/
    lists/
      api.ts               Client-Fetches (zeigen auf /api/..., nicht aufs C#-Backend)
      hooks.ts             useLists, ... ("use client")
      components/
  components/
    ui/                    Button, Input, toast.ts — Wrapper um HeroUI
    layout/                NavBar, Footer
  types/
    next-auth.d.ts         Module Augmentation für Session + JWT
  app/                     nur Routing, keine Logik
```

**Regeln:**
- `app/` enthält Routing, keine Logik. Ausnahme: `layout.tsx`, `error.tsx`, `loading.tsx`.
- Layout darf auf Features zugreifen, Features nie auf Layout.
- HeroUI wird **nur** in `components/ui/` importiert. Überall sonst der eigene Wrapper
  (`Button`, `showSuccessToast`, ...). Grund: Library-Wechsel = 1 Datei statt 200 Importe.
- Eigenes Button-Prop heißt `intent`, nicht `variant` — `variant` ist von HeroUI belegt.

---

## Datenfluss

| Fall | Weg |
|---|---|
| Initiale Daten einer Page | Server Component → `serverFetch` / `authFetch` direkt |
| Formular abschicken | Server Action → `authFetch` |
| Client-seitiges Nachladen | `features/*/api.ts` → Route Handler → `authFetch` |

Components importieren **immer** nur aus `features/*/api.ts` bzw. den Actions —
nie direkt den API-Client. Dadurch ist austauschbar, was dahinter liegt.

---

## API-Client

`lib/server/api-client.ts`, mit `import "server-only"` ganz oben.
→ Bricht den Build, falls eine Client Component sie importiert. Schützt den API-Key.

- `serverFetch` — ohne Token. Für Login, Signup, Refresh.
- `authFetch` — holt den Token aus der Session. Für alles hinter dem Login.
- Timeout: 10s (`AbortSignal.timeout`) wegen Railway-Cold-Starts.
- Netzwerkfehler → `ApiError` mit **Status 0** (Konvention für "nie angekommen").
- Fehler-Body wird als `text()` gelesen, nicht `json()` — 500er von ASP.NET liefern
  manchmal HTML, `.json()` würde den echten Fehler verschlucken.
- 204 / leerer Body wird abgefangen (Logout gibt `NoContent` zurück).

**Env-Variablen** (einheitlich, ohne `NEXT_PUBLIC_`):
```
API_URL
BACKEND_API_KEY
```

---

## Fehlerbehandlung

`createAction`-Wrapper in `lib/server/action.ts`. Kein try/catch pro Action.

Rückgabe ist eine Discriminated Union:
```ts
{ success: true; data: T } | { success: false; message: string }
```

Im Client wird der Fehler **nicht** gefangen, sondern gelesen:
```ts
const result = await signUp(input);
if (!result.success) showErrorToast(result.message);
```
Grund: Server Actions serialisieren geworfene Exceptions nicht — in Production käme
im Browser nur "An error occurred in the Server Components render" an.

**Offener Punkt:** `parseErrorMessage` sucht nur nach `message`. ASP.NET-Validierungs-
fehler kommen als ProblemDetails mit `errors`/`title` → landen im Fallback-Text.
Lösung später: entweder Zod im Formular oder einheitliches Fehler-DTO im Backend.

---

## Auth

**NextAuth (JWT-Strategie), Tokens liegen im NextAuth-JWT, nicht in eigenen Cookies.**

- `accessToken` steht bewusst **nicht** in der Session — sonst wäre er über
  `useSession()` im Browser sichtbar. Nur `error` wird durchgereicht.
- Refresh läuft im `jwt`-Callback, nicht in `authFetch`. Grund: NextAuth persistiert
  das Ergebnis automatisch. In Server Components kann man keine Cookies schreiben.
- Ablauf wird per `getExpiryFromJwt()` aus dem `exp`-Claim gelesen, nicht hart kodiert.
  → Lifetime-Änderung in C# zieht im Frontend automatisch nach.
- Puffer von 60s beim Ablaufcheck, damit ein Token nicht mitten im Request verfällt.
- Google-Zweig ist an `account?.provider === "google"` gebunden, **nicht** an
  `!token.userId`. Sonst läuft `resolveOrCreateUser` bei jedem Request erneut,
  solange er einmal fehlgeschlagen ist.

**Typen:** `types/next-auth.d.ts` erweitert `Session`, `User` und `JWT`.
Der `import "next-auth"` oben ist Pflicht — ohne ihn wird die Datei als
Modul-Deklaration behandelt und überschreibt die Typen, statt sie zu erweitern.
Nach Änderungen TS-Server neu starten.

---

## Backend (C#)

**Token-Setup:**
- Access Token: 15 Min (`GenerateJwtToken`, `Expires`)
- Refresh Token: 30 Tage, opaque (Zufallswert), gehasht in der DB
- `Issuer` / `Audience` in `appsettings.json` — müssen in `GenerateJwtToken`
  **und** in `TokenValidationParameters` identisch gesetzt sein
- `ClockSkew` auf 30s (Default wären 5 Min → Token gälte faktisch 20 statt 15)

**Pipeline-Reihenfolge in `Program.cs`:**
```
UseAuthentication()   // wer bist du
UseAuthorization()    // darfst du
```
Andersrum funktioniert `[Authorize]` nicht.

**Achtung:** Rollen stecken im Token. Wer im Admin-Panel zum Admin gemacht wird,
ist es erst nach dem nächsten Refresh (max. 15 Min).

**Beim Aktivieren von `ValidateIssuer`/`ValidateAudience` werden alle bestehenden
Tokens ungültig** → einmal aus- und wieder einloggen.

---

## Realtime (SignalR)

**Room-Modell: ein Room pro User (`user:{userId}`), nicht pro Liste.**

Beim Broadcast werden die Berechtigten frisch aus der DB geholt:
```csharp
var userIds = await _access.GetUsersWithAccess(listId);  // Owner + SharedList
await _hub.Clients.Groups(userIds.Select(id => $"user:{id}")).SendAsync(...);
```

**Warum so:** Berechtigung wird bei jedem Event neu geprüft. Wer aus einer geteilten
Liste entfernt wird, fällt automatisch raus — kein Connection-Tracking, kein
manuelles `RemoveFromGroup`. Preis: eine DB-Abfrage pro Event. Bei einer
Einkaufsliste irrelevant.

**Nie** `Groups.AddToGroupAsync` mit einer vom Client geschickten `listId` ohne
Berechtigungsprüfung — sonst ist der Socket eine Hintertür an der Row-Level-
Autorisierung vorbei. Die `CanRead`-Logik liegt in einem Service, den Controller
**und** Hub nutzen.

**Frontend:** Listener hängt im Layout (`<ListSocketListener />`), nicht in der Page.
Rendert `null`, ruft nur den Hook auf, schreibt eingehende Events in den Query-Cache
(`queryClient.setQueryData`) — nicht in einen Zustand-Store.

**Cleanup ist Pflicht:** `useEffect` muss die Unsubscribe-Funktion zurückgeben,
sonst sammeln sich Listener bei jeder Navigation an.

---

## State

- **Server-Daten** → Query-Cache (TanStack Query). Nie in Zustand spiegeln.
- **Zustand** nur für Client-State: offene Modals, Filter, Sortierung, UI-Präferenzen.
- Store im Feature, wenn nur dort gelesen. In `src/stores/`, wenn mehrere Features drauf zugreifen.
- Nach Logout `queryClient.clear()` — sonst sieht der nächste User kurz die alten Daten.

---

## Offene Punkte / TODO

- [ ] Zod-Validierung in `createAction` (Server Actions sind öffentliche Endpunkte)
- [ ] `parseErrorMessage` um ProblemDetails erweitern **oder** Backend-Fehler vereinheitlichen
- [ ] C#: `PropertyNamingPolicy = CamelCase` setzen, damit DTOs im Frontend nicht PascalCase sind
- [ ] Refresh-Endpunkt: `ExpiresAt` beim Einlösen prüfen, nicht nur den Hash
- [ ] Refresh-Rotation: altes Token invalidieren
- [ ] Parallele Refreshes zusammenfassen (erst wenn das Problem auftritt)
- [ ] `showWarningToast` wird aktuell nirgends verwendet — behalten oder raus

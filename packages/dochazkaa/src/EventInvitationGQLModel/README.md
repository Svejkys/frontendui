# Docházkový systém (Attendance) – průvodce

Tento dokument popisuje docházkovou část doplněnou do balíčku `dochazkaa`.

## Myšlenka

Vysokoškolská docházka jako **matice**:

- **řádky** = výuky (přednáška / cvičení) – nesou název, kdy probíhají (den + od–do) a místo,
- **sloupce** = pozvaní studenti,
- **buňka** = stav účasti daného studenta na dané výuce (potvrzeno / odmítnuto / čeká),
  který lze přímo měnit.

## Datový model (GraphQL)

| Entita | Význam | Klíčová pole |
|---|---|---|
| `EventGQLModel` | výuka (přednáška/cvičení) | `name`, `startdate`, `enddate`, `place`, `invitations`, `children` |
| `EventInvitationGQLModel` | pozvánka studenta na výuku | `user`, `event`, `state`, `stateId`, `lastchange` |
| `StateGQLModel` | stav účasti | `name`, `order`, `statemachine` |
| `StateMachineGQLModel` | množina stavů a přechodů | `states` |

Potvrzení/odmítnutí účasti = změna `stateId` pozvánky mutací
`eventInvitationUpdate(invitation: { id, lastchange, stateId })`.

## Jak to funguje v UI

1. Na stránce události (`EventGQLModel`) přibyla tlačítka **Docházka** a **Docházková matice**.
2. **Docházka jedné výuky** (`PageEventAttendance`): hlavička s názvem a časem výuky,
   souhrn (kolik potvrzeno / odmítnuto / čeká) a tabulka studentů. U každého studenta
   jsou tlačítka pro každý dostupný stav; aktuální stav je zvýrazněn.
3. **Docházková matice** (`PageAttendanceMatrix`): tabulka výuky × studenti. Každá buňka
   ukazuje barevně stav a obsahuje rozbalovací nabídku pro jeho změnu.

Po každé změně se data znovu načtou (`onChanged → run()`), takže souhrny i barvy
zůstávají aktuální.

## Sémantika stavů

Názvy stavů jsou konfigurovatelné ve stavovém automatu, proto se barvy/ikony určují
heuristikou podle názvu (`Components/stateHelpers.js`):

- **zelená / ✓** – potvrzeno (klíčová slova: potvrz, zúčastní, účast, přítomen, accept, confirm…)
- **červená / ✕** – odmítnuto (odmít, nezúčastní, omluven, absence, decline…)
- **šedá / •** – čeká / pozváno (pozv, čeká, invite, pending…)
- **modrá / ?** – neznámý stav (zobrazí se neutrálně, ale stále jde nastavit)

Tlačítka se generují ze `state.statemachine.states`, takže systém funguje s libovolnou
sadou stavů, kterou backend nabídne.

## Ověření (manuální)

> Vývojový server v tomto balíčku závisí na běžícím GraphQL backendu (viz `App.jsx`,
> `GQLENDPOINT = "/api/gql"`). `node_modules` v archivu jsou z Windows – na jiném OS
> je třeba před spuštěním přeinstalovat závislosti (`npm ci` / `npm install`).

1. Spusť backend a frontend (`vite`) podle původního postupu projektu.
2. Otevři detail nějaké události (`/dochazka/event/view/:id`).
3. Klikni na **Docházka** → měl by se zobrazit seznam pozvaných studentů.
4. U studenta klikni na jiný stav → tlačítko se přepne, souhrn se přepočítá.
   V síťové kartě prohlížeče uvidíš mutaci `eventInvitationUpdate`.
5. Klikni na **Docházková matice** → tabulka výuky × studenti; změna stavu přes
   rozbalovací nabídku v buňce.

## Poznámky / možná rozšíření

- Hromadné akce (potvrdit/odmítnout všem najednou) lze doplnit do `EventAttendance`.
- Pozvání nového studenta přes `InsertAsyncAction` (UI zatím neobsahuje formulář).
- Pokud backend vyžaduje přechody přes `StateTransition` (ne libovolný `stateId`),
  lze v `collectAvailableStates` filtrovat jen na povolené cílové stavy (`state.targets`).
- RBAC: mutace na backendu má vlastní oprávnění; pokud uživatel nemá práva, mutace
  selže a v buňce/řádku se zobrazí chybový stav.

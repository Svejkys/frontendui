# Deníček projektu – Docházkový systém (`app_dochazka`)
**Autor:** Jakub Vitásek (Svejkys), Lukáš Pavlis


Tento dokument je deník celého průběhu vývoje projektu od prvního commitu až po stav před závěrečnou obhajobou. Zachycuje časovou posloupnost commitů, problémy, které jsme si definovali k vyřešení, co jsme při tom objevili, a hlavně které problémy se dlouho nedařilo řešit a jak byly nakonec vyřešeny.

---

##  Definice problému – co má aplikace umět

Tématem projektu je **evidence docházky studentů na výuku**. Zadání jsem si na začátku semestru definoval podle přednášek takto:

- **`EventGQLModel` (událost)** = konkrétní výuka: název předmětu, datum a čas výuky (např. od 14:30 do 16:00 mám hodinu). Události jsou stavební bloky předmětu v daném semestru.
- **`EventInvitationGQLModel` (pozvánka)** = relace mezi hodinou a pozvanou osobou – funguje jako pozvánka na online hodinu v Teams. Osoba se může zúčastnit, nereagovat, nebo účast odmítnout.
- Ze stavu pozvánky (`state`) zjistím zda se student zúčastnil nebo ne.
- Aplikace musí umět zobrazit docházku na předmět jako celek!!
- Z hlediska editace musím být schopen **otevřít studijní plán a zapisovat „byl / nebyl"** – např. u skupiny 30 lidí si nejdřív zapíšu jména a pak označuji, kdo byl.
- Důležité: **pozvánky nejsou studijní skupiny** – docházka se váže na konkrétní událost, ne na skupinu.

Z toho vyplynuly hlavní problémy k vyřešení:

1. Zobrazit entity `Event`, `EventInvitation`, `StudyPlan` a `StudyPlanLesson` (readonly stránky).
2. Umožnit jejich editaci pomocí GraphQL mutací (writable stránky) – změna atributu ve webovém rozhraní se musí promítnout do databáze.
3. Postavit docházkovou matici (řádky = výuky, sloupce = studenti, buňka = stav účasti).
4. Přidávat a odebírat studenty ze studijního plánu.
5. Publikovat balíček na npm a zabezpečit publikaci aplikace.

---

## Deník – časová posloupnost commitů

### Březen – založení projektu

**31. 3. 2026** – „pridani potrebneho"
Fork repozitáře `hrbolek/frontendui`, přechod na větev `monorepo`. Podle vzoru jsem si zkopíroval šablonu `_template` do vlastního balíčku `packages/vitasekJakub`.

### Duben – vlastní aplikace, skalární a vektorové atributy

**1. 4. 2026 – „Upravy"**
Vznik **`apps/app_dochazka`** (App, AppNavbar, AppRouter, vite config) a knihovna **`packages/dochazkaa`** s prvním modelem `EventGQLModel` vytvořeným ze šablony (Components, Mutations, Pages, Queries, Scalars, Vectors).

**9. 4. 2026 – poznámky z hodiny (bez commitu)**
Řešíme **skalární a vektorové atributy**. Vše už je vytvořené – fragmenty v link queries vytvářejí dotazy já si je jen upravuji a zobrazují se v `MediumContent`.

**13. 4. 2026 – „update"**
Přepracování `MediumContent.jsx` a `Fragments.jsx` pro `EventGQLModel` – zobrazení skalárních atributů události.

**14. 4. 2026 – „utery_nanovo"**
projekt nutno přepracovat nově. Špatné pochopení projektu a použití main modelu. Dokončily se vektorové atributy (`VectorAttribute`, `TemplateVectorsAttribute`) a vznikl EventInvitationGQLModel (Fragments, InsertAsyncAction, ReadAsyncAction, Link, CreatePage). 

### Květen – mutace, projektový den, boj s npm

**11. 5. 2026** – neuspesny pokus o mutace → „you are not authorized"
Den dokládání mutací. Podle poznámek z hodiny: mutace = 4 prvky životního cyklu entity (**C**reate, **R**ead, **U**pdate, **D**elete); u update musí být identifikátor a správný `lastchange` a potom atributy, které měníme. U delete stačí `id` + `lastchange` (MUSÍME VĚDĚT CO MAŽEME). 

Update mutace pro `EventGQLModel` nejdřív nefungovala (byla použita nesprávná mutace pro jiný typ entity), po opravě přišla chyba **„you are not authorized"**.

**13. 5. 2026** – „upravy na projektovy den" + vytvořen StudyPlanGQLModel *(projektový den)*
Úklid před projektovým dnem: **smazán nefunkční první pokus o `EventInvitationGQLModel`** ze 14. 4. Odpoledne vznikly ze šablony dva nové modely: **`StudyPlanGQLModel`** a **`StudyPlanLessonGQLModel`** – základ pro zobrazení docházky na předmět jako celek.

**31. 5. 2026** – Commity token1 až token6
Šest commitů během dvaceti minut – boj s publikací balíčku na npm. Postupné ladění `package.json` a `package-lock.json` (název balíčku, verze, závislosti, přístupový token), dokud publikace přes GitHub Actions neprošla. Vyřešeno metodou pokus–omyl.

### Červen – docházková matice a přidávání studentů

**1. 6. 2026** – „Úprava" +  update-zkouska
druhý, projektový den `EventInvitationGQLModel`. Vznikly komponenty `AttendanceButtons`, `AttendanceMatrix`, `EventAttendance`, `MatrixCell`, `stateHelpers`, stránky `PageEventAttendance` a `PageAttendanceMatrix`, sada queries (`EventAttendanceReadAsyncAction`, `EventsAttendanceReadAsyncAction`, `MasterEventChildrenReadAsyncAction`…)

**2. 6. 2026** – Přidávání jmen
Vyhledávání a **přidávání studentů podle jména** (`UserSearch`, `SearchUsersAsyncAction`), první verze `StudyPlanAttendance` a `StudyPlanOverview`. Do commitu se omylem přibalil i celý rozpracovaný `StateMachineGQLModel` ze šablony, který se ukázal jako zbytečný.

**6. 6. 2026** – Matrix corrected
Vznikla finální **`StudentAttendanceMatrix`**.  Objev: stavy účasti stačí číst z pozvánek, není nutné tahat do knihovny celý model stavového automatu.

**11. 6. 2026** – Úprava tlačítek
Tlačítko **`AddStudentButton`** (pozvání studenta), zjednodušení insert queries u `Event` a `EventInvitation`, opravy mutací Create/Update/Delete u `StudyPlanGQLModel`.

**14. 6. 2026** – Vzhledová úprava stránky pro zobrazení co největší matice (Třídní knihy). Upravit, Přidat studenta a Odstranit studenta přidáno do horní části stránky místo nalevo v LargeCard

**23. 6. 2026** – „Male upravy"**
Drobné úpravy v `stateHelpers` (rozpoznávání stavů podle názvu).

**28. 6. 2026** – „emoji added" + „Functional edits" + „npm update"
Buňky matice dostaly emoji/barevné vyjádření stavů (✓ potvrzeno, ✕ omluven/odmítnuto, • čeká), Namísto natvrdo přidaných dat z dokumentace jako "Proděkan", "Děkan"... Přibylo tlačítko **`RemoveStudentButton`** pro odebrání studenta a zprovozněny funkční editace přímo v matici. 
Aktualizace verze balíčku na npm.

### Červenec – uložení změn, finalizace před obhajobou

**16. 7. 2026** –  „Možnost uložení provedení změn"
Poslední velká funkce: změny v docházkové matici se **neukládají po jedné, ale hromadně** – neuložené výběry se drží v mapě `pendingChanges` (`invitationId → stateId`) a odešlou se najednou tlačítkem Uložit. Přibyla query `AttendanceStatesReadAsyncAction` pro načtení stavů docházkového stavového automatu. Při tom byl vyřešen poslední záludný problém s ručním dispatchem AsyncAction.

**18. 7. 2026** –  „Odstranění zbytečných řádků kódu"
Všiml jsem si, že je program díky chybám, které jsem v průběhu vytváření programů dělal, zbytečně velký.
Refresh stránky přepíše rbacobject celý. Po úpravě by se už neměli stackovat výpisy rolí na stránku.
Odstranil jsem zbytečný UserSearch.jsx v EventInvitationGQLModel. Jeho identická a funkční verze je v StudyPlanGQLModel.
Přidání nezbytných komentářů do kódu, který na funkčnosti hraje největší roli, aby bylo srozumitelné, co program Dělá

**19. 7. 2026** – „Pilování programu"
Program měl v sobě další skvělou supr čupr funkci, která mi byla naprosto k ničemu. Měl jsem možnost Přidat studenta v editable režimu znovu, i když už tam mutace pro to je vytvořena. Tato funkce byla odstraněna a význam mutace Upravit tedy spočívá ve změně State jednotlivých studentů na danou výuku, jak bylo zamýšleno. Jako další významná úprava bylo přidání plánovacího administrátora natvrdo do systemdata.hk2026. Před touto akcí byla nutnost v GraphiQL nonstop insertovat tuto roli do kódu pokaždé, co se vypl Docker.

> *Úpravy proběhly v souboru `MediumEditableContent.jsx` a `systemdata.hk2026.json`*
> *Podařilo se mi získat roli organizera*






**22. 7. 2026** – „Pilování programu"
Poslední kosmetické úpravy před zkouškou.

## Problémy, které se nedařilo řešit – a jak byly nakonec vyřešeny

**1. Nefunkční update mutace (11. 5.)**
`neuspesny pokus o mutace`. V `UpdateAsyncAction.jsx` byla omylem použita mutace pro jiný typ entity, takže update `EventGQLModel` nefungoval. 
**Řešení:** přepsat mutaci správně – `eventUpdate($id: UUID!, $lastchange: DateTime!, $name, $nameEn, $description)`. Klíčové bylo pochopit roli parametrů **`id` a `lastchange`** – `lastchange` chrání před souběžnými updaty (concurrent update): když entitu mezitím změnil někdo jiný, mutace se odmítne.

**2. Publikace na npm (31. 5.)**
Šest commitů `token` až `token6`. Publikace balíčku přes GitHub Actions opakovaně padala na konfiguraci `package.json` a přístupovém tokenu. **Řešení:** postupné ladění metodou pokus–omyl (název/verze balíčku, závislosti, token), dokud workflow neprošlo.

**3. Slepá ulička: první `EventInvitationGQLModel` (14. 4. → 13. 5.)**
První verze modelu pozvánek vznikla „na divoko" mimo strukturu šablony (soubory přímo v kořeni modelu, bez Pages/Components/Queries). Nedařilo se ji rozumně napojit na zbytek aplikace, proto byla 13. 5. **celá smazána** a 1. 6. postavena znovu a pořádně podle struktury šablony.

**4. Zbytečný `StateMachineGQLModel` (2. 6. → 6. 6.)**
Pro práci se stavy účasti jsem si vygeneroval celý model stavového automatu, ale ukázalo se, že ho vůbec nepotřebuji – stavy jdou číst přímo z pozvánek a jejich sémantika se dá určit heuristikou podle názvu (`stateHelpers.js`: potvrzeno/odmítnuto/čeká). **Řešení:** celý model smazat a nechat jen malý pomocný soubor.

**5. „utery_nanovo" (14. 4.)**
Ztracená/rozbitá úterní práce, kterou bylo nutné udělat znovu. Od té doby commituju častěji.

**6. "You are not organizer"(19.7)**
"Potřebujete vytvořit událost, na které ty osoby zvete, a tím se stanete organizer". Jenomže v souboru `EventInvitationGQLModel.py`, který jsem si stáhl z dockeru gqlOffice je NATVRDO stanovené id organizera, tedy "Pokud je to tenhle state, pak jsi organizer". Musím si vytvořit pozvánku, ve které jsem organizátor. Musel jsem na backendu `pgAdmin 4` vložit natvrdo stanovené ID organizera, až v tento moment mi po refreshi stránky fungovaly mutace, které tuto roli vyžadovaly. 

**7. Chyba oprávnění při úpravě a mazání docházky (Organizer Error)**

- **Problém:** Při pokusu o úpravu stavů docházky (`eventInvitationUpdate`) nebo smazání studenta (`eventInvitationDelete`) vyvolával backend chybu oprávnění, přestože operace u některých sloupců (výuk) fungovala normálně.
- **Příčina:** Backend vyžaduje, aby uživatel provádějící změny byl organizátorem dané výuky. V systému je organizátor definován tím, že má u konkrétní události vytvořenou pozvánku se speciálním ID stavu organizátora (`ORGANIZER_STATE_ID = "3265a488-bbfa-4c59-946c-7a7b059ee4f0"`). U chybujících výuk tato organizátorská pozvánka přihlášenému uživateli chyběla.
- **Řešení:** 
  - Vytvořena nová React komponenta/tlačítko `BecomeOrganizerButton` (`packages/dochazkaa/src/DevTools/BecomeOrganizerButton.jsx`).
  - Tlačítko načte ID přihlášeného uživatele pomocí hooku `useMe()`, projde všechny výuky daného plánu a jedním klikem automaticky vloží chybějící organizátorské pozvánky (`eventInvitationInsert`).
  - Po udělení organizátorského stavu začaly korektně fungovat všechny operace úpravy i mazání na celé matici.
    

`EventInvitationGQLModel.py`


async def event_invitation_update
organizer_id = IDType("3265a488-bbfa-4c59-946c-7a7b059ee4f0")

---

## Co jsem během semestru objevil

- **Voyager** nejrychlejší cesta, jak pochopit GraphQL schéma
- **Fragmenty řídí queries**: v link queries definuji fragmentem, co chci vrátit, a komponenty (`MediumContent`, `MediumEditableContent`) to jen zobrazí. Úprava fragmentu = úprava celé stránky.
- Dvojice **`id` + `lastchange`** je základ všech mutací typu update/delete – bez ní backend změnu odmítne.
- Úuprava backendu řeší polovinu problémů

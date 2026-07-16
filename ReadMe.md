# 📔 Deníček projektu – Docházkový systém (`app_dochazka`)

**Autor:** Jakub Vitásek (Svejkys)
**Repozitář:** https://github.com/Svejkys/frontendui (větev `monorepo`, fork `hrbolek/frontendui`)
**Předmět:** Frontend UI – semestrální projekt

Tento dokument je deník celého průběhu vývoje projektu od prvního commitu až po stav před závěrečnou obhajobou. Zachycuje časovou posloupnost commitů, problémy, které jsem si definoval k vyřešení, co jsem při tom objevil, a hlavně které problémy se dlouho nedařilo řešit a jak byly nakonec vyřešeny.

---

## 🎯 Definice problému – co má aplikace umět

Tématem projektu je **evidence docházky studentů na výuku**. Zadání jsem si na začátku semestru definoval podle přednášek takto:

- **`EventGQLModel` (událost)** = konkrétní výuka: název předmětu, datum a čas výuky (např. „od 14:30 do 16:00 mám hodinu"). Události jsou stavební bloky předmětu v daném semestru.
- **`EventInvitationGQLModel` (pozvánka)** = relace mezi hodinou a pozvanou osobou – funguje jako pozvánka na online hodinu v Teams. Osoba se může zúčastnit, nereagovat, nebo účast odmítnout.
- Ze stavu pozvánky (`state`) zjistím, **zda se student zúčastnil, nebo ne** – je to vlastně elektronická prezenčka.
- Aplikace musí umět **zobrazit docházku na předmět jako celek** (ne jen na jednu hodinu).
- Z hlediska editace musím být schopen **otevřít studijní plán a zapisovat „byl / nebyl"** – např. u skupiny 30 lidí si nejdřív zapíšu jména a pak označuji, kdo byl.
- Důležité zjištění ze zadání: **pozvánky nejsou studijní skupiny** – docházka se váže na konkrétní událost, ne na skupinu.

Z toho vyplynuly hlavní problémy k vyřešení:

1. Zobrazit entity `Event`, `EventInvitation`, `StudyPlan` a `StudyPlanLesson` (readonly stránky).
2. Umožnit jejich editaci pomocí GraphQL mutací (writable stránky) – změna atributu ve webovém rozhraní se musí promítnout do databáze.
3. Postavit **docházkovou matici** (řádky = výuky, sloupce = studenti, buňka = stav účasti) s možností přímé editace.
4. Přidávat a odebírat studenty (pozvánky) ze studijního plánu.
5. Publikovat balíček na npm a zabezpečit publikaci aplikace.

---

## 🗓️ Deník – časová posloupnost commitů

### Březen – založení projektu

**31. 3. 2026 – `075232ac` „pridani potrebneho"**
Fork repozitáře `hrbolek/frontendui`, přechod na větev `monorepo`. Podle vzoru (`app_ug3` je vzor, projekt se skládá z **aplikace a knihovny**) jsem si zkopíroval šablonu `_template` do vlastního balíčku `packages/vitasekJakub` – přes 600 souborů. První seznámení se strukturou monorepa.

### Duben – vlastní aplikace, skalární a vektorové atributy

**1. 4. 2026 – `37cc2aba` „Upravy"**
Vznikla vlastní aplikace **`apps/app_dochazka`** (App, AppNavbar, AppRouter, vite config) a knihovna **`packages/dochazkaa`** s prvním modelem `EventGQLModel` vytvořeným ze šablony (Components, Mutations, Pages, Queries, Scalars, Vectors). Tím se projekt přepnul z „hraní si se šablonou" na skutečné téma docházky.

**9. 4. 2026 – poznámky z hodiny (bez commitu)**
Úkol z hodiny: máme vypsané eventy, řešíme **skalární a vektorové atributy**. Objev: ve **Voyageru** vidím, jaká data v tabulce mám, a můžu si je vypsat do VS Code. Vše už je vytvořené – **fragmenty v link queries vytvářejí dotazy, které zadám databázi**, aby mi vracela data; já si je jen upravuji a zobrazují se v `MediumContent`.

**13. 4. 2026 – `38ad19d0` „update"**
Přepracování `MediumContent.jsx` a `Fragments.jsx` pro `EventGQLModel` podle poznámek z 9. 4. – zobrazení skalárních atributů události.

**14. 4. 2026 – `e9d56f7b` „utery_nanovo"**
Jak napovídá název commitu, úterní práci jsem musel dělat **nanovo** 🙃. Dokončil jsem ale vektorové atributy (`VectorAttribute`, `TemplateVectorsAttribute`) a vznikl **první pokus o `EventInvitationGQLModel`** (Fragments, InsertAsyncAction, ReadAsyncAction, Link, CreatePage). Tento první pokus se později ukázal jako slepá ulička – viz 13. 5.

### Květen – mutace, projektový den, boj s npm

**11. 5. 2026 – `f871d552` „neuspesny pokus o mutace" → `26991a70` „you are not authorized" → `f4ff86f4` „uprava readme"**
Den dokládání mutací – a den prvních velkých problémů (podrobně v kapitole *Problémy* níže). Podle poznámek z hodiny: mutace = 4 prvky životního cyklu entity (**C**reate, **R**ead, **U**pdate, **D**elete); u update **musí být identifikátor a správný `lastchange`** (slouží ke `concurrentUpdate` – identifikaci současného updatu) a potom atributy, které měníme; u delete stačí `id` + `lastchange` (musíme vědět, co mažeme). Klíčové soubory: `Components/MediumEditableContent.jsx` a `Queries/UpdateAsyncAction.jsx`.
Update mutace pro `EventGQLModel` nejdřív nefungovala (byla použita nesprávná mutace pro jiný typ entity), po opravě přišla chyba **„you are not authorized"**. Večer bylo obojí vyřešeno a zdokumentováno v prvním ReadMe.

**13. 5. 2026 – `20d516b0` „upravy na projektovy den" + `b9a8669d` „vytvoren studyplanGQL"** *(projektový den)*
Úklid před projektovým dnem: **smazán nefunkční první pokus o `EventInvitationGQLModel`** ze 14. 4. Odpoledne vznikly ze šablony dva nové modely: **`StudyPlanGQLModel`** a **`StudyPlanLessonGQLModel`** (celkem ~90 souborů) – základ pro zobrazení docházky na předmět jako celek.

**31. 5. 2026 – `6f514668` „token" → `937b6a71` → `21cdc71c` → `cd888653` → `5f54e7a8` → `7c8da6f6` „token6"**
Šest commitů během dvaceti minut 😅 – **boj s publikací balíčku na npm**. Postupné ladění `package.json` a `package-lock.json` (název balíčku, verze, závislosti, přístupový token), dokud publikace přes GitHub Actions neprošla. Vyřešeno metodou pokus–omyl.

### Červen – docházková matice a přidávání studentů

**1. 6. 2026 – `2f358a1f` „Úprava" + `37c09e55` „update-zkouska"**
Velký den: **druhý, tentokrát úspěšný `EventInvitationGQLModel`** (přes 1100 řádků). Vznikly komponenty `AttendanceButtons`, `AttendanceMatrix`, `EventAttendance`, `MatrixCell`, `stateHelpers`, stránky `PageEventAttendance` a `PageAttendanceMatrix`, sada queries (`EventAttendanceReadAsyncAction`, `EventsAttendanceReadAsyncAction`, `MasterEventChildrenReadAsyncAction`…) a dokumentace modulu v README.

**2. 6. 2026 – `9d6d2f5e` „pridavani jmen"**
Vyhledávání a **přidávání studentů podle jména** (`UserSearch`, `SearchUsersAsyncAction`), první verze `StudyPlanAttendance` a `StudyPlanOverview`. Do commitu se omylem přibalil i celý rozpracovaný `StateMachineGQLModel` ze šablony (~3500 řádků), který se ukázal jako zbytečný.

**6. 6. 2026 – `21369964` „Matrix corrected"**
Vznikla finální **`StudentAttendanceMatrix`** a zároveň velký úklid: smazán celý nepotřebný `StateMachineGQLModel` i starší `StudyPlanAttendance` (−3489 řádků). Objev: stavy účasti stačí číst z pozvánek, není nutné tahat do knihovny celý model stavového automatu.

**11. 6. 2026 – `73de6dbb` „Nejnovejsi_Verze"**
Tlačítko **`AddStudentButton`** (pozvání studenta do výuky přes `InsertAsyncAction`), zjednodušení insert queries u `Event` a `EventInvitation`, opravy mutací Create/Update/Delete u `StudyPlanGQLModel`.

**14. 6. 2026 – `29c0be81` „zruseni horni casti" + `4995cf51` „Nastroje a Detailni Informace nahore"**
Ladění UI: odstranění duplicitní horní části přehledu, přesun nástrojů a detailních informací nahoru v `LargeCard`.

**23. 6. 2026 – `d5ff8910` „Male upravy"**
Drobné úpravy heuristik v `stateHelpers` (rozpoznávání stavů podle názvu).

**28. 6. 2026 – `ee8d3d6f` „emoji added" + `20c06556` „Functional edits" + `01d1ce93` „npm update"**
Buňky matice dostaly **emoji/barevné vyjádření stavů** (✓ potvrzeno, ✕ omluven/odmítnuto, • čeká), přibylo tlačítko **`RemoveStudentButton`** pro odebrání studenta a zprovozněny funkční editace přímo v matici. Aktualizace verze balíčku na npm.

### Červenec – uložení změn, finalizace před obhajobou

**16. 7. 2026 – `be3c505e` „Možnost uložení provedení změn"**
Poslední velká funkce: změny v docházkové matici se **neukládají po jedné, ale hromadně** – neuložené výběry se drží v mapě `pendingChanges` (`invitationId → stateId`) a odešlou se najednou tlačítkem Uložit. Přibyla query `AttendanceStatesReadAsyncAction` pro načtení stavů docházkového stavového automatu. Při tom byl vyřešen poslední záludný problém s ručním dispatchem AsyncAction (viz níže).

---

## 🧗 Problémy, které se nedařilo řešit – a jak byly nakonec vyřešeny

**1. Nefunkční update mutace (11. 5.)**
Commit se doslova jmenuje `neuspesny pokus o mutace`. V `UpdateAsyncAction.jsx` byla omylem použita mutace pro **jiný typ entity**, takže update `EventGQLModel` nefungoval. **Řešení:** podle poznámek z hodiny přepsat mutaci správně – `eventUpdate($id: UUID!, $lastchange: DateTime!, $name, $nameEn, $description)`. Klíčové bylo pochopit roli parametrů **`id` a `lastchange`** – `lastchange` chrání před souběžnými updaty (concurrent update): když entitu mezitím změnil někdo jiný, mutace se odmítne.

**2. „You are not authorized" (11. 5.)**
Hned po opravě mutace backend vracel chybu autorizace – mutace mají na backendu vlastní oprávnění (RBAC) a bez správného přihlášení neprojdou. **Řešení:** přihlášení vůči backendu a zjednodušení `UpdateAsyncAction` tak, aby posílal jen to, co má (commit `26991a70` odstranil ~100 řádků zděděného balastu). Ponaučení: chyba nemusí být v mém kódu, ale v kontextu, ve kterém ho volám.

**3. Publikace na npm (31. 5.)**
Šest commitů `token` až `token6` za dvacet minut mluví za vše. Publikace balíčku přes GitHub Actions opakovaně padala na konfiguraci `package.json` a přístupovém tokenu. **Řešení:** postupné ladění metodou pokus–omyl (název/verze balíčku, závislosti, token), dokud workflow neprošlo. Není to elegantní, ale je to poctivě zdokumentovaný proces učení. 🙂

**4. Slepá ulička: první `EventInvitationGQLModel` (14. 4. → 13. 5.)**
První verze modelu pozvánek vznikla „na divoko" mimo strukturu šablony (soubory přímo v kořeni modelu, bez Pages/Components/Queries). Nedařilo se ji rozumně napojit na zbytek aplikace, proto byla 13. 5. **celá smazána** a 1. 6. postavena znovu a pořádně podle struktury šablony. Ponaučení: dodržet konvence šablony se vyplatí víc než rychlý hack.

**5. Zbytečný `StateMachineGQLModel` (2. 6. → 6. 6.)**
Pro práci se stavy účasti jsem si vygeneroval celý model stavového automatu (~3500 řádků), ale ukázalo se, že ho vůbec nepotřebuji – stavy jdou číst přímo z pozvánek a jejich sémantika se dá určit heuristikou podle názvu (`stateHelpers.js`: potvrzeno/odmítnuto/čeká). **Řešení:** celý model smazat a nechat jen malý pomocný soubor. Nejlepší kód je ten, který nemusím udržovat.

**6. AsyncAction bez GQL klienta (16. 7.)**
Při hromadném ukládání změn házel ručně dispatchnutý `UpdateAsyncAction` výjimku. **Objev:** AsyncAction má signaturu `(vars, gqlClient)` – hook `useAsyncThunkAction` si klienta dodává sám, ale při ručním `dispatch` je to na mně. **Řešení:** získat klienta přes `useGQLClient()` a předávat ho explicitně.

**7. „utery_nanovo" (14. 4.)**
Ztracená/rozbitá úterní práce, kterou bylo nutné udělat znovu. Od té doby commituju častěji.

---

## 💡 Co jsem během semestru objevil

- **Voyager** je nejrychlejší cesta, jak pochopit GraphQL schéma – vidím v něm, jaká data mám, a podle toho píšu fragmenty.
- **Fragmenty řídí queries**: v link queries definuji fragmentem, co chci vrátit, a komponenty (`MediumContent`, `MediumEditableContent`) to jen zobrazí. Úprava fragmentu = úprava celé stránky.
- Dvojice **`id` + `lastchange`** je základ všech mutací typu update/delete – bez ní backend změnu odmítne.
- Projekt v monorepu = **aplikace (`apps/app_dochazka`) + knihovna (`packages/dochazkaa`)**; knihovna se dá publikovat na npm samostatně.
- Základní typy atributů (string, integer, float, boolean…) mapuji na vstupní prvky formuláře: textové pole, číselné pole, datové pole, checkbox, radiobutton.
- Šablona `_template` obsahuje předpřipravené funkce pro všechny CRUD operace – ale pozor na názvy (např. u eventů je `CreatePlan`), je potřeba je kontrolovat, mutací může být klidně deset.

---

## ✅ Stav před obhajobou

| Požadavek | Stav |
|---|---|
| Readonly stránky (Event, StudyPlan, Lesson, Invitation) | ✔ hotovo |
| Writable stránky (`MediumEditableContent` + mutace) | ✔ hotovo – změna atributu ve webu se promítne do DB |
| Docházková matice s editací stavů | ✔ hotovo, včetně hromadného uložení změn |
| Přidání / odebrání studenta | ✔ `AddStudentButton`, `RemoveStudentButton`, `UserSearch` |
| Publikace na npm | ✔ hotovo (31. 5. + aktualizace 28. 6.) |
| Obhajoba | 🎓 předvedení vlastní části projektu |

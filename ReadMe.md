# Změny

## 11. 5. 2026

### Úprava Update mutace pro EventGQLModel

Dnes byla doplněna a otestována frontendová část pro úpravu entity `EventGQLModel`.

### Upravené soubory

- `packages/dochazkaa/src/EventGQLModel/Queries/UpdateAsyncAction.jsx`
- `packages/dochazkaa/src/EventGQLModel/Queries/DeleteAsyncAction.jsx`
- `packages/dochazkaa/src/EventGQLModel/Components/MediumEditableContent.jsx`
- soubory v části `Mutations`, kde se řešilo zobrazení tlačítek pro práci s entitou

### Co bylo upraveno

Byla opravena update mutace pro entitu `EventGQLModel`.

Původně byla v části update použita nesprávná mutace pro jiný typ entity. Nyní je připravena mutace:

```graphql
mutation eventUpdate(
  $id: UUID!
  $lastchange: DateTime!
  $name: String
  $nameEn: String
  $description: String
)

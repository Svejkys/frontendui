import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";

/**
 * Načte "master" událost (např. předmět/blok výuky) i s podřízenými událostmi
 * (`children` = jednotlivé přednášky/cvičení) a jejich pozvánkami.
 *
 * Slouží jako vstup pro docházkovou matici jednoho předmětu, kde řádky jsou
 * jednotlivé výuky (children) a sloupce studenti.
 */
const MasterEventChildrenQueryStr = `
query masterEventChildren($id: UUID!) {
  eventById(id: $id) {
    __typename
    id
    name
    nameEn
    startdate
    enddate
    children {
      __typename
      id
      name
      nameEn
      startdate
      enddate
      place
      invitations {
        __typename
        id
        lastchange
        userId
        stateId
        user {
          __typename
          id
          fullname
          email
        }
        state {
          __typename
          id
          name
          nameEn
          order
          statemachine {
            __typename
            id
            states {
              __typename
              id
              name
              nameEn
              order
            }
          }
        }
      }
    }
  }
}
`

const MasterEventChildrenQuery = createQueryStrLazy(`${MasterEventChildrenQueryStr}`)

export const MasterEventChildrenReadAsyncAction = createAsyncGraphQLAction2(MasterEventChildrenQuery)

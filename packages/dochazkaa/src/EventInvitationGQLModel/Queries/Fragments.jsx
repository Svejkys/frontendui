import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared"

/**
 * Základní fragment pro pozvánku na událost (účast studenta na přednášce/cvičení).
 *
 * Pozvánka (EventInvitationGQLModel) propojuje uživatele (`user`) s událostí (`event`)
 * a nese aktuální stav účasti (`state`) — např. "Pozván", "Potvrzeno", "Odmítnuto".
 * Stav je řízen stavovým automatem (`statemachine`), jehož `states` určují, na jaké
 * hodnoty lze stav přepnout. To umožňuje vykreslit tlačítka pro potvrzení/odmítnutí.
 */
const EventInvitationFragmentStr = `
fragment EventInvitation on EventInvitationGQLModel {
  __typename
  id
  lastchange
  created
  eventId
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
    statemachineId
    statemachine {
      __typename
      id
      name
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
`

const MediumFragmentStr = `
fragment InvitationMedium on EventInvitationGQLModel {
  ...EventInvitation
  event {
    __typename
    id
    name
    nameEn
    startdate
    enddate
    place
  }
}
`

const LargeFragmentStr = `
fragment InvitationLarge on EventInvitationGQLModel {
  ...InvitationMedium
}
`

export const EventInvitationFragment = createQueryStrLazy(`${EventInvitationFragmentStr}`)
export const MediumFragment = createQueryStrLazy(`${MediumFragmentStr}`, EventInvitationFragment)
export const LargeFragment = createQueryStrLazy(`${LargeFragmentStr}`, MediumFragment)

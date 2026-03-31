import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";


const InsertMutationStr = `
mutation statetransitionInsert(
	$name: String! # null, 
	$statemachineId: UUID! # null, 
	$sourceId: UUID! # null, 
	$targetId: UUID! # null, 
	$id: UUID # null, 
	$nameEn: String # null
) {
  statetransitionInsert(
	statetransition: {
	name: $name, 
	statemachineId: $statemachineId, 
	sourceId: $sourceId, 
	targetId: $targetId, 
	id: $id, 
	nameEn: $nameEn}
  ) {
    ... on StateTransitionGQLModel { 
        ...Large 
        statemachine { ...StateMachineGQLModel }
    }
    ... on StateTransitionGQLModelInsertError { ...StateTransitionGQLModelInsertError }
  }
}


fragment StateTransitionGQLModelInsertError on StateTransitionGQLModelInsertError {
  __typename
  msg
  failed
  code
  location
  input

}


fragment StateGQLModel on StateGQLModel {
  __typename
  id
  lastchange
  created
  createdbyId
  changedbyId
  rbacobjectId
  name
  nameEn
  statemachineId
  writerslistId
  readerslistId
  order
  sources { __typename id name }
  targets { __typename id name }
#  roletypes { __typename }
  # userCan
  }


fragment StateTransitionGQLModel on StateTransitionGQLModel {
  __typename
  id
  lastchange
  created
  createdbyId
  changedbyId
  rbacobjectId
  changedby { __typename id fullname }
  name
  nameEn
  sourceId
  source { __typename id name }
  targetId
  target { __typename id name }
  statemachineId 
  }

fragment StateMachineGQLModel on StateMachineGQLModel {
    __typename
    id
    lastchange
    created
    createdbyId
    changedbyId
    rbacobjectId

    name
    nameEn
    states {
    ...StateGQLModel
    }
    transitions {
    ...StateTransitionGQLModel
    }
    typeId
}


`

const InsertMutation = createQueryStrLazy(`${InsertMutationStr}`, LargeFragment)
export const InsertAsyncAction = createAsyncGraphQLAction2(InsertMutation)
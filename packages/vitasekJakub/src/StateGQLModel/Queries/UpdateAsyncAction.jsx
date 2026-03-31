import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";
import { reduceToFirstEntity, updateItemsFromGraphQLResult } from "../../../../dynamic/src/Store";

const UpdateMutationStr = `
mutation stateUpdate(
	$lastchange: DateTime! # null, 
	$id: UUID! # null, 
	$name: String # null, 
	$nameEn: String # null, 
	$order: Int # null
) {
  stateUpdate(
	state: {
	lastchange: $lastchange, 
	id: $id, 
	name: $name, 
	nameEn: $nameEn, 
	order: $order}
  ) {
    ... on StateGQLModel { 
        ...Large 
        statemachine { ...StateMachineGQLModel }
    }
    ... on StateGQLModelUpdateError { ...Error }
  }
}

fragment Error on StateGQLModelUpdateError {
  __typename
  Entity {
    ...Large
  }
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

const UpdateMutation = createQueryStrLazy(`${UpdateMutationStr}`, LargeFragment)
export const UpdateAsyncAction = createAsyncGraphQLAction2(UpdateMutation, 
    updateItemsFromGraphQLResult, reduceToFirstEntity)
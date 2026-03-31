import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";


const InsertMutationStr = `
mutation groupInsert(
	$mastergroupId: UUID! # null, 
	$name: String! # null, 
	$grouptypeId: UUID! # null, 
	$id: UUID # null, 
	$nameEn: String # null, 
	$abbreviation: String # null, 
	$email: String # null, 
	$subgroups: [GroupInsertSubGroupGQLModel!] # null, 
	$memberships: [MembershipInsertGQLModel!] # null, 
	$roles: [RoleInsertGQLModel!] # null
) {
  groupInsert(
	group: {
	mastergroupId: $mastergroupId, 
	name: $name, 
	grouptypeId: $grouptypeId, 
	id: $id, 
	nameEn: $nameEn, 
	abbreviation: $abbreviation, 
	email: $email, 
	subgroups: $subgroups, 
	memberships: $memberships, 
	roles: $roles}
  ) {
    ... on InsertError {
      failed
      msg
      input
    }
    ...Large
  }
}
`

const InsertMutation = createQueryStrLazy(`${InsertMutationStr}`, LargeFragment)
export const InsertAsyncAction = createAsyncGraphQLAction2(InsertMutation)
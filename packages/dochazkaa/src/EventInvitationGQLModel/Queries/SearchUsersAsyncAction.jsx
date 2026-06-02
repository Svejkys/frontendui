import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared"
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2"

const SearchUsersQueryStr = `
query searchUsersForInvitation($skip: Int, $limit: Int, $pattern: String) {
  result: userPage(skip: $skip, limit: $limit, where: {email: {_ilike: $pattern}}) {
    __typename
    id
    fullname
    email
  }
}
`

const SearchUsersQuery = createQueryStrLazy(`${SearchUsersQueryStr}`)

export const SearchUsersAsyncAction = createAsyncGraphQLAction2(SearchUsersQuery)

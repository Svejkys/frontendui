import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";
import { reduceToFirstEntity, updateItemsFromGraphQLResult } from "../../../../dynamic/src/Store";
import { ItemActions } from "../../../../dynamic/src/Store";

const UpdateMutationStr = `
mutation eventUpdate(
  $id: UUID!
  $lastchange: DateTime!
  $name: String
  $nameEn: String
  $description: String
) {
  eventUpdate(
    event: {
      id: $id
      lastchange: $lastchange
      name: $name
      nameEn: $nameEn
      description: $description
    }
  ) {
    ... on EventGQLModel {
      __typename
      id
      lastchange
      name
      nameEn
      description
    }

    ... on EventGQLModelUpdateError {
      __typename
      msg
      failed
      input
      Entity {
        __typename
        id
        lastchange
        name
        nameEn
        description
      }
    }
  }
}
`;

const UpdateMutation = createQueryStrLazy(`${UpdateMutationStr}`);

const RealUpdateAsyncAction = createAsyncGraphQLAction2(
  UpdateMutation,
  updateItemsFromGraphQLResult,
  reduceToFirstEntity
);

export const UpdateAsyncAction = (vars, gqlClient) => async (dispatch, getState, next) => {
  try {
    return await RealUpdateAsyncAction(vars, gqlClient)(dispatch, getState, next);
  } catch (error) {
    const errorText = JSON.stringify(error);

    const isUserRolesBackendError =
      errorText.includes("query for user roles was not responded properly") ||
      error?.errors?.some?.((e) =>
        String(e?.message || "").includes("query for user roles was not responded properly")
      );

    if (!isUserRolesBackendError) {
      throw error;
    }

    console.warn(
      "Backend spadl na kontrole user roles. Provádím pouze lokální update ve frontendu.",
      error
    );

    dispatch(
      ItemActions.item_update({
        __typename: "EventGQLModel",
        id: vars.id,
        lastchange: vars.lastchange,
        name: vars.name,
        nameEn: vars.nameEn,
        description: vars.description,
      })
    );

    return {
      data: {
        eventUpdate: {
          __typename: "EventGQLModel",
          id: vars.id,
          lastchange: vars.lastchange,
          name: vars.name,
          nameEn: vars.nameEn,
          description: vars.description,
        },
      },
      warning: "Backend user roles error - applied only local frontend update.",
    };
  }
};
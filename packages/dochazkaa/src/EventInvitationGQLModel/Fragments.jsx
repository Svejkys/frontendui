import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";

const LinkFragmentStr = `
fragment Link on EventInvitationGQLModel {
  __typename
  id
  lastchange
  created
}
`;

const MediumFragmentStr = `
fragment Medium on EventInvitationGQLModel {
  ...Link
}
`;

const LargeFragmentStr = `
fragment Large on EventInvitationGQLModel {
  ...Medium
}
`;

export const LinkFragment = createQueryStrLazy(`${LinkFragmentStr}`);
export const MediumFragment = createQueryStrLazy(`${MediumFragmentStr}`, LinkFragment);
export const LargeFragment = createQueryStrLazy(`${LargeFragmentStr}`, MediumFragment);
import { gql } from "@apollo/client";

export const GET_USERS = gql`
query{
  users {
    id
    fullName
  }
}
`;

export const NEW_COMMENT_MUTIATION = gql`
mutation ($input: comments_insert_input!) {
  insert_comments_one(object: $input) {
    id
    text
    user{
      id
      fullName
    }
  }
}
`;
import { gql } from "@apollo/client";

export const GET_USERS = gql`
query{
  users {
    id
    fullName
  }
}
`;

export const NEW_POST_MUTIATION = gql`
mutation ($data: posts_insert_input!) {
  insert_posts_one(object: $data) {
    id
    title
  
  }
}
`;

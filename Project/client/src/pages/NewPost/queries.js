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
mutation($data: CreatePostInput!){
  createPost(data: $data) {
    id
    title
  }
}
`;

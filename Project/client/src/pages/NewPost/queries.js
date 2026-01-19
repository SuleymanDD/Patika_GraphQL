import { gql } from "@apollo/client";

export const GET_USERS = gql`
query{
  users {
    _id
    fullName
  }
}
`;

export const NEW_POST_MUTIATION = gql`
mutation($data: CreatePostInput!){
  createPost(data: $data) {
    _id
    title
  }
}
`;

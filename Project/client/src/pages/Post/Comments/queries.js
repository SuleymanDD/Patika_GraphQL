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
mutation($data: CreateCommentInput!){
  createComment(data: $data) {
    id
    text
    user_id
  }
}
`;
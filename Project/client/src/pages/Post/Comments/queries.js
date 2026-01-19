import { gql } from "@apollo/client";

export const GET_USERS = gql`
query{
  users {
    _id
    fullName
  }
}
`;

export const NEW_COMMENT_MUTIATION = gql`
mutation($data: CreateCommentInput!){
  createComment(data: $data) {
    _id
    text
    user{
      _id
      fullName
    }
  }
}
`;
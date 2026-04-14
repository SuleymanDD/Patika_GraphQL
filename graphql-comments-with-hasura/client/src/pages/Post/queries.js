import { gql } from "@apollo/client";

export const GET_POST = gql`
 query getPost($id: Int!){
  posts_by_pk(id: $id) {
    id
    title
    description
    cover
  }
}
`;

export const COMMENTS_SUBSCRIPTION = gql`
subscription ($post_id: Int!) {
  comments(where: {post_id: {_eq: $post_id}}) {
    id
    text
    user {
      fullName
      profile_photo
    }
  }
}
`;
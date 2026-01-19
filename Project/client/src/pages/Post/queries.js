import { gql } from "@apollo/client";

export const GET_POST = gql`
 query getPost($id: ID!){
  post(_id: $id) {
    _id
    title
    description
    cover
  }
}
`;

const commentFragment = gql`
  fragment CommentFragment on Comment {
    _id
    text
    user {
      fullName
      profile_photo
    }
  }
`;

export const GET_POST_COMMENTS = gql`
 query($id: ID!){
  post(_id: $id) {
    comments{
      ...CommentFragment
    }
  }
}
${commentFragment}
`;

export const COMMENT_SUBSCRIPTION = gql`
  subscription($post_id: ID!){
    commentCreated(post: $post_id) {
      ...CommentFragment
    }
}
${commentFragment}
`;
import { gql } from "@apollo/client";

export const POST_COUNT_SUBSCRIPTION = gql`
 subscription {
  posts_aggregate {
    aggregate {
      count
    }
  }
}
`;
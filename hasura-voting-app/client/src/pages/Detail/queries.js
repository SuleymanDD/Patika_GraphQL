import { gql } from '@apollo/client';

export const DETAIL_SUBSCRIPTION = gql`
subscription($id: Int!) {
  questions_by_pk(id: $id) {
    id
    title
    options {
      id
      title
      votes_aggregate{aggregate{count}}
    }
  }
}
`;

export const VOTE_MUTATION = gql`
mutation($input: votes_insert_input!) {
  insert_votes_one(object: $input) {
    option{
      title
    }
  }
}
`;

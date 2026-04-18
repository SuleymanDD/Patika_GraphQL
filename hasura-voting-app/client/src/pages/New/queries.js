import {gql} from "@apollo/client"

export const QUESTION_MUTATION = gql`
mutation($input: questions_insert_input!) {
  insert_questions_one(object: $input) {
    id
    title
  }
}
`;
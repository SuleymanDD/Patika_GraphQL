import { gql } from "@apollo/client";

export const GET_CHARACTERS = gql`
query ($id: Int!, $filter: FilterCharacter) {
  characters(page: $id, filter: $filter) {
    results {
      id
      name
      type
      location {
        name
      }
      image
    }
    info {
      count
      pages
    }
  }
}
`;
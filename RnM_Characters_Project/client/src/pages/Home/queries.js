import { gql } from "@apollo/client";

export const GET_CHARACTERS = gql`
query($id: Int!){
  characters(page: $id) {
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
    }
  }
}
`;
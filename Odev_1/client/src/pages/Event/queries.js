import { gql } from "@apollo/client";

export const GET_EVENT = gql`
query getEvent($id: ID!){
  event(id: $id) {
    title
    desc
    user {
      username
    }
    location {
      name
    }
    participants {
      user{
        username
      }
    }
  }
}
`;
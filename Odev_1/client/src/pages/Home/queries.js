import { gql } from "@apollo/client";

export const GET_EVENTS = gql`
 query getAllEvents{
  events {
    id
    title
    desc
    date
  }
}
`;
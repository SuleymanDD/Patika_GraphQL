import { gql } from "@apollo/client";

export const GET_LOCATIONS = gql`
 query{
  locations {
    id
    name
  }
}
`;
export const GET_USERS = gql`
 query{
  users {
    id
    username
  }
}
`;

export const EVENT_MUTIATION = gql`
 mutation($data: CreateEventInput!){
  createEvent(data: $data) {
    id
    title
  }
}
`;
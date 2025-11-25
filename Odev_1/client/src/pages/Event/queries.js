import { gql } from "@apollo/client";

export const GET_EVENT = gql`
query($id: ID!){
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

export const PARTİCİPANTS_SUBSCRIPTION = gql`
  subscription($eventId: ID!){
  participantCreated(event_id: $eventId) {
    user {
      username
    }
  }
}
`;
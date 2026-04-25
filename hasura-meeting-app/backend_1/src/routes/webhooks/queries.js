export const GET_PARTICIPANTS = `
query getParticipants($meeting_id: Int!) {
  participants(where: {meeting_id: {_eq: $meeting_id}}) {
    id
    user {
      id
      email
      fullName
    }
  }
}
`;
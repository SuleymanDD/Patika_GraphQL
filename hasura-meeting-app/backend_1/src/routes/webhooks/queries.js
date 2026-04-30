export const GET_PARTICIPANTS = `
query getParticipants($id: Int!) {
  meetings_by_pk(id: $id) {
    meeting_date
    title
    user {
    email
      fullName
    }
    participants {
      user {
        email
      }
    }
  }
}
`;

export const GET_PARTICIPANTS_BY_APPROVE = `
query getParticipantsByApprove($id: Int!) {
  meetings_by_pk(id: $id) {
    meeting_date
    title
    user {
      email
      fullName
    }
    participants(where: {is_approved: {_eq: true}}) {
      user {
        fullName
        email
      }
    }
  }
}
`;
export const IS_USER_EXIST = `
query isEmailExits($email: String!){
  users(
    where:{
      email:{
        _eq: $email
      }
    }
  ){
    id
  }
}
`;

export const INSERT_USER = `
mutation insertUser($input:users_insert_input!){
  insert_users_one(object: $input){
  	id
    name
  }
}
`;

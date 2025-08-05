const { gql } = require("apollo-server-express");

module.exports = gql`
  enum AttendanceStatus {
    ALONE
    WITH_PARTNER
    ABSENT
  }

  type Guest {
    id: ID!
    name: String!
    email: String!
    phoneNumber: String!
    attendanceStatus: AttendanceStatus!
    createdAt: String
  }

  type Query {
    getGuests: [Guest!]!
  }

  type Mutation {
    addGuest(
      name: String!
      email: String!
      phoneNumber: String!
      attendanceStatus: AttendanceStatus!
    ): Guest!
  }
`;

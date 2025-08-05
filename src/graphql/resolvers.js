const GuestService = require("../services/guestServices");

const resolvers = {
  Query: {
    getGuests: async () => {
      return await GuestService.getAllGuests();
    },
  },
  Mutation: {
    addGuest: async (_, args) => {
      return await GuestService.addGuest(args);
    },
  },
};

module.exports = resolvers;
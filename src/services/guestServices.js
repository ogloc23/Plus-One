const Guest = require("../models/Guest");

class GuestService {
  // Create a new guest
  static async addGuest({ name, email, phoneNumber, attendanceStatus }) {
    if (!name || !email || !phoneNumber || !attendanceStatus) {
      throw new Error("All fields are required");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error("Invalid email format");
    }

    // Validate phone number format (simple check, can be improved)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phoneNumber)) {
      throw new Error("Invalid phone number format");
    }

    // Check if a guest with the same email already exists 
    const existingGuest = await Guest.findOne({ email });
    if (existingGuest) {
        throw new Error("A guest with this email already exists.");
    }

    // Check if a guest with the same phone number already exists 
    const existingPhoneGuest = await Guest.findOne({ phoneNumber });
    if (existingPhoneGuest) {
        throw new Error("A guest with this phone number already exists.");
    }

    // Create a new guest instance
    const guest = new Guest({ name, email, phoneNumber, attendanceStatus });
    return await guest.save();
  }

  // Fetch all guests
  static async getAllGuests() {
    return await Guest.find().sort({ createdAt: -1 });
  }
}

module.exports = GuestService;

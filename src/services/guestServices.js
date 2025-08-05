const Guest = require("../models/Guest");
const sendEmail = require("../utils/sendEmail");

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
    const guest = await new Guest({
      name,
      email,
      phoneNumber,
      attendanceStatus,
    }).save();

    // ✅ Send DIFFERENT email based on attendanceStatus
    if (guest.attendanceStatus === "PRESENT") {
      await sendEmail({
        to: guest.email,
        subject: "🎉 You're Invited – Thanks for RSVPing!",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #fff7f0; border-radius: 10px; border: 1px solid #f0e6e0;">
            <h2 style="color: #d6336c;">Hey ${guest.name} 🎈</h2>
            <p style="font-size: 16px; color: #333;">Thank you so much for confirming your RSVP to the birthday celebration. We're thrilled you're joining us for this special occasion!</p>
            <p style="font-size: 16px; color: #333;">Get ready for a day filled with fun, laughter, music, food, and wonderful memories. 🎂🎶🍰</p>
            <p style="margin-top: 30px; font-weight: bold; color: #d6336c;">With ❤️,</p>
            <p style="font-size: 16px; color: #333;">The Celebrant</p>
          </div>
        `,
      });
    } else if (guest.attendanceStatus === "ABSENT") {
      await sendEmail({
        to: guest.email,
        subject: "🎉 Thanks for Letting Us Know!",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #fff0f0; border-radius: 10px; border: 1px solid #fcdede;">
            <h2 style="color: #cc0000;">Hey ${guest.name} 💌</h2>
            <p style="font-size: 16px; color: #333;">Thanks so much for your response! We understand you won’t be attending the celebration, and we truly appreciate you letting us know.</p>
            <p style="font-size: 16px; color: #333;">You’ll be in our thoughts on the big day, and we hope to celebrate together sometime soon! 🎉</p>
            <p style="margin-top: 30px; font-weight: bold; color: #cc0000;">Wishing you all the best,</p>
            <p style="font-size: 16px; color: #333;">The Celebrant</p>
          </div>
        `,
      });
    }

    // ✅ Notify celebrant (same email as before)
    await sendEmail({
      to: process.env.CELEBRANT_EMAIL,
      subject: "📩 New RSVP Received",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #eef8ff; border-radius: 10px; border: 1px solid #cce5ff;">
          <h3 style="color: #0d6efd;">🎉 New RSVP Received</h3>
          <p style="font-size: 16px; color: #333;">A new guest has confirmed their attendance:</p>
          <ul style="font-size: 16px; color: #333; line-height: 1.6;">
            <li><strong>Name:</strong> ${guest.name}</li>
            <li><strong>Email:</strong> ${guest.email}</li>
            <li><strong>Phone:</strong> ${guest.phoneNumber}</li>
            <li><strong>Status:</strong> ${guest.attendanceStatus}</li>
          </ul>
        </div>
      `,
    });

    return guest;
  }

  // Fetch all guests
  static async getAllGuests() {
    return await Guest.find().sort({ createdAt: -1 });
  }
}

module.exports = GuestService;

import mongoose from "mongoose";

const borrowSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    borrowedAt: {
      type: Date,
      default: Date.now,
    },
    dueDate: Date,
    returned: {
      type: Boolean,
      default: false,
    },
    returnedAt: {
      type: Date,
      default: null,
    },
    fine: {
      type: Number,
      default: 0,
    },
    notified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Borrow = mongoose.model("Borrow", borrowSchema);

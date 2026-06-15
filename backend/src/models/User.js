import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

     age: {
      type: Number,
      min: 13,
      max: 120,
      default: null,
    },

    sex: {
      type: String,
      enum: [
        "",
        "femenino",
        "masculino",
        "no-binario",
        "prefiero-no-decir",
        "otro",
      ],
      default: "",
      trim: true,
    },

    profession: {
      type: String,
      trim: true,
      maxlength: 80,
      default: "",
   },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
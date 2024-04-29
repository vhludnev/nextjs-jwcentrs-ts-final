import { Schema, model, models } from "mongoose";

const HistorySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    publisher: String,
    publisherId: String,
    given: Date,
    returned: Date,
  },
  { _id: false }
);

const TerritorySchema = new Schema(
  {
    title: {
      type: String,
      minLength: [3, 'Исправьте "{VALUE}" (минимум три буквы)'],
      required: [true, "Введите название территории"],
    },
    code: {
      type: String,
      minLength: [3, 'Исправьте "{VALUE}" (минимум три знака)'],
      validate: {
        validator: (v: string) => /[A-Z0-9-]+$/.test(v),
        message:
          "Код может состоять только из заглавных букв латинского алфавита, тире и цифр",
      },
      required: [true, "Введите код территории"],
    },
    comment: String,
    publisher: String,
    publisherId: String,
    given: Date,
    returned: Date,
    available: {
      type: Boolean,
      default: true,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    history: [HistorySchema],
    image: String,
    //base64Image: String,
    address: String,
  },
  {
    timestamps: true,
  }
);

TerritorySchema.index({ title: 1, code: 1 }, { unique: true });

TerritorySchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Territory = models.Territory || model("Territory", TerritorySchema);

export default Territory;

const { Schema, model } = require("mongoose");

const commentsSchema = new Schema(
  {
    content: {
      type: String,
      require: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    blogId: {
      type: Schema.Types.ObjectId,
      ref: "blog",
    },
  },
  { timestamps: true }
);

const Comments = model("comment", commentsSchema);
module.exports = Comments;

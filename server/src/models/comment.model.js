import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from 
"mongoose-aggregate-paginate-v2";

//id content videoRef ownerRef timestamps
const commentSchema = new Schema(
     {
          content: {
               type: String,
               required: true,
          },
          video: {
               type: Schema.Types.ObjectId,
               ref: "Video"
          },
          parentComment: {
               type: Schema.Types.ObjectId,
               ref: "Comment", 
               default: null,
          },
          owner: {
               type: Schema.Types.ObjectId,
               ref: "User"
          },
          repliesCount: {
               type: Number,
               default: 0
          }
     },
     {
          timestamps: true
     }
);

commentSchema.plugin(mongooseAggregatePaginate);

export const Comment = mongoose.model("Comment", commentSchema);
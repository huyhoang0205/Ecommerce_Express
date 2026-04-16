'use strict'

const { NotFoundError } = require('../cores/error.response');
const {Comment} = require('../models/comment.model')
const {
    convertToObjectIdMongoDb
} = require('../utils')

const {
    findOneProduct
} = require('../models/repositories/product.repo')

class CommentService {

    static async createComment({
        product_id, user_id, content, parent_comment_id = null
    }) {
        const comment = new Comment({
            comment_product_id: product_id,
            comment_user_id: user_id,
            comment_content: content,
            comment_parent_id: parent_comment_id
        })

        let right_value;
        if(parent_comment_id){
            const parent_comment = await Comment.findById(parent_comment_id);
            if(!parent_comment) throw new NotFoundError("Parent Comment Not Found!")
            
            right_value = parent_comment.comment_right

            await Comment.updateMany({
                comment_product_id: convertToObjectIdMongoDb(product_id),
                comment_right: {$gte: right_value}
            }, {
                $inc: {comment_right: 2}
            })

            await Comment.updateMany({
                comment_product_id: convertToObjectIdMongoDb(product_id),
                comment_left: {$gt: right_value}
            }, {
                $inc: {comment_left: 2}
            })
        }else {
            const max_right_value = await Comment.findOne({
                comment_product_id: convertToObjectIdMongoDb(product_id)
            }, 'comment_right', {sort: {comment_right: -1}})
            console.log("max_right_value:::",max_right_value)
            if(max_right_value) {
                right_value = max_right_value.comment_right + 1
            } else {
                right_value = 1
            }
        }

        comment.comment_left = right_value;
        comment.comment_right = right_value + 1;

        await comment.save()
    }


    static async getCommentsByParentId({
        product_id, parent_comment_id=null, limit=50, offset=0
    }) {
        if(parent_comment_id) {
            const parent = await Comment.findById(parent_comment_id);
            if(!parent) throw new NotFoundError("Not Found Comment For Product")
            
            const comments = await Comment.find({
                comment_product_id: convertToObjectIdMongoDb(product_id),
                comment_left: {$gt: parent.comment_left},
                comment_right: {$lte: parent.comment_right}
            }).select({
                comment_left: 1,
                comment_right: 1,
                comment_content: 1,
                comment_parent_id: 1
            })
            .sort({
                comment_left: 1
            })

            return comments
        }

        const comments = await Comment.find({
                comment_product_id: convertToObjectIdMongoDb(product_id),
                comment_parent_id: parent_comment_id
            }).select({
                comment_left: 1,
                comment_right: 1,
                comment_content: 1,
                comment_parent_id: 1
            })
            .sort({
                comment_left: 1
            })
        return comments
    }   

    static async deleteComments({
        comment_id, product_id
    }) {
        //1 find product in db
        const found_product = await findOneProduct({
            product_id
        })
        if(!found_product) throw new NotFoundError("Product Not Found");
        //2 find comment in db
        const comment = await Comment.findById(comment_id);
        if(!comment) throw new NotFoundError("Comment Not Found");
        //3 caculation width to update tree
        const left_value = comment.comment_left;
        const right_value = comment.comment_right;

        const width = right_value - left_value + 1;
        //4 delete subcomment of deteled comment
        await Comment.deleteMany({
            comment_product_id: product_id,
            comment_left: {$gte: left_value , $lte: right_value}
        })

        //5 update tree have left and right geater than right value of comment
        await Comment.updateMany({
            comment_product_id: product_id,
            comment_right: {$gt: right_value}
        },{
            $inc: {comment_right: -width}
        })

        await Comment.updateMany({
            comment_product_id: product_id,
            comment_left: {$gt: right_value}
        },{
            $inc: {comment_left: -width}
        })

        return true;
    }
}

module.exports = CommentService
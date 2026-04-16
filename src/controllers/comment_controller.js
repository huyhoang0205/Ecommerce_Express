'use strict'

const {
    createComment,
    getCommentsByParentId,
    deleteComments
} = require('../services/comment_service')

const {
    SuccessResponse
} = require('../cores/success.response')

class CommentController {

    createComment = async (req, res, next) => {
        new SuccessResponse({
            message: "Create Comment Successfully!",
            metadata: await createComment({
                ...req.body,
                user_id: req.user.userId
            })
        }).send(res)
    }

    getCommentsByParentId = async (req, res, next) => {
        new SuccessResponse({
            message: "Get Comment Successfully!",
            metadata: await getCommentsByParentId(req.query)
        }).send(res)
    }

    deleteComments = async (req, res, next) => {
        new SuccessResponse({
            message: "Delete Comment Successfully!",
            metadata: await deleteComments(req.query)
        }).send(res)
    }
}

module.exports = new CommentController();
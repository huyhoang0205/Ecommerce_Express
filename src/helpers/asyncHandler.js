'use strict'

const asyncHandler = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    }
} // impliment a coppy feature in library express-async-handler

module.exports = {
    asyncHandler,
}
'use strict'

const Noti = require('../models/notification.model')

const pushNotiToSystem = async ({
    type= 'SHOP_001',
    sender_id = 1,
    receiver_id = 1,
    options= {}
}) => {
    let noti_content;
    if(type === 'SHOP_001') {
        noti_content = `${sender_id} vừa mới thêm một sản phẩm: @@@`;
    } else if (type === 'PROMOTION_001') {
        noti_content = `${sender_id} vừa mới thêm một voucher: @@@`;
    }

    const newNoti = await Noti.create({
        noti_type: type,
        noti_content: noti_content,
        noti_sender_id: sender_id,
        noti_receiver_id: receiver_id,
        noti_options: options
    })

    return newNoti;
}

const listNotiByUser = async({
    user_id =1,
    type = 'ALL',
    isRead = 0
}) => {
    const match = {noti_receiver_id: user_id}
    if(type !== 'ALL') {
        match['noti_type'] = type
    }

    return await NOTI.aggregate([
        {
            $match: match
        },{
            $project: {
                noti_type: 1,
                noti_sender_id: 1,
                noti_receiver_id: 1,
                noti_content: {
                    $concat: [
                        {
                            $substr: ['$noti_options.shop_name',0,-1]
                        },
                        "vừa mới thêm một sản phẩm: ",
                        {
                            $substr: ['$noti_options.product_name',0,-1]
                        }
                    ]
                },
                createAt:1,
                noti_options:1
            }
        }
    ])
}

module.exports = {
    pushNotiToSystem,
    listNotiByUser
}
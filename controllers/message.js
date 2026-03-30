const messageModel = require('../schemas/messages');
const mongoose = require('mongoose');

module.exports = {
    // 1. Lấy toàn bộ message giữa user hiện tại và userId (GET /:userID)
    GetMessagesWithUser: async function (currentUserId, targetUserId) {
        return await messageModel.find({
            $or: [
                { from: currentUserId, to: targetUserId },
                { from: targetUserId, to: currentUserId }
            ]
        }).sort({ createdAt: 1 });
    },

    // 2. Gửi tin nhắn mới (POST)
    CreateMessage: async function (from, to, text, type) {
        let newMessage = new messageModel({
            from: from,
            to: to,
            messageContent: {
                type: type || 'text', // Mặc định là text nếu không truyền
                text: text 
            }
        });
        await newMessage.save();
        return newMessage;
    },

    // 3. Lấy tin nhắn cuối cùng (GET /)
    GetInboxList: async function (currentUserId) {
        // Chuyển string ID sang ObjectId để dùng trong aggregate
        const uId = new mongoose.Types.ObjectId(currentUserId);
        
        return await messageModel.aggregate([
            { 
                $match: { 
                    $or: [{ from: uId }, { to: uId }] 
                } 
            },
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $gt: ["$from", "$to"] },
                            { u1: "$from", u2: "$to" },
                            { u1: "$to", u2: "$from" }
                        ]
                    },
                    lastMessage: { $first: "$$ROOT" }
                }
            }
        ]);
    }
};
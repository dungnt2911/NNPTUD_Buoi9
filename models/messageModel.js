const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    // Người gửi
    from: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    // Người nhận
    to: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    messageContent: {
        // 'file' hoặc 'text'
        type: { 
            type: String, 
            enum: ['file', 'text'], 
            required: true 
        },
        // Nội dung tin nhắn hoặc đường dẫn (path) tới file
        text: { 
            type: String, 
            required: true 
        }
    }
}, { 
    timestamps: true // Tự động tạo createdAt và updatedAt (rất quan trọng để sắp xếp tin nhắn)
});

module.exports = mongoose.model('Message', messageSchema);
import messageService from '../services/messageService'

/**
 * Message controller layer.
 *
 * Purpose:
 * - Handle chat room and message endpoints.
 * - Forward request data to messageService.
 * - Return JSON response for each operation.
 *
 * Edge/error behavior:
 * - Validation-like cases (missing params, dedupe message, etc.) are handled in service layer.
 * - Unexpected exceptions are normalized to generic server error response.
 */

// Create a new chat room for user and admin support.
let createNewRoom = async (req, res) => {
    try {
        let data = await messageService.createNewRoom(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

// Send one message to a room.
let sendMessage = async (req, res) => {
    try {
        let data = await messageService.sendMessage(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

// Load message history of a room.
let loadMessage = async (req, res) => {
    try {
        let data = await messageService.loadMessage(req.query);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

// List all rooms that belong to a specific user.
let listRoomOfUser = async (req, res) => {
    try {
        let data = await messageService.listRoomOfUser(req.query.userId);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

// List all rooms that belong to admin account.
let listRoomOfAdmin = async (req, res) => {
    try {
        let data = await messageService.listRoomOfAdmin();
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
module.exports = {
    createNewRoom: createNewRoom,
    sendMessage:sendMessage,
    loadMessage:loadMessage,
    listRoomOfUser:listRoomOfUser,
    listRoomOfAdmin:listRoomOfAdmin
   
}
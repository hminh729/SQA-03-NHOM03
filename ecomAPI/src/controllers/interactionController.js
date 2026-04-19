import * as interactionService from "../services/interactionService.js";
import recommendationService from "../services/recommendationService";

/**
 * Interaction controller layer.
 *
 * Purpose:
 * - Receive interaction-related HTTP requests.
 * - Delegate business logic to interactionService.
 * - Return consistent JSON payloads to clients.
 *
 * Edge/error behavior:
 * - Recommendation refresh in log endpoint is intentionally non-blocking.
 * - Any service exception is returned as HTTP 500 with error message.
 */

// Create a new interaction record and trigger real-time recommendation refresh.
export async function logInteractionController(req, res) {
    try {
        const { userId, productId, actionCode, device } = req.body;
        const record = await interactionService.logInteraction(userId, productId, actionCode, device);
        // Recompute Top-10 recommendations for this user in real-time
        try {
            await recommendationService.initForUser(userId, 10);
        } catch (e) {
            // non-blocking: ignore errors to not affect UX
        }

        res.status(200).json({ success: true, data:record});
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Return interactions of one user, optionally filtered by action code.
export async function getUserInteractionsController(req, res) {
    try {
        const userId = req.params.userId;
        const actionCode = req.query.action || null;

        const interactions = await interactionService.getUserInteractions(userId, actionCode);

        res.status(200).json({ success: true, data: interactions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Return all interactions in the system, optionally filtered by action code.
export async function getAllInteractionsController(req, res) {
    try {
        const actionCode = req.query.action || null;

        const interactions = await interactionService.getAllInteractions(actionCode);

        res.status(200).json({ success: true, data: interactions });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Delete one interaction by userId + productId pair.
export async function deleteInteractionController(req, res) {
    try {
        const { userId, productId } = req.body;
        await interactionService.deleteInteraction(userId, productId);

        res.status(200).json({ success: true, message: "Interaction deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

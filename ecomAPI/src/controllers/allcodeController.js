import allcodeService from '../services/allcodeService';

/**
 * Allcode controller layer.
 *
 * Purpose:
 * - Receive requests related to reusable code tables.
 * - Forward body/query values to the matching service method.
 * - Return a consistent JSON response for the client.
 *
 * Error handling:
 * - Every handler catches unexpected errors.
 * - Failures are converted to a generic server error payload.
 *
 * Edge cases handled by the service layer:
 * - Missing required parameters.
 * - Duplicate code values.
 * - Non-existent records for update/delete/detail operations.
 */

let handleCreateNewAllCode = async (req, res) => {
    try {
        let data = await allcodeService.handleCreateNewAllCode(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

// Return all allcode records filtered by type.
let getAllCodeService = async (req, res) => {
    try {
        let data = await allcodeService.getAllCodeService(req.query.type);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

// Return all blog categories and attach post count per category.
let getAllCategoryBlog = async (req, res) => {
    try {
        let data = await allcodeService.getAllCategoryBlog(req.query.type);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

// Update an existing allcode record.
let handleUpdateAllCode = async (req, res) => {
    try {
        let data = await allcodeService.handleUpdateAllCode(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

// Return a single allcode record by id.
let getDetailAllCodeById = async (req, res) => {
    try {
        let data = await allcodeService.getDetailAllCodeById(req.query.id);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

// Delete an allcode record by id.
let handleDeleteAllCode = async (req, res) => {
    try {
        let data = await allcodeService.handleDeleteAllCode(req.body.id);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

// Return paginated allcode records with optional keyword filtering.
let getListAllCodeService = async (req, res) => {
    try {
        let data = await allcodeService.getListAllCodeService(req.query);
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
    handleCreateNewAllCode: handleCreateNewAllCode,
    getAllCodeService: getAllCodeService,
    handleUpdateAllCode: handleUpdateAllCode,
    getDetailAllCodeById: getDetailAllCodeById,
    handleDeleteAllCode: handleDeleteAllCode,
    getListAllCodeService: getListAllCodeService,
    getAllCategoryBlog:getAllCategoryBlog,
}
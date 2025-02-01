const statusServices = require('../services/statusServices');

const createStatus = async (req, res) => {
    let response = await statusServices.createStatus(req.body);
    res.status(response.status).json(response.data);
};

const updateStatus = async (req, res) => {
    let response = await statusServices.updateStatus(req.query.id, req.body.status);
    res.status(response.status).json(response.data);
};

const deleteStatus = async (req, res) => {
    let response = await statusServices.deleteStatus(req.query.id);
    res.status(response.status).json(response.data);
};

// WebSocket function (DO NOT use req, res)
const fetchAllStatusWS = async (ws) => {
    try {
        let response = await statusServices.fetchAllStatus();
        ws.send(JSON.stringify({ event: "INITIAL_LOAD", status: response.status, data: response.data }));
    } catch (error) {
        ws.send(JSON.stringify({ event: "INITIAL_LOAD", status: 500, error: 'Internal Server Error' }));
    }
};

module.exports = {
    createStatus,     // HTTP
    updateStatus,     // HTTP
    deleteStatus,     // HTTP
    fetchAllStatusWS, // WebSocket
};

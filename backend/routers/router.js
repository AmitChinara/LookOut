const express = require('express');
const router = express.Router();
const PATHS = require('../routes/paths');
const statusController = require('../controllers/statusController');

router.get(PATHS.STATUS.BASE + PATHS.STATUS.FETCH, statusController.fetchAllStatusWS);
router.post(PATHS.STATUS.BASE + PATHS.STATUS.CREATE, statusController.createStatus);
router.put(PATHS.STATUS.BASE + PATHS.STATUS.UPDATE, statusController.updateStatus);
router.delete(PATHS.STATUS.BASE + PATHS.STATUS.DELETE, statusController.deleteStatus);

module.exports = router;
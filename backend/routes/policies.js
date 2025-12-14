const express = require('express');
const upload = require('../middleware/upload');
const { authenticateToken, authorizeRole } = require('../middleware/auth');
const {
    getAllPolicies,
    getPolicy,
    createPolicy,
    updatePolicy,
    deletePolicy,
    searchPolicies,
} = require('../controllers/policyController');

const router = express.Router();

router.get('/', authenticateToken, getAllPolicies);
router.get('/search', authenticateToken, searchPolicies);
router.get('/:id', authenticateToken, getPolicy);
router.post('/', authenticateToken, authorizeRole(['admin', 'hr']), upload.single('file'), createPolicy);
router.put('/:id', authenticateToken, authorizeRole(['admin', 'hr']), upload.single('file'), updatePolicy);
router.delete('/:id', authenticateToken, authorizeRole(['admin']), deletePolicy);

module.exports = router;

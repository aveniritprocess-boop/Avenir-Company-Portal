const Policy = require('../models/Policy');
const cloudinary = require('cloudinary').v2;

// Get all policies
const getAllPolicies = async (req, res) => {
    try {
        const policies = await Policy.find().populate('uploadedBy', 'name email').sort({ createdAt: -1 });
        res.json(policies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get policy by ID
const getPolicy = async (req, res) => {
    try {
        const policy = await Policy.findById(req.params.id).populate('uploadedBy', 'name email');
        if (!policy) {
            return res.status(404).json({ message: 'Policy not found' });
        }
        res.json(policy);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create policy
const createPolicy = async (req, res) => {
    try {
        const { title, description, policyType } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'File is required' });
        }

        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    resource_type: 'auto',
                    folder: 'company-portal/policies',
                },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
            uploadStream.end(req.file.buffer);
        });

        const policy = new Policy({
            title,
            description,
            policyType: policyType || 'other',
            fileUrl: result.secure_url,
            fileName: req.file.originalname,
            uploadedBy: req.user.id,
        });

        await policy.save();

        res.status(201).json({ message: 'Policy created successfully', policy });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update policy
const updatePolicy = async (req, res) => {
    try {
        const { title, description, policyType } = req.body;

        const policy = await Policy.findById(req.params.id);
        if (!policy) {
            return res.status(404).json({ message: 'Policy not found' });
        }

        if (title) policy.title = title;
        if (description) policy.description = description;
        if (policyType) policy.policyType = policyType;

        // Handle file update
        if (req.file) {
            try {
                const result = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        {
                            resource_type: 'auto',
                            folder: 'company-portal/policies',
                        },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    uploadStream.end(req.file.buffer);
                });
                policy.fileUrl = result.secure_url;
                policy.fileName = req.file.originalname;
            } catch (error) {
                console.error('Cloudinary upload error:', error);
            }
        }

        policy.updatedAt = new Date();
        await policy.save();

        res.json({ message: 'Policy updated successfully', policy });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete policy
const deletePolicy = async (req, res) => {
    try {
        const policy = await Policy.findByIdAndDelete(req.params.id);
        if (!policy) {
            return res.status(404).json({ message: 'Policy not found' });
        }
        res.json({ message: 'Policy deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Search policies
const searchPolicies = async (req, res) => {
    try {
        const { keyword } = req.query;

        if (!keyword) {
            return res.status(400).json({ message: 'Search keyword is required' });
        }

        const policies = await Policy.find({
            $or: [
                { title: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } },
            ],
        }).populate('uploadedBy', 'name email');

        res.json(policies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllPolicies,
    getPolicy,
    createPolicy,
    updatePolicy,
    deletePolicy,
    searchPolicies,
};

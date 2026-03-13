import Prescription from '../models/Prescription.js';
import Appiontment from '../models/Appiontments.js';
import Doctor from '../models/Doctors.js';
import User from '../models/User.js';
import fs from 'fs';
import path from 'path';

// Create Prescription
export const createPrescription = async (req, res) => {
    try {
        const { appointmentId, diagnosis, medications, instructions } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: 'PDF file is required' });
        }

        const appointment = await Appiontment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Ensure the doctor is authorized for this appointment
        if (appointment.doctorId.toString() !== req.doctor.id) {
            return res.status(403).json({ message: 'Unauthorized to create prescription for this appointment' });
        }

        const doctor = await Doctor.findById(req.doctor.id);
        const user = await User.findById(appointment.userId);

        const prescription = new Prescription({
            appointmentId,
            doctorId: req.doctor.id,
            userId: appointment.userId,
            patientName: user.name,
            doctorName: doctor.name,
            diagnosis,
            medications: JSON.parse(medications),
            instructions,
            pdfPath: `/uploads/${req.file.filename}`
        });

        await prescription.save();

        res.status(201).json({ message: 'Prescription created successfully', prescription });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Prescriptions for User
export const getUserPrescriptions = async (req, res) => {
    try {
        const prescriptions = await Prescription.find({ userId: req.user.id })
            .populate('doctorId', 'name specialization')
            .sort({ createdAt: -1 });

        res.status(200).json({ prescriptions });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Prescriptions for Doctor
export const getDoctorPrescriptions = async (req, res) => {
    try {
        const prescriptions = await Prescription.find({ doctorId: req.doctor.id })
            .populate('userId', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({ prescriptions });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Download Prescription PDF
export const downloadPrescription = async (req, res) => {
    try {
        const { id } = req.params;
        const prescription = await Prescription.findById(id);

        if (!prescription) {
            return res.status(404).json({ message: 'Prescription not found in DB' });
        }

        // আপনার ডাটাবেজে যদি '/uploads/filename.pdf' সেভ থাকে
        // তবে cleanPath হবে 'uploads/filename.pdf'
        const cleanPath = prescription.pdfPath.startsWith('/') 
            ? prescription.pdfPath.substring(1) 
            : prescription.pdfPath;

        // আপনার প্রজেক্টের রুট থেকে ফুল পাথ তৈরি করা
        const filePath = path.join(process.cwd(), 'public', cleanPath);

        // --- এই অংশটুকু খুবই জরুরি (ডিব্যাগ করার জন্য) ---
        console.log("-----------------------------------");
        console.log("১. ডাটাবেজ পাথ:", prescription.pdfPath);
        console.log("২. আপনার পিসিতে ফাইলটি যে পাথে খোঁজা হচ্ছে:", filePath);
        console.log("৩. ফাইলটি কি ওইখানে আছে?:", fs.existsSync(filePath));
        console.log("-----------------------------------");

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ 
                message: 'Physical file not found', 
                debugPath: filePath 
            });
        }

        res.download(filePath);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
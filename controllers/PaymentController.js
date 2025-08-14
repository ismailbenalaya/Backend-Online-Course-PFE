const Condidat = require('../models/Condidat')
const Formation = require('../models/Formation')
const Payment = require ('../models/Payment')


module.exports.addPayment = async (req, res) => {
    try {
        const { condidatId, formationId } = req.params;
        const { tranche } = req.body;

        // Find the existing payment for the given condidat and formation
        let payment = await Payment.findOne({
            condidat: condidatId,
            formation: formationId
        });

        // Get the training details
        const training = await Formation.findById(formationId);

        // If the payment exists, update it
        if (payment) {
            payment.tranches.push(tranche);
            payment.totalAmount += tranche.montant_tranches;
            payment.montant_restant = training.prix - payment.totalAmount;
        } else { // If the payment doesn't exist, create a new one
            payment = new Payment({
                condidat: condidatId,
                formation: formationId,
                tranches: [tranche],
                totalAmount: tranche.montant_tranches,
                montant_restant: training.prix - tranche.montant_tranches
            });
        }

        // Check if payment is completed
        if (payment.totalAmount === training.prix && payment.montant_restant === 0) {
            payment.status = "completed";
        }

        // Save the payment
        await payment.save();

        res.json({ success: true, message: "Payment Updated" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

module.exports.getByIdApprenant = async (req, res) => {
    try {
        const { condidatId } = req.params;
        // Ensure to await the findOne() method to get the result
        const payment = await Payment.find({ condidat: condidatId });
        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }
        res.json(payment); // Send the payment object as JSON response
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server Error" });
    }
}

module.exports.getAllPayment = async (req, res) => {
    try {        
        const payments = await Payment.find().populate('condidat').populate('formation')
        res.json(payments);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

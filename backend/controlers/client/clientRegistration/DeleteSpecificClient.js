 const ClientModel = require("../../../Model/clientRegistrationModel");
// delete specific client
const DeleteSpecificClient = async (req, res) => {
    try {       
        let id = req.params.id;
        let userId = req.user._id;
  
        let ExistClient = await ClientModel.findById(id);
        if (!ExistClient) {
            return res.status(404).json({message: 'Client not found'});
        }
console.log(ExistClient);
        // Check ownership
        if (ExistClient.userId.toString() !== userId.toString() && req.user.role!=='ADMIN') {
            return res.status(403).json({message: 'Unauthorized access'});
        }
         
        const result = await ClientModel.findByIdAndDelete(id);
 
        res.json({
            message: 'Client deleted successfully', 
            status: 200, 
            data: result, 
            success: true, 
            error: false
        });

    } catch (e) {
        res.json({
            message: 'Something went wrong', 
            status: 500, 
            data: e.message, 
            success: false, 
            error: true
        });
    }
};

module.exports = { DeleteSpecificClient };

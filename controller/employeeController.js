const Users = require("../modal/register")


const getAllEmployees = async (req, res) => {
    try {
        const { employeeId } = req.params;
        console.log('Request params:', req.params);
        const employee = await Users.find({ _id: { $ne: employeeId } });
        if (employee)
            return res.json({ data: employee, statusCode: "200" })
        else
            return res.json({ data: "No employee found", statusCode: "404" })
    } catch (error) {
        return res.json({ data: `Server Error => ${error}`, statusCode: "500" })
    }
}

const updateEmployee = async (req, res) => {
    try {
        const { updatedInfo } = req.body;
        const updatedEmployee = await Users.findOneAndUpdate(
            { _id: updatedInfo._id },
            { $set: updatedInfo },
            { new: true, runValidators: true }
        );

        if (!!updatedEmployee)
            return res.json({ data: "Updated employee", statusCode: "200" });
        else
            return res.json({ data: "Not Updated", statusCode: "400" });
    } catch (error) {
        return res.json({ data: `Server Error => ${error}`, statusCode: "500" });
    }
}

const deleteEmployee = async (req, res) => {
    const { employeeId } = req.params;
    console.log(employeeId)
    try {
        const deletedEmployee = await Users.findOneAndDelete({ _id: employeeId });
        return res.json({ data: "Employee deleted successfully", statusCode: "200" });

    } catch (error) {
        return res.status(500).json({ data: `Server Error Emloyee not deleted => ${error}`, statusCode: "500" });
    }
}




module.exports = {
    getAllEmployees,
    updateEmployee,
    deleteEmployee
}
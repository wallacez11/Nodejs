
const { MongoClient, ObjectId } = require('mongodb');

const getAllEmployees = async (req, res) => {
    const employees = await Employee.find()
    if(!employees) return res.status(204).json({'message':'No employees found'})
    res.json(employees)
}

const Employee = require('./../model/Employee')

const createNewEmployee = async (req, res) => {

    if(!req?.body?.firstname || !req?.body?.lastname ){
        return res.status(400).json({'message': 'First and last names are required'})
    }

    const newEmployee = {
        firstname: req.body.firstname,
        lastname: req.body.lastname
    }

    
    try{
     
        result = await Employee.create(newEmployee)
        console.log(result)
        res.status(201).json(result)
    }catch(err){
        res.status(500).json({'message': err.message})
    }


}

const updateEmployee = async (req, res) =>{
    if(!req?.body?.id){
        return res.status(400).json({'message': 'id is required'})
    }
   
    if (!req.body?.firstname || !req.body?.lastname) {
        return res.status(400).json({ message: 'Both firstname and lastname are required for the update' });
    }


    try {
        const employee = await Employee.findOne({ _id: new ObjectId(req.body.id) }).exec()

        if(!employee){
            return res.status(204).json({ "message'" : `Employee id ${req.body.id} not found`})
        }
    
        employee.firstname = req.body.firstname ;
        employee.lastname = req.body.lastname;
       
        result = await employee.save()
        console.log(result)
        res.json(employee)
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

const deleteEmployee = async (req, res) => {
    if(!req?.body?.id){
        return res.status(400).json({'message': 'id is required'})
    }
    try {
        const employee = await Employee.findOne({ _id: new ObjectId(req.body.id) }).exec()

        if(!employee){
            return res.status(204).json({ "message'" : `Employee id ${req.body.id} not found`})
        }
        const result = await Employee.deleteOne({ _id: new ObjectId(req.body.id)})
        res.json(result)

    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });

    }
}

const getEmployee = async (req, res) =>{
    employee = await Employee.findOne({ _id: new ObjectId(req.params.id) }).exec()
    if(!employee){
        return res.status(400).json({ "message'" : `Employee id ${req.params.id} not found`})
    }
    res.json(employee)
}

module.exports = {
    getAllEmployees,
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee,
}
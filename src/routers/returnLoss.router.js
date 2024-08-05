const { Router } = require("express");
const { GetAllReturnLoss, GetOneReturnLoss, CreateNewReturnLoss, DeleteOneReturnLoss } = require("../controllers/returnLoss.controller");

const router = Router();

router
    .get('/', GetAllReturnLoss)
    .get('/:id', GetOneReturnLoss)
    .post('/', CreateNewReturnLoss)
    

module.exports = router;

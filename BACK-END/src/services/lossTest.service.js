const testLossRepository = require('../repositories/lossTest.repository');


const getOneReturnLoss = async (id) => {
    try {
        return await testLossRepository.findReturnLossById(id);
    } catch (error) {
        throw error;
    }
}

module.exports={
    getOneReturnLoss
} 
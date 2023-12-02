module.exports = container => {
    const logger = container.resolve('logger')
    const ObjectId = container.resolve('ObjectId')
    const {
        schemaValidator,
        schemas: {
            User, Friend
        }
    } = container.resolve('models')
    const {httpCode, serverHelper} = container.resolve('config')
    const {userRepo} = container.resolve('repo')
    const getListUserByIdsSDP = async (req, res) => {
        try {
            let {ids} = req.query
            if (ids) {
                // check id.length === 24 here
                if (ids.constructor === String) ids = ids.split(',')
                let ok = false
                ids.forEach(id => {
                    if (id.length !== 24) {
                        ok = true
                    }
                })
                if (ok) {
                    return res.status(httpCode.BAD_REQUEST).json({msg: 'Danh sách người dùng không hợp lệ!'})
                }
                ids = ids.map(id => new ObjectId(id))
                const users = await userRepo.getUserNoPaging({customerId: {$in: ids}})
                return res.status(httpCode.SUCCESS).json(users)
            }
            return res.status(httpCode.SUCCESS).send([])
        } catch (e) {
            logger.e(e)
            res.status(httpCode.UNKNOWN_ERROR).json({})
        }
    }

    return {
        getListUserByIdsSDP
    }
}

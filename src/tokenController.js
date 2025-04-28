const service = require('./tokenService')

exports.mintTokenHandler = async (req, res) => {
  const { transactionId } = req.body

  if (!transactionId) {
    return res.status(400).json({error: 'missing required field. (transactionId)'})
  }
  const srv = await service.MintToken(transactionId)
  if (srv.error) {
    return res.status(srv.code).json({error: srv.error})
  }

  return res.status(201).json(srv)
}

exports.debug = async (req, res) => {
  const srv = await service.Debug()
  if (srv.error){
    return res.status(srv.code).json({error: srv.error})
  }
  return res.status(200).json(srv)
}

exports.merge = async(req, res) => {
  const srv = await service.Merge()
  if (srv.error) {
    return res.status(srv.code).json({error: srv.error})
  }
  return res.status(201).json(srv)
}

exports.transfer = async(req, res) => {
  const { address, userId, amount } = req.body
  if (!address || !userId || !amount) {
    return res.status(400).json({ error: 'missing required field. (address, userId, amount)'})
  }
  const srv = await service.Transfer(address, userId, amount)
  if (srv.error) {
    return res.status(srv.code).json({error: srv.error})
  }
  return res.status(200).json(srv)
}

exports.getTokenAmount = async(req, res) => {
  const { userId } = req.params
  const srv = await service.GetTokenAmount(userId)
  if (srv.error) {
    return res.status(srv.code).json({error:srv.error})
  }
  return res.status(200).json(srv)
}

exports.getRedeemBonuses = async(req, res) => {
  const { operatorId } = req.query
  if(!operatorId) {
    return res.status(400).json({error: 'missing required query param. (?operatorId=undefined)'})
  }
  const srv = await service.GetRedeemBonuses(operatorId)
  if (srv.error) {
    return res.status(srv.code).json({error: srv.error})
  }
  return res.status(200).json(srv)
}


exports.redeemToBonus = async(req, res) => {
  const { userId, bonusId, phone } = req.body
  if (!userId || !bonusId || !phone) {
    return res.status(400).json({error: 'missing required field. (userId, bonusId, phone)'})
  }
  const srv = await service.RedeemTokenToBonus(userId, bonusId, phone)
  if (srv.error) {
    return res.status(srv.code).json({error: srv.error})
  }
  return res.status(200).json(srv)
}
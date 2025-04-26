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
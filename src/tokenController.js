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
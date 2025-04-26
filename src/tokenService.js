const db = require('./config/db')
const { createNewToken, calcReward, getDebugInfo, mergeFLXA } = require('./utils/token')

const MintToken = async (transactionId) => {
  try {
    const queryResult = await db.query(`
      SELECT tb.token_balance_id as "tokenBalanceId",
        t.transaction_amount as "txAmount",
        t.transaction_type as "txType"
      FROM "Transaction" t
      JOIN "Token_balance" tb ON tb.user_id = t.user_id
      where t.transaction_id = $1
      `, [transactionId])
    if (queryResult.rowCount === 0) {
      return { code: 404, error: 'invalid transaction. id not exists' }
    }
    // simulate token creation
    const txData = queryResult.rows[0]
    const reward = calcReward(txData.txAmount)
    const contractResult = await createNewToken(reward)
    if (contractResult.error){
      return { code: 500, error: contractResult.error }
    }
    const {digest, timestampMs} = contractResult
    const mintResult = await db.query(`SELECT earn_token($1, $2, $3, $4)
      `, [txData.tokenBalanceId, reward, digest, new Date(Number(timestampMs)).toISOString()])
    return { data: { transactionId: mintResult.rows[0].earn_token }}
  } catch (err) {
    console.error(err)
    return { code: 500, error: 'failed to mint token' }
  }
}

const Debug = async () => {
  try {
    const data = getDebugInfo()
    if (data.error) {
      return { code: 500, error: data.error}
    }
    return data
  } catch (err) {
    console.error(err)
    return { code: 500, error: 'failed to retrieve data'}
  }
}

const Merge = async () => {
  try {
    const data = mergeFLXA()
    if (data.error) {
      return { code: 500, error: data.error}
    }
    return data
  } catch (err) {
    console.error(err)
    return {code:500, error:'failed to merge'}
  }
}

module.exports = {
  MintToken,
  Debug,
  Merge
}
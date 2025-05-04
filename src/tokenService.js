const { token } = require('morgan')
const db = require('./config/db')
const { createNewToken, calcReward, getDebugInfo, mergeFLXA, transferToken, burnToken } = require('./utils/token')

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
    if (mintResult.rowCount === 0) {
      return { code: 500, error: 'failed to mint token' }
    }
      console.log({'data': mintResult})
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

const Transfer = async (address, userId, transferedAmount) => {
  if (transferedAmount < 50) {
    return { code: 400, error: 'minimum transfer is 50 FLXA' }
  }
  try{
    const queryResult = await db.query(`
      SELECT token_balance_id as "tokenBalanceId", token_balance_amount as "tokenBalanceAmount" FROM "Token_balance" WHERE user_id  = $1
      `, [userId])
    if (queryResult.rowCount === 0) {
      return { code: 404, error: 'invalid id. user not exists' }
    }
    const {tokenBalanceId, tokenBalanceAmount} = queryResult.rows[0]
    if (tokenBalanceAmount < transferedAmount) {
      return { code: 400, error: 'insufficient balance' }
    }
    const txRes = await transferToken(address, transferedAmount)
    if (txRes.error) {
      return { code: 500, error: txRes.error }
    }
    const { digest, timestampMs } = txRes
    const transferResult = await db.query(`SELECT transfer_token($1, $2, $3, $4)`,
      [tokenBalanceId, transferedAmount, digest, new Date(Number(timestampMs)).toISOString()]
    )
    return { data: { transactionId: transferResult.rows[0].transfer_token } }
  } catch (err) {
    console.error(err)
    return {code:500, error:'failed to merge'}
  }
}


const GetTokenAmount = async (userId) => {
  try {
    const qResult = await db.query(`SELECT token_balance_id as "tokenBalanceId", token_balance_amount as amount
      FROM "Token_balance" WHERE user_id = $1`, [userId])
    if (qResult.rowCount === 0) {
      return {code: 404, error:'invalid id. user not exists'}
    }
    const {tokenBalanceId, amount} = qResult.rows[0]
    return { data: {
      tokenBalanceId, amount
    }}
  } catch (err) {
    console.error(err)
    return {code: 500, error:'failed to get token amount'}
  }
}


const GetRedeemBonuses = async(operatorId) => {
  try {
    const qResult = await db.query(`SELECT
      bonus_id, o.operator_id, operator_name, type, title, description, token_price, valid_until FROM "Bonus" b
      JOIN "Operator" o ON o.operator_id=b.operator_id
      WHERE b.operator_id = $1`, [operatorId])
    const data = qResult.rows.map((row) => ({
      id: row.bonus_id,
      operatorId: row.operator_id,
      operatorName: row.operator_name,
      type: row.type,
      title: row.title,
      description: row.description,
      price: row.token_price,
      validTo: new Date(row.valid_until).toISOString(),
    }))
    return {data}
  } catch (err) {
    console.error(err)
    return {code: 500, error: 'failed to retrieve bonuses'}
  }
}


const RedeemTokenToBonus = async (userId, bonusId, targetPhone) => {
  try {
    const qResult = await db.query(`SELECT token_balance_id as "tokenBalanceId", token_balance_amount as amount
      FROM "Token_balance" WHERE user_id = $1`, [userId])
    if (qResult.rowCount === 0) {
      return {code: 404, error:'invalid id. user not exists'}
    }
    const {tokenBalanceId, amount} = qResult.rows[0]
    const bonusResult = await db.query(`SELECT token_price as "tokenPrice" FROM "Bonus" WHERE bonus_id = $1`, [bonusId])
    if (bonusResult.rowCount === 0) {
      return {code: 404, error:'invalid id. bonus not exists'}
    }
    const {tokenPrice} = bonusResult.rows[0]
    if (amount < tokenPrice) {
      return {code: 400, error:'insufficient balance'}
    }
    const burnResult = await burnToken(tokenPrice)
    if (burnResult.error) {
      return {code: 500, error: burnResult.error}
    }
    const {digest, timestampMs} = burnResult
    const redeemResult = await db.query(`SELECT redeem_token($1, $2, $3, $4, $5)`,
      [tokenBalanceId, digest, targetPhone, bonusId, new Date(Number(timestampMs)).toISOString()]
    )
    const dataString = redeemResult.rows[0].redeem_token
    const [tokenTransactionId, tokenRedeemId] = dataString.replace(/[()]/g, "").split(",").map(Number);
    return { data: {tokenTransactionId, tokenRedeemId} }
  } catch (err) {
    console.error(err)
    return {code: 500, error:'failed to redeem token'}
  }
}

module.exports = {
  MintToken,
  Debug,
  Merge,
  Transfer,
  GetTokenAmount,
  GetRedeemBonuses,
  RedeemTokenToBonus,
}
const { client, setGasPayment } = require('../config/tangle')
const { Transaction } = require('@iota/iota-sdk/transactions');
const { Ed25519Keypair } = require('@iota/iota-sdk/keypairs/ed25519');

const calcReward = (txAmount) => txAmount * .008
const createNewToken = async (amount) => {
  try {
    const tx = new Transaction()
    tx.moveCall({
      package: process.env.FLXA_PACKAGE_ID,
      module: "flxa",
      function: "earn_flxa",
      arguments: [
        tx.object(process.env.FLXA_TREASURY_CAP),
        tx.pure.u64(Math.floor(amount) * 1000),
        tx.pure.address(process.env.FLXA_ID_ADDRESS),
      ]
    })
    const payment = await setGasPayment()
    tx.setGasPayment([{
      objectId: payment.coinObjectId,
      digest: payment.digest,
      version: payment.version,
    }])
    tx.setGasBudget(10000000)
    const mnemonic = process.env.FLXA_SECRET
    const keypair = Ed25519Keypair.deriveKeypair(mnemonic)
    const excRes = await client.signAndExecuteTransaction({
      signer: keypair,
      transaction: tx,
    })
    const res = await client.waitForTransaction({ digest: excRes.digest })
    console.log("transaction result:", res)
    mergeFLXA()
    return res
  } catch (err) {
    console.error(err)
    return { error: "failed to create transaction" }
  }
}

const mergeFLXA = async () => {
  try {
    const c = await client.getCoins({
      owner: process.env.FLXA_ID_ADDRESS,
      coinType: process.env.FLXA_COIN_TYPE
    })
    const coins = c.data.filter((coin) => coin.coinObjectId !== process.env.FLXA_ORIGIN).map((coin) => coin.coinObjectId)
    const tx = new Transaction()
    tx.mergeCoins(process.env.FLXA_ORIGIN, coins)
    const payment = await setGasPayment()
    tx.setGasPayment([{
      objectId: payment.coinObjectId,
      digest: payment.digest,
      version: payment.version,
    }])
    tx.setGasBudget(10000000)
    const mnemonic = process.env.FLXA_SECRET
    const keypair = Ed25519Keypair.deriveKeypair(mnemonic)
    const excRes = await client.signAndExecuteTransaction({
      signer: keypair,
      transaction: tx,
    })
    const res = await client.waitForTransaction({ digest: excRes.digest })
    console.log("merge transaction result:", res)
    return res
  } catch (err) {
    console.error(err)
    return {error: "failed to merge"}
  }
}

const getDebugInfo = async () => {
  try {
    const coins = await client.getCoins({
      owner: process.env.FLXA_ID_ADDRESS,
      coinType: process.env.FLXA_COIN_TYPE
    })

    return coins
  } catch (err) {
    console.error(err)
    return { error: "failed to get debug info"}
  }
}

const transferToken = async (address, amount) => {
  try {
    const tx = new Transaction()
    tx.moveCall({
      package: process.env.FLXA_PACKAGE_ID,
      module: "flxa",
      function: "transfer_flxa",
      arguments: [
        tx.object(process.env.FLXA_ORIGIN),
        tx.pure.address(address),
        tx.pure.u64(amount * 1000),
      ]
    })
    const payment = await setGasPayment()
    tx.setGasPayment([{
      objectId: payment.coinObjectId,
      digest: payment.digest,
      version: payment.version,
    }])
    tx.setGasBudget(10000000)
    const mnemonic = process.env.FLXA_SECRET
    const keypair = Ed25519Keypair.deriveKeypair(mnemonic)
    const excRes = await client.signAndExecuteTransaction({
      signer: keypair,
      transaction: tx,
    })
    const res = await client.waitForTransaction({ digest: excRes.digest })
    console.log("transaction result:", res)
    return res
  } catch (err) {
    console.error(err)
    return { error: "failed to transfer" }
  }
}

module.exports = {
  createNewToken,
  calcReward,
  getDebugInfo,
  mergeFLXA,
  transferToken,
}
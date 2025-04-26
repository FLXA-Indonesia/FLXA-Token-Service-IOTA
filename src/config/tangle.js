const { getFullnodeUrl, IotaClient } = require('@iota/iota-sdk/client');

const MY_ADDRESS = process.env.FLXA_ID_ADDRESS
const iotaClient = new IotaClient({ url: getFullnodeUrl('testnet') })

const setGasPayment = () => {
  return new Promise(async(resolve, reject) => {
    const { data } = await iotaClient.getCoins({
      owner: MY_ADDRESS
    })
    resolve(data[0])
  })
}

module.exports = {
  client: iotaClient,
  addr: MY_ADDRESS,
  setGasPayment
}
const express = require("express")
const Moralis = require("moralis").default
const { EvmChain } = require("@moralisweb3/evm-utils")

const app = express()
const port = 3000

const MORALIS_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjY5MDMwMmNjLTFhOTAtNDdhMy04ZmI2LTNiNGEyNWU2MzEzNyIsIm9yZ0lkIjoiMzY4NjUwIiwidXNlcklkIjoiMzc4ODc4IiwidHlwZUlkIjoiOWM3M2ZiYTQtMWVjOS00N2ZmLWE1YmYtYTUwYTQwMThhY2Y4IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MDI4ODIyNjQsImV4cCI6NDg1ODY0MjI2NH0.w39HmZ1RkEgIJm0UAhHy5sVzIyHlvCG4aSA6TPj190g"
const address = "0x9e8f0f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f8f"
const chain = EvmChain.ETHEREUM

async function getDemoData() {
  // Get native balance
  const nativeBalance = await Moralis.EvmApi.balance.getNativeBalance({
    address,
    chain,
  })

  // Format the native balance formatted in ether via the .ether getter
  const native = nativeBalance.result.balance.ether

  // Get token balances
  const tokenBalances = await Moralis.EvmApi.token.getWalletTokenBalances({
    address,
    chain,
  })

  // Format the balances to a readable output with the .display() method
  const tokens = tokenBalances.result.map((token) => token.display())

  // Get the nfts
  const nftsBalances = await Moralis.EvmApi.nft.getWalletNFTs({
    address,
    chain,
    limit: 10,
  })

  // Format the output to return name, amount and metadata
  const nfts = nftsBalances.result.map((nft) => ({
    name: nft.result.name,
    amount: nft.result.amount,
    metadata: nft.result.metadata,
  }))

  return { native, tokens, nfts }
}

app.get("/demo", async (req, res) => {
  try {

    // Get and return the crypto data
    const data = await getDemoData()
    res.status(200)
    res.json(data)
  } catch (error) {
    // Handle errors
    console.error(error)
    res.status(500)
    res.json({ error: error.message })
  }
})

const startServer = async () => {
  await Moralis.start({
    apiKey: MORALIS_API_KEY,
  })

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}

startServer()
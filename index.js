import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constant.js"

const fundButton = document.getElementById("fundButton")
const connectButton = document.getElementById("connectButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")
connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        window.ethereum.request({ method: "eth_requestAccounts" })
        connectButton.innerHTML = "Connected!"
    } else {
        connectButton.innerHTML = "Please install metamask"
    }
}

async function getBalance() {
    if (typeof window.ethereum != "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}

async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`funding with ${ethAmount}...`)
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })
            await listenForTransctionMine(transactionResponse, provider) // ABI AND ADDRESS
            console.log("Done!")
        } catch (error) {
            console.log(error)
        }
    }
}

function listenForTransctionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}..`)
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(
                `Completed with ${transactionReceipt.confirmations} confirmations`,
            )
            resolve()
        })
    })

    //provider //connection

    //fund fuction

    // withdraw
}

async function withdraw() {
    if (typeof window.ethereum != "undefined") {
        console.log("withdrawing")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponse = await contract.withdraw()
            await listenForTransctionMine(transactionResponse, provider)
        } catch (error) {
            console.log(error)
        }
    }
}

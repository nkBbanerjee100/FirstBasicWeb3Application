import { ethers } from "../ethers-5.6.esm.min.js"
import { abi, addressOfContract } from "../constants.js"
// import "../hardhat.config.js"
const connectButton = document.getElementById("connectButton")
const fund1 = document.getElementById("fund1")
const balanceButton = document.getElementById("getBalanceButton")
const withdrawButton = document.getElementById("withdrawButton")
connectButton.onclick = connectionForMetaMask
fund1.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw
console.log("Funding...");
console.log(ethers);
// to stop auto-connecting wrap this code inside a func
async function connectionForMetaMask() {
    console.log("test1");
    try {
        if (typeof window.ethereum !== "undefined") {
            await window.ethereum.request({ method: "eth_requestAccounts" })
            connectButton.innerHTML = "You're connected to MetaMask Account"
            console.log("MetaMask Connected...");
        }
        else {
            connectButton.innerHTML = "not connected to MetaMask Account"
        }
    }
    catch (error) {
        console.log(`error is ${error}`);
        console.log(error.printStackTrace());
    }
}
async function withdraw() {
    if (typeof window.ethereum !== "undefined") {
        console.log("withdrawing initiated");
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signers = provider.getSigner()
        const contract = new ethers.Contract(addressOfContract, abi, signers)
        console.log("before withdraw try");
        try {
            console.log("inside withdraw try");
            const transactionResponse = await contract.withdraw()
            console.log("before func calling");
            await transactionListeningMine(transactionResponse, provider)
            console.log("after func calling");
        } catch (error) {
            console.log("inside catch");
            console.log(error);
        }
    }
}
async function getBalance() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(addressOfContract)
        console.log(ethers.utils.formatEther(balance));
    }
}
async function fund() {
    const ethAmount = document.getElementById("ethAmmount").value
    console.log(`funding with ${ethAmount}`);
    if (typeof window.ethereum !== "undefined") {
        console.log("entering into fund() if block");
        // provider / connection to the blockchain
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        // signer / wallet / gas
        const signers = provider.getSigner() // returns the current account
        // console.log(signers);
        // ABI & Address
        const contract = new ethers.Contract(addressOfContract, abi, signers)
        // Contract
        console.log("before try");
        try {
            console.log("inside try");
            const transactionResponse = await contract.fund({ value: ethers.utils.parseEther(ethAmount) })
            await transactionListeningMine(transactionResponse, provider)
            console.log("func calling done!!!!!!!!!!");
        } catch (error) {
            console.log("inside catch block");
            console.log(error);
        }
    }
}
function transactionListeningMine(transactionResponse, provider) {
    console.log("hellow from listener func");
    console.log(`listening with ${transactionResponse.hash}...`);
    // const Promise = new Promise(() => { })
    // listen for transactions
    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (getTransactionReceipt) => {
            console.log(`transaction done with ${getTransactionReceipt.confirmations} confirmations`);
            resolve() // only finish this func once transactionResponse.hash is found
        })
    })

}

import {
    lamports, airdropFactory,
    createSolanaRpc,createSolanaRpcSubscriptions,
    generateKeyPairSigner,
    createTransactionMessage,
    setTransactionMessageFeePayerSigner,
    appendTransactionMessageInstructions,
    pipe,
    signTransactionMessageWithSigners,
    sendAndConfirmTransactionFactory,
    getSignatureFromTransaction,
    setTransactionMessageLifetimeUsingBlockhash
} from "@solana/kit";
import { getMintSize, TOKEN_2022_PROGRAM_ADDRESS,getInitializeMintInstruction,fetchMint} from "@solana-program/token-2022";
import { getCreateAccountInstruction } from "@solana-program/system";



const rpc= createSolanaRpc("http://127.0.0.1:8899");
const rpcSubscriptions = createSolanaRpcSubscriptions("ws://127.0.0.1:8900");

let payAccount=await generateKeyPairSigner();
await airdropFactory({rpc,rpcSubscriptions})
    ({
        recipientAddress:payAccount.address,
         lamports: lamports(5_000_000_000n),
         commitment: "confirmed"
    });

const payAccountInfo= await rpc.getAccountInfo(payAccount.address).send();
console.log("Pay Account balance:",payAccountInfo.value.lamports);

const mintKeyPair= await generateKeyPairSigner();

// 获取最低租金豁免金额(根据mint账户的最小大小)
const miniRentExemption = await rpc.getMinimumBalanceForRentExemption(BigInt(getMintSize())).send();

const space = BigInt(getMintSize());
// token_2022标准的mint账户创建指令
const token2022Instructions =  getCreateAccountInstruction({
    payer: payAccount.address,  
    newAccount: mintKeyPair.address,
    lamports: miniRentExemption,
    space,
    programAddress: TOKEN_2022_PROGRAM_ADDRESS,
});

// 初始化mint账户指令
// 设置小数位数为9，设置mint权限为payAccount
const initMintInstruction = getInitializeMintInstruction({
    mint: mintKeyPair.address,
    decimals: 9,
    mintAuthority: payAccount.address
})

const lastestBlockhashResp = await rpc.getLatestBlockhash().send();
console.log("Latest Blockhash:", lastestBlockhashResp.value.blockhash);
const transactionMessage=pipe(
    createTransactionMessage({version:0,}),
    (tx)=> setTransactionMessageFeePayerSigner(payAccount, tx),
    (tx) => setTransactionMessageLifetimeUsingBlockhash(lastestBlockhashResp.value, tx),
    (tx) => appendTransactionMessageInstructions([token2022Instructions,initMintInstruction], tx),
);
const signedTransaction= await signTransactionMessageWithSigners(transactionMessage);
console.log("Signed Transaction:", signedTransaction);
await sendAndConfirmTransactionFactory({rpc,rpcSubscriptions})(signedTransaction,{commitment:"confirmed"})
console.log("Transaction confirmed");
const transactionSignature=getSignatureFromTransaction(signedTransaction);

console.log("Mint Address:", mintKeyPair.address);
console.log("Transaction Signature:", transactionSignature);

const accountInfo = await rpc.getAccountInfo(mintKeyPair.address).send();
console.log(accountInfo);

const mintAccount = await fetchMint(rpc, mintKeyPair.address);
console.log(mintAccount);

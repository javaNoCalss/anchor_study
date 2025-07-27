import { airdropFactory, createSolanaRpc, createSolanaRpcSubscriptions, generateKeyPairSigner,lamports } from "@solana/kit";


// 直接通过deno run -A执行,不能通过anchor test执行
const rpc=createSolanaRpc("http://127.0.0.1:8899");
const rpcSubscriptions = createSolanaRpcSubscriptions("ws://127.0.0.1:8900");

const keypair = await generateKeyPairSigner();
console.log("Keypair:", keypair.address);

const signature = await airdropFactory({rpc, rpcSubscriptions})({
    recipientAddress: keypair.address,
    lamports: lamports(1_000_000_000n), // 5 SOL
    commitment: "confirmed",
    });
console.log("Airdrop Signature:", signature);

const account= await rpc.getAccountInfo( keypair.address).send();
console.log(account);

import {Address, createSolanaRpc,createSolanaRpcSubscriptions} from "@solana/kit";
import {fetchSysvarClock, SYSVAR_CLOCK_ADDRESS} from "@solana/sysvars";

const rpc=createSolanaRpc("http://127.0.0.1:8899");
const rpcSubscriptions = createSolanaRpcSubscriptions("ws://127.0.0.1:8900");

// const sysAddress=await rpc.getAccountInfo(SYSVAR_CLOCK_ADDRESS,{encoding:"base64"}).send();
// console.log("Sysvar Clock Account:",sysAddress);

// const clock=await fetchSysvarClock(rpc);
// console.log("Sysvar Clock:",clock);

let programId = "DjmjAtZ7HwWsSBBEpCfPrpVJESuRkFP3jtxs8MzN4JuA" as Address;
let programAccount= await rpc.getAccountInfo(programId,{encoding:"base64"}).send();
console.log("Program Account:",programAccount);

programId="JDxC7EGzh9ETrW9bKuicQnx9Be2XpPd1WDeg1jND3KNG" as Address;
programAccount= await rpc.getAccountInfo(programId,{encoding:"base64"}).send();
console.log("Program Account:",programAccount);

programId="BrAZJ6b38nDDD7QPfWvD57CbyNiboDGu9Btjqdm2PbXQ" as Address;
programAccount= await rpc.getAccountInfo(programId,{encoding:"base64"}).send();
console.log("Program Account:",programAccount);

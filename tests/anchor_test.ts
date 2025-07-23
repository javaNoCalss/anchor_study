import { AnchorProvider, setProvider, web3, workspace } from "@coral-xyz/anchor";
import { BN } from "bn.js";
import { SystemProgram } from "@solana/web3.js";
import { assert } from "chai";
// import { AnchorTest } from "../target/types/anchor_test";   

describe("anchor_test", () => {

    const provider= AnchorProvider.env();
    setProvider(provider);

    const program= workspace.anchor_test;

    it("innitializes", async () => {
        const newAccountKp= new web3.Keypair();

        const data=new BN(42);
        const txHash= await program.methods
        .initialize(data)
        .accounts({
            newAccount: newAccountKp.publicKey,
            signer: provider.publicKey,
            SystemProgram: SystemProgram.programId
        })
        .signers([newAccountKp])
        .rpc();

        console.log("Your transaction signature", txHash);

        const account= await program.account.newAccount.fetch(newAccountKp.publicKey);
        console.log("Account data:", account.data.toString());
        assert.equal(account.data.toString(), data.toString(), "Data does not match");
    });
});

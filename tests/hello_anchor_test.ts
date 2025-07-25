import * as anchor from '@coral-xyz/anchor';
import { Program, web3, BN, } from '@coral-xyz/anchor';
import { HelloAnchor } from '../target/types/hello_anchor';
import { assert } from 'chai';

describe('hello_anchor', () => {
  // 使用~/.config/solana/id.json的钱包作为默认提供者
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.hello_anchor as Program<HelloAnchor>;
  const provider = anchor.getProvider();

  it('initialize', async () => {
    const newAccountKp = new web3.Keypair();

    const data = new BN(42);
    const txHash = await program.methods
      .initialize(data)
      .accounts({
        newAccount: newAccountKp.publicKey,
        signer: provider.publicKey,
      })
      .signers([newAccountKp])
      .rpc();

    console.log('Your transaction signature', txHash);

    await provider.connection.confirmTransaction(txHash);
    console.log('Transaction confirmed');

    const newAccount = await program.account.newAccount.fetch(
      newAccountKp.publicKey
    );
    console.log('Account data:', newAccount.data.toString());
    assert.equal(
      newAccount.data.toString(),
      data.toString(),
      'Data does not match'
    );
  });
});

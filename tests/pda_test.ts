import * as anchor from '@coral-xyz/anchor';
import { Pda } from '../target/types/pda';
import { PublicKey } from '@solana/web3.js';

describe('pda_test', () => {
  // 使用~/.config/solana/id.json的钱包作为默认提供者
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.pda as anchor.Program<Pda>;

  const [messagePda, messageBump] = PublicKey.findProgramAddressSync(
    [Buffer.from('message'), provider.publicKey.toBuffer()],
    program.programId
  );

  const [vaultPda, vaultBump] = PublicKey.findProgramAddressSync(
    [Buffer.from('vault'), provider.publicKey.toBuffer()],
    program.programId
  );

  it('Create Message pda account', async () => {
    const message = 'Hello, i am vash,this is a message stored in a PDA!';
    const tx = await program.methods
      .create(message)
      .accounts({
        messageAccount: messagePda,
      })
      .rpc({ commitment: 'confirmed' });

    const messageAccount = await program.account.messageAccount.fetch(
      messagePda,
      'confirmed'
    );
    console.log(
      'Message Account Data created:{} with transaction:{} ',
      messageAccount.message,
      tx
    );
  });

  it('Update Message pda account', async () => {
    const newMessage = 'wo shi qin shi huang ,da qian';
    const tx = await program.methods
      .update(newMessage)
      .accounts({
        messageAccount: messagePda,
        vaultAccount: vaultPda,
      })
      .rpc({ commitment: 'confirmed' });

    const messageAccount = await program.account.messageAccount.fetch(
      messagePda,
      'confirmed'
    );
    console.log(
      'Message Account Data update:{} with transaction:{} ',
      messageAccount.message,
      tx
    );
  });

  it('Delete Message pda account', async () => {
    const tx = await program.methods
      .delete()
      .accounts({
        messageAccount: messagePda,
        vaultAccount: vaultPda
      })
      .rpc({ commitment: 'confirmed' });

    console.log('Message Account Data deleted with transaction: {}', tx);
  });
});

import * as anchor from '@coral-xyz/anchor';
import { Pda } from '../target/types/pda';
import { PublicKey } from '@solana/web3.js';

describe('pda_test', () => {
  const program = anchor.workspace.pda as anchor.Program<Pda>;

  const provider = anchor.getProvider();
  ;

  const [messagePda,messageBump]=PublicKey.findProgramAddressSync(
    [Buffer.from('message'),provider.publicKey.toBuffer()],
    program.programId
  );

  it('Create Message pda account', async () => {
    const message = "Hello, i am vash,this is a message stored in a PDA!";
    program.methods
      .create(message)
      .accounts({
        user: provider.publicKey,
        messageAccount: messagePda,
        systemProgram: anchor.web3.SystemProgram.programId
      })
      .rpc({ commitment: 'confirmed' });

  });

  it('Update Message pda account', async () => {});

  it('Delete Message pda account', async () => {});
});

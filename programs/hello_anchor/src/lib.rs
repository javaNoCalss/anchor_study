 use anchor_lang::system_program as anchor_system_program;
 
 use anchor_lang::{prelude::*, system_program::{ Transfer}};

 declare_id!("BVGgNPWwAwjqfyWaa1bjKMJhMHqkXaAkVSbXjBdjjxXz");

#[program]
pub mod hello_anchor {
    use super::*;
    pub fn initialize(ctx: Context<Initialize>,data:u64) -> Result<()> {
        ctx.accounts.new_account.data = data;
        msg!("Hello, Anchor! initialize account data with {}", data);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {

    #[account(init, payer = signer, space = 8 + 8)]
    pub new_account: Account<'info, NewAccount>,

    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct NewAccount {
    pub data: u64,
}


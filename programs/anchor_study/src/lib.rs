 use anchor_lang::system_program as anchor_system_program;
 
 use anchor_lang::{prelude::*, system_program::{ Transfer}};

 declare_id!("BrAZJ6b38nDDD7QPfWvD57CbyNiboDGu9Btjqdm2PbXQ");


 #[program]
pub mod pda{
    use super::*;

    pub fn create(ctx: Context<Create>, message: String) -> Result<()> {
        msg!("Creating message account with message:{}", message);
        let account_data=&mut ctx.accounts.message_account;
        account_data.user=ctx.accounts.user.key();
        account_data.message= message;
        account_data.bump=ctx.bumps.message_account;
        Ok(())
    }

    pub fn update(ctx: Context<Update>, message: String) -> Result<()> {
        let account_data=&mut ctx.accounts.message_account;
        account_data.message= message;

        // 转账指令
        let transfer_instraction=Transfer{
            from: ctx.accounts.user.to_account_info(),
            to: ctx.accounts.value_account.to_account_info()
        };

        
        // 创建 CPI 上下文
        let cpi_context=CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            transfer_instraction,
        );

        // 调用转账函数
        anchor_system_program::transfer(cpi_context, 1_000_000)?;

        Ok(())
    }

    pub fn delete(ctx: Context<Delete>) -> Result<()> {
        msg!("Deleting message account");

        let user_key=ctx.accounts.user.key();
        let signer_seeds:&[&[&[u8]]] =&[&[b"value",user_key.as_ref(),&[ctx.bumps.value_account]]];

        // 调用转账指令
        let transfer_instruction=Transfer {
            from: ctx.accounts.value_account.to_account_info(),
            to: ctx.accounts.user.to_account_info(),
        };

        // 创建 CPI 上下文
        let cpi_context=CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            transfer_instruction,
        ).with_signer(signer_seeds);

        // 执行转账
        anchor_system_program::transfer(cpi_context, ctx.accounts.value_account.lamports())?;

        Ok(())
    }
}


#[derive(Accounts)]
#[instruction(message: String)]
pub struct Create<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        init,
        payer = user,
        seeds = [b"message", user.key().as_ref()],
        bump,
        space = 8 + 32 + 4 + message.len() + 1, 
    )]
    pub message_account: Account<'info, MessageAccount>,
    pub system_program: Program<'info, System>,

}

#[derive(Accounts)]
#[instruction(message: String)]
pub struct Update<'info> {

    #[account(mut)]
    pub user:Signer<'info>,

    #[account(
        mut,
        seeds = [b"value", user.key().as_ref()],
        bump,)]
    pub value_account: SystemAccount<'info>,


    #[account(
        mut,
        seeds = [b"message", user.key().as_ref()],
        bump = message_account.bump,
        realloc = 8 + 32 + 4 + message.len() + 1,
        realloc::payer = user,
        realloc::zero = true,
    )]
    pub message_account: Account<'info, MessageAccount>,

    pub system_program: Program<'info, System>,

}



#[derive(Accounts)]
pub struct Delete<'info> {

    #[account(mut)]
    pub user: Signer<'info>,

    #[account(
        mut,
        seeds = [b"value", user.key().as_ref()],
        bump,
    )]
    pub value_account: SystemAccount<'info>,

    
    #[account(
        mut,
        seeds = [b"message", user.key().as_ref()],
        bump = message_account.bump,
        close = user,
    )]
    pub message_account: Account<'info, MessageAccount>,

    pub system_program: Program<'info, System>,
}


#[account]
pub struct MessageAccount {
    pub bump: u8,
    pub user: Pubkey,
    pub message: String,
}
  




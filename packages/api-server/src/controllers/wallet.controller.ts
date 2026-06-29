import { Controller, Get, Param, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { walletRepository, transactionRepository } from '@block-hash/database';
import { Chain } from '@block-hash/common';

@ApiTags('wallets')
@Controller('wallets')
export class WalletController {

  @Get(':address')
  @ApiOperation({ summary: 'Get wallet profile' })
  async getWallet(@Param('address') address: string) {
    const wallet = await walletRepository.getByAddress(address);
    if (!wallet) {
      throw new HttpException('Wallet not found', HttpStatus.NOT_FOUND);
    }
    return { success: true, data: wallet };
  }

  @Get(':address/transactions')
  @ApiOperation({ summary: 'Get recent transactions for a wallet on a specific chain' })
  @ApiQuery({ name: 'chain', enum: Chain })
  @ApiQuery({ name: 'page', required: false, type: Number })
  async getTransactions(
    @Param('address') address: string,
    @Query('chain') chain: Chain,
    @Query('page') page?: number
  ) {
    if (!chain) {
      throw new HttpException('Chain query parameter is required', HttpStatus.BAD_REQUEST);
    }
    const result = await transactionRepository.getByAddress(chain, address, { page: page || 1, limit: 20 });
    return { success: true, data: result };
  }

  @Get('type/whales')
  @ApiOperation({ summary: 'Get top whale wallets' })
  async getWhales() {
    const whales = await walletRepository.getWhales({ limit: 50 });
    return { success: true, data: whales };
  }
  
  @Get('search/:query')
  @ApiOperation({ summary: 'Search for wallets by address or label' })
  async searchWallets(@Param('query') query: string) {
    const results = await walletRepository.search(query);
    return { success: true, data: results };
  }
}

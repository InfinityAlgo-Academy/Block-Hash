import { Controller, Get, Param, Query, HttpException, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { Chain } from '@block-hash/common';
import { getHourlyVolume, getTopTokensByTransfers, getWhaleMovementSummary } from '@block-hash/database';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {

  @Get(':chain/volume')
  @ApiOperation({ summary: 'Get hourly transaction volume for a chain' })
  @ApiParam({ name: 'chain', enum: Chain })
  @ApiQuery({ name: 'hours', required: false, type: Number })
  async getVolume(@Param('chain') chain: Chain, @Query('hours') hours?: number) {
    try {
      const data = await getHourlyVolume(chain, hours || 24);
      return { success: true, data };
    } catch (error) {
      throw new HttpException('Failed to fetch volume data', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':chain/top-tokens')
  @ApiOperation({ summary: 'Get top tokens by transfer activity' })
  @ApiParam({ name: 'chain', enum: Chain })
  async getTopTokens(@Param('chain') chain: Chain) {
    try {
      const data = await getTopTokensByTransfers(chain, 20);
      return { success: true, data };
    } catch (error) {
      throw new HttpException('Failed to fetch token data', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':chain/whale-movements')
  @ApiOperation({ summary: 'Get whale movement summary' })
  @ApiParam({ name: 'chain', enum: Chain })
  async getWhales(@Param('chain') chain: Chain) {
    try {
      const data = await getWhaleMovementSummary(chain, 24);
      return { success: true, data };
    } catch (error) {
      throw new HttpException('Failed to fetch whale data', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

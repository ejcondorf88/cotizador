import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateAgenteUseCase } from '../../application/agentes/use-cases/create-agente.use-case';
import { GetAgentesUseCase } from '../../application/agentes/use-cases/get-agentes.use-case';
import { GetAgenteByIdUseCase } from '../../application/agentes/use-cases/get-agente-by-id.use-case';
import { SearchAgentesUseCase } from '../../application/agentes/use-cases/search-agentes.use-case';
import { UpdateAgenteUseCase } from '../../application/agentes/use-cases/update-agente.use-case';
import { DeleteAgenteUseCase } from '../../application/agentes/use-cases/delete-agente.use-case';
import { CreateAgenteDto } from '../../application/agentes/dto/create-agente.dto';
import { UpdateAgenteDto } from '../../application/agentes/dto/update-agente.dto';
import { PaginationDto } from '../../application/common/dto/pagination.dto';
import { SearchDto } from '../../application/common/dto/search.dto';
import { PaginatedAgenteResponseDto, AgenteResponseDto } from '../../application/agentes/dto/agente-response.dto';

@ApiTags('agentes')
@Controller('catalogos/agentes')
export class AgentesController {
  constructor(
    private readonly createAgenteUseCase: CreateAgenteUseCase,
    private readonly getAgentesUseCase: GetAgentesUseCase,
    private readonly getAgenteByIdUseCase: GetAgenteByIdUseCase,
    private readonly searchAgentesUseCase: SearchAgentesUseCase,
    private readonly updateAgenteUseCase: UpdateAgenteUseCase,
    private readonly deleteAgenteUseCase: DeleteAgenteUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener lista de agentes paginada' })
  @ApiResponse({ status: 200, description: 'Lista de agentes', type: PaginatedAgenteResponseDto })
  async findAll(@Query() pagination: PaginationDto): Promise<PaginatedAgenteResponseDto> {
    return this.getAgentesUseCase.execute(pagination);
  }

  @Get('buscar')
  @ApiOperation({ summary: 'Buscar agentes por nombre o código' })
  @ApiQuery({ name: 'q', description: 'Término de búsqueda', required: true })
  @ApiQuery({ name: 'page', description: 'Número de página', required: false })
  @ApiQuery({ name: 'limit', description: 'Elementos por página', required: false })
  @ApiResponse({ status: 200, description: 'Resultados de búsqueda', type: PaginatedAgenteResponseDto })
  async search(
    @Query('q') query: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<PaginatedAgenteResponseDto> {
    const searchDto = { q: query } as SearchDto;
    const paginationDto = { 
      page: page ? parseInt(page, 10) : 1, 
      limit: limit ? parseInt(limit, 10) : 20 
    } as PaginationDto;
    return this.searchAgentesUseCase.execute(searchDto, paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un agente por ID' })
  @ApiParam({ name: 'id', description: 'UUID del agente' })
  @ApiResponse({ status: 200, description: 'Agente encontrado', type: AgenteResponseDto })
  @ApiResponse({ status: 404, description: 'Agente no encontrado' })
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<AgenteResponseDto> {
    return this.getAgenteByIdUseCase.execute(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo agente' })
  @ApiBody({ type: CreateAgenteDto })
  @ApiResponse({ status: 201, description: 'Agente creado', type: AgenteResponseDto })
  @ApiResponse({ status: 409, description: 'Ya existe un agente con ese código' })
  async create(@Body() createAgenteDto: CreateAgenteDto): Promise<AgenteResponseDto> {
    return this.createAgenteUseCase.execute(createAgenteDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un agente existente' })
  @ApiParam({ name: 'id', description: 'UUID del agente' })
  @ApiBody({ type: UpdateAgenteDto })
  @ApiResponse({ status: 200, description: 'Agente actualizado', type: AgenteResponseDto })
  @ApiResponse({ status: 404, description: 'Agente no encontrado' })
  @ApiResponse({ status: 409, description: 'Ya existe un agente con ese código' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateAgenteDto: UpdateAgenteDto,
  ): Promise<AgenteResponseDto> {
    return this.updateAgenteUseCase.execute(id, updateAgenteDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un agente (soft delete)' })
  @ApiParam({ name: 'id', description: 'UUID del agente' })
  @ApiResponse({ status: 204, description: 'Agente eliminado' })
  @ApiResponse({ status: 404, description: 'Agente no encontrado' })
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.deleteAgenteUseCase.execute(id);
  }
}

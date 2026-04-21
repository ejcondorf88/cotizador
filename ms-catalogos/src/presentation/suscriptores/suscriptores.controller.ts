import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateSuscriptorUseCase } from '../../application/suscriptores/use-cases/create-suscriptor.use-case';
import { GetSuscriptoresUseCase } from '../../application/suscriptores/use-cases/get-suscriptores.use-case';
import { GetSuscriptorByIdUseCase } from '../../application/suscriptores/use-cases/get-suscriptor-by-id.use-case';
import { SearchSuscriptoresUseCase } from '../../application/suscriptores/use-cases/search-suscriptores.use-case';
import { UpdateSuscriptorUseCase } from '../../application/suscriptores/use-cases/update-suscriptor.use-case';
import { DeleteSuscriptorUseCase } from '../../application/suscriptores/use-cases/delete-suscriptor.use-case';
import { CreateSuscriptorDto } from '../../application/suscriptores/dto/create-suscriptor.dto';
import { UpdateSuscriptorDto } from '../../application/suscriptores/dto/update-suscriptor.dto';
import { PaginationDto } from '../../application/common/dto/pagination.dto';
import { SearchDto } from '../../application/common/dto/search.dto';
import { PaginatedSuscriptorResponseDto, SuscriptorResponseDto } from '../../application/suscriptores/dto/suscriptor-response.dto';

@ApiTags('suscriptores')
@Controller('catalogos/suscriptores')
export class SuscriptoresController {
  constructor(
    private readonly createSuscriptorUseCase: CreateSuscriptorUseCase,
    private readonly getSuscriptoresUseCase: GetSuscriptoresUseCase,
    private readonly getSuscriptorByIdUseCase: GetSuscriptorByIdUseCase,
    private readonly searchSuscriptoresUseCase: SearchSuscriptoresUseCase,
    private readonly updateSuscriptorUseCase: UpdateSuscriptorUseCase,
    private readonly deleteSuscriptorUseCase: DeleteSuscriptorUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener lista de suscriptores paginada' })
  @ApiResponse({ status: 200, description: 'Lista de suscriptores', type: PaginatedSuscriptorResponseDto })
  async findAll(@Query() pagination: PaginationDto): Promise<PaginatedSuscriptorResponseDto> {
    return this.getSuscriptoresUseCase.execute(pagination);
  }

  @Get('buscar')
  @ApiOperation({ summary: 'Buscar suscriptores por nombre o código' })
  @ApiQuery({ name: 'q', description: 'Término de búsqueda', required: true })
  @ApiQuery({ name: 'page', description: 'Número de página', required: false })
  @ApiQuery({ name: 'limit', description: 'Elementos por página', required: false })
  @ApiResponse({ status: 200, description: 'Resultados de búsqueda', type: PaginatedSuscriptorResponseDto })
  async search(
    @Query('q') query: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): Promise<PaginatedSuscriptorResponseDto> {
    const searchDto = { q: query } as SearchDto;
    const paginationDto = {
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 20
    } as PaginationDto;
    return this.searchSuscriptoresUseCase.execute(searchDto, paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un suscriptor por ID' })
  @ApiParam({ name: 'id', description: 'UUID del suscriptor' })
  @ApiResponse({ status: 200, description: 'Suscriptor encontrado', type: SuscriptorResponseDto })
  @ApiResponse({ status: 404, description: 'Suscriptor no encontrado' })
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<SuscriptorResponseDto> {
    return this.getSuscriptorByIdUseCase.execute(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo suscriptor' })
  @ApiBody({ type: CreateSuscriptorDto })
  @ApiResponse({ status: 201, description: 'Suscriptor creado', type: SuscriptorResponseDto })
  @ApiResponse({ status: 409, description: 'Ya existe un suscriptor con ese código' })
  async create(@Body() createSuscriptorDto: CreateSuscriptorDto): Promise<SuscriptorResponseDto> {
    return this.createSuscriptorUseCase.execute(createSuscriptorDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un suscriptor existente' })
  @ApiParam({ name: 'id', description: 'UUID del suscriptor' })
  @ApiBody({ type: UpdateSuscriptorDto })
  @ApiResponse({ status: 200, description: 'Suscriptor actualizado', type: SuscriptorResponseDto })
  @ApiResponse({ status: 404, description: 'Suscriptor no encontrado' })
  @ApiResponse({ status: 409, description: 'Ya existe un suscriptor con ese código' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSuscriptorDto: UpdateSuscriptorDto,
  ): Promise<SuscriptorResponseDto> {
    return this.updateSuscriptorUseCase.execute(id, updateSuscriptorDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un suscriptor (soft delete)' })
  @ApiParam({ name: 'id', description: 'UUID del suscriptor' })
  @ApiResponse({ status: 204, description: 'Suscriptor eliminado' })
  @ApiResponse({ status: 404, description: 'Suscriptor no encontrado' })
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.deleteSuscriptorUseCase.execute(id);
  }
}

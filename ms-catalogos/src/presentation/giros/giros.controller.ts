import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateGiroUseCase } from '../../application/giros/use-cases/create-giro.use-case';
import { GetGirosUseCase } from '../../application/giros/use-cases/get-giros.use-case';
import { GetGiroByIdUseCase } from '../../application/giros/use-cases/get-giro-by-id.use-case';
import { SearchGirosUseCase } from '../../application/giros/use-cases/search-giros.use-case';
import { UpdateGiroUseCase } from '../../application/giros/use-cases/update-giro.use-case';
import { DeleteGiroUseCase } from '../../application/giros/use-cases/delete-giro.use-case';
import { CreateGiroDto } from '../../application/giros/dto/create-giro.dto';
import { UpdateGiroDto } from '../../application/giros/dto/update-giro.dto';
import { PaginationDto } from '../../application/common/dto/pagination.dto';
import { SearchDto } from '../../application/common/dto/search.dto';
import { PaginatedGiroResponseDto, GiroResponseDto } from '../../application/giros/dto/giro-response.dto';

@ApiTags('giros')
@Controller('catalogos/giros')
export class GirosController {
  constructor(
    private readonly createGiroUseCase: CreateGiroUseCase,
    private readonly getGirosUseCase: GetGirosUseCase,
    private readonly getGiroByIdUseCase: GetGiroByIdUseCase,
    private readonly searchGirosUseCase: SearchGirosUseCase,
    private readonly updateGiroUseCase: UpdateGiroUseCase,
    private readonly deleteGiroUseCase: DeleteGiroUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener lista de giros paginada' })
  @ApiResponse({ status: 200, description: 'Lista de giros', type: PaginatedGiroResponseDto })
  async findAll(@Query() pagination: PaginationDto): Promise<PaginatedGiroResponseDto> {
    return this.getGirosUseCase.execute(pagination);
  }

  @Get('buscar')
  @ApiOperation({ summary: 'Buscar giros por descripción o clave' })
  @ApiQuery({ name: 'q', description: 'Término de búsqueda', required: true })
  @ApiResponse({ status: 200, description: 'Resultados de búsqueda', type: PaginatedGiroResponseDto })
  async search(
    @Query() searchDto: SearchDto,
    @Query() pagination: PaginationDto,
  ): Promise<PaginatedGiroResponseDto> {
    return this.searchGirosUseCase.execute(searchDto, pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un giro por ID' })
  @ApiParam({ name: 'id', description: 'UUID del giro' })
  @ApiResponse({ status: 200, description: 'Giro encontrado', type: GiroResponseDto })
  @ApiResponse({ status: 404, description: 'Giro no encontrado' })
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<GiroResponseDto> {
    return this.getGiroByIdUseCase.execute(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo giro' })
  @ApiBody({ type: CreateGiroDto })
  @ApiResponse({ status: 201, description: 'Giro creado', type: GiroResponseDto })
  @ApiResponse({ status: 409, description: 'Ya existe un giro con esa clave' })
  async create(@Body() createGiroDto: CreateGiroDto): Promise<GiroResponseDto> {
    return this.createGiroUseCase.execute(createGiroDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un giro existente' })
  @ApiParam({ name: 'id', description: 'UUID del giro' })
  @ApiBody({ type: UpdateGiroDto })
  @ApiResponse({ status: 200, description: 'Giro actualizado', type: GiroResponseDto })
  @ApiResponse({ status: 404, description: 'Giro no encontrado' })
  @ApiResponse({ status: 409, description: 'Ya existe un giro con esa clave' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateGiroDto: UpdateGiroDto,
  ): Promise<GiroResponseDto> {
    return this.updateGiroUseCase.execute(id, updateGiroDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un giro (soft delete)' })
  @ApiParam({ name: 'id', description: 'UUID del giro' })
  @ApiResponse({ status: 204, description: 'Giro eliminado' })
  @ApiResponse({ status: 404, description: 'Giro no encontrado' })
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.deleteGiroUseCase.execute(id);
  }
}

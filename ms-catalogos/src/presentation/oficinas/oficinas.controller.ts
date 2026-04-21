import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateOficinaUseCase } from '../../application/oficinas/use-cases/create-oficina.use-case';
import { GetOficinasUseCase } from '../../application/oficinas/use-cases/get-oficinas.use-case';
import { GetOficinaByIdUseCase } from '../../application/oficinas/use-cases/get-oficina-by-id.use-case';
import { UpdateOficinaUseCase } from '../../application/oficinas/use-cases/update-oficina.use-case';
import { DeleteOficinaUseCase } from '../../application/oficinas/use-cases/delete-oficina.use-case';
import { CreateOficinaDto } from '../../application/oficinas/dto/create-oficina.dto';
import { UpdateOficinaDto } from '../../application/oficinas/dto/update-oficina.dto';
import { PaginationDto } from '../../application/common/dto/pagination.dto';
import { PaginatedOficinaResponseDto, OficinaResponseDto } from '../../application/oficinas/dto/oficina-response.dto';

@ApiTags('oficinas')
@Controller('catalogos/oficinas')
export class OficinasController {
  constructor(
    private readonly createOficinaUseCase: CreateOficinaUseCase,
    private readonly getOficinasUseCase: GetOficinasUseCase,
    private readonly getOficinaByIdUseCase: GetOficinaByIdUseCase,
    private readonly updateOficinaUseCase: UpdateOficinaUseCase,
    private readonly deleteOficinaUseCase: DeleteOficinaUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Obtener lista de oficinas paginada' })
  @ApiResponse({ status: 200, description: 'Lista de oficinas', type: PaginatedOficinaResponseDto })
  async findAll(@Query() pagination: PaginationDto): Promise<PaginatedOficinaResponseDto> {
    return this.getOficinasUseCase.execute(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una oficina por ID' })
  @ApiParam({ name: 'id', description: 'UUID de la oficina' })
  @ApiResponse({ status: 200, description: 'Oficina encontrada', type: OficinaResponseDto })
  @ApiResponse({ status: 404, description: 'Oficina no encontrada' })
  async findById(@Param('id', ParseUUIDPipe) id: string): Promise<OficinaResponseDto> {
    return this.getOficinaByIdUseCase.execute(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva oficina' })
  @ApiBody({ type: CreateOficinaDto })
  @ApiResponse({ status: 201, description: 'Oficina creada', type: OficinaResponseDto })
  @ApiResponse({ status: 409, description: 'Ya existe una oficina con ese código' })
  async create(@Body() createOficinaDto: CreateOficinaDto): Promise<OficinaResponseDto> {
    return this.createOficinaUseCase.execute(createOficinaDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar una oficina existente' })
  @ApiParam({ name: 'id', description: 'UUID de la oficina' })
  @ApiBody({ type: UpdateOficinaDto })
  @ApiResponse({ status: 200, description: 'Oficina actualizada', type: OficinaResponseDto })
  @ApiResponse({ status: 404, description: 'Oficina no encontrada' })
  @ApiResponse({ status: 409, description: 'Ya existe una oficina con ese código' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOficinaDto: UpdateOficinaDto,
  ): Promise<OficinaResponseDto> {
    return this.updateOficinaUseCase.execute(id, updateOficinaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una oficina (soft delete)' })
  @ApiParam({ name: 'id', description: 'UUID de la oficina' })
  @ApiResponse({ status: 204, description: 'Oficina eliminada' })
  @ApiResponse({ status: 404, description: 'Oficina no encontrada' })
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.deleteOficinaUseCase.execute(id);
  }
}

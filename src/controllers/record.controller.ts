import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {get, getModelSchemaRef, param, response} from '@loopback/rest';
import {Swap} from '../models';
import {SwapRepository} from '../repositories';

export class RecordController {
  constructor(
    @repository(SwapRepository)
    public swapRepository: SwapRepository,
  ) {}

  @get('/swaps/count')
  @response(200, {
    description: 'Swap model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Swap) where?: Where<Swap>): Promise<Count> {
    return this.swapRepository.count(where);
  }

  @get('/swaps')
  @response(200, {
    description: 'Array of Swap model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Swap, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Swap) filter?: Filter<Swap>): Promise<Swap[]> {
    return this.swapRepository.find(filter);
  }

  @get('/swaps/{id}')
  @response(200, {
    description: 'Swap model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Swap, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Swap, {exclude: 'where'}) filter?: FilterExcludingWhere<Swap>,
  ): Promise<Swap> {
    return this.swapRepository.findById(id);
  }
}

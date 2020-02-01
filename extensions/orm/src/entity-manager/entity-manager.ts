import { Hydrator } from '../hydration/hydrator'
import { ConstructType } from '../interfaces/common'
import { BaseConnection } from '../interfaces/database'


export class EntityManager {

  public hydrators: Map<any, Hydrator<any>>

  public constructor(
    public connection: BaseConnection,
    // eventManager
  ) {
    this.hydrators = new Map<any, Hydrator<any>>()
  }

  // public getRepository(string $className) : ObjectRepository;
  // public getClassMetadata(string $className) : ClassMetadata;

  public createQueryBuilder<TEntity>(ctor: ConstructType<TEntity>) {
    //
  }

  // beginTransaction, commit, rollback은 connection에 구축하고 구현체
  public transaction(handler: () => void) {
    //
  }

  public getHydrator<TEntity>(ctor: ConstructType<TEntity>): Hydrator<TEntity> {
    const hydrator = this.hydrators.get(ctor)
    if (!hydrator) {
      // this.hydrators.set(entity, new Hydrator())
    }
    return hydrator!
  }


  public async find<TEntity>(ctor: ConstructType<TEntity>, id: string): Promise<TEntity | undefined> {
    return
  }

  public async persist<TEntity>(entity: TEntity): Promise<TEntity> {
    return entity
  }

  public async remove<TEntity>(entity: TEntity): Promise<void> {
    //
  }

  public async refresh<TEntity>(entity: TEntity): Promise<void> {
    //
  }
}

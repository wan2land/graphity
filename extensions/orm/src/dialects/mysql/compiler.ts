import { Compiler } from '../../query-builder/compiler'


export class MysqlCompiler extends Compiler {
  public normalizeTableName(name: string): string {
    return `\`${name.replace('.', '`.`')}\``
  }

  public normalizeColumnName(name: string): string {
    return `\`${name.replace('.', '`.`')}\``
  }
}

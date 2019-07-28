import { createOptions } from '../../lib/mapper/create-options'
import { intTransformer } from '../../lib/transformers/int-transformer'
import { stringTransformer } from '../../lib/transformers/string-transformer'
import { Article } from '../stubs/article'


describe('testsuite of relater/create-options', () => {
  it('test stubs/article', () => {
    expect(createOptions(Article)).toEqual({
      ctor: Article,
      columns: [
        {
          property: 'id',
          sourceKey: 'id',
          nullable: false,
          transformers: [intTransformer],
        },
        {
          property: 'title',
          sourceKey: 'title',
          nullable: false,
          transformers: [stringTransformer],
        },
        {
          property: 'contents',
          sourceKey: 'contents',
          nullable: true,
          transformers: [stringTransformer],
        },
        {
          property: 'createdAt',
          sourceKey: 'created_at',
          nullable: false,
          transformers: [stringTransformer],
        },
      ],
    })
  })
})

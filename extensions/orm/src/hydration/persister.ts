

  // it('test toPlain one', async () => {
  //   // by class
  //   const article1 = hydrator.toPlain(Object.assign(new Article(), { id: 10, title: 'this is title', createdAt: '2019-03-01 00:00:00' }))

  //   expect(article1).toEqual({ id: 10, title: 'this is title', created_at: '2019-03-01 00:00:00' })
  //   expect(isPlainObject(article1)).toBeTruthy()


  //   // by deep partial
  //   const article2 = hydrator.toPlain({ id: 10, title: 'this is title', createdAt: '2019-03-01 00:00:00' })

  //   expect(article2).toEqual({ id: 10, title: 'this is title', created_at: '2019-03-01 00:00:00' })
  //   expect(isPlainObject(article2)).toBeTruthy()
  // })

  // it('test toPlain many', async () => {
  //   // by class
  //   const articles1 = hydrator.toPlain([
  //     Object.assign(new Article(), { id: 10, title: '', createdAt: '2019-03-01 00:00:00' }),
  //     Object.assign(new Article(), { id: 11, title: 'this is title', createdAt: '2019-03-02 00:00:00' }),
  //   ])

  //   expect(articles1).toEqual([
  //     { id: 10, title: '', created_at: '2019-03-01 00:00:00' },
  //     { id: 11, title: 'this is title', created_at: '2019-03-02 00:00:00' },
  //   ])
  //   articles1.map(article1 => expect(isPlainObject(article1)).toBeTruthy())


  //   // by deep partial
  //   const articles2 = hydrator.toPlain([
  //     { id: 10, title: '', createdAt: '2019-03-01 00:00:00' },
  //     { id: 11, title: 'this is title', createdAt: '2019-03-02 00:00:00' },
  //   ])

  //   expect(articles2).toEqual([
  //     { id: 10, title: '', created_at: '2019-03-01 00:00:00' },
  //     { id: 11, title: 'this is title', created_at: '2019-03-02 00:00:00' },
  //   ])
  //   articles2.map(article2 => expect(isPlainObject(article2)).toBeTruthy())
  // })
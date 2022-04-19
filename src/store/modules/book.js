// 自己添加一个局部模块

export default {
  namespaced: true,
  state: {
    bookList: [{
      id: 1,
      name: '浪潮之巅'
    }]
  },
  mutations: {
    addBook (state, book) {
      state.bookList.push(book)
    }
  },
  actions: {},
  getters: {
    bookInfo (state) {
      return state.bookList.map(item => {
        return {
          id: item.id,
          name: '《' + item.name + '》'
        }
      })
      // return state.bookList.map(item => ({
      //   id: item.id,
      //   name: '《' + item.name + '》'
      // }))
    }
  }
}

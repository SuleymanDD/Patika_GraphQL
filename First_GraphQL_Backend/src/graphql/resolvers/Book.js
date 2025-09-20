const Book = {
    author: (parent,__, {db}) => db.authors.find((author) => author.id === parent.author_id),
}

module.exports.Book = Book;
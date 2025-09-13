const authors = [{
    id: "1",
    name:"Ahmed",
    surname: "Mitrovic",
    age: 21,
    books: [
        {
            id: "1",
            title: "Domuz Emi",
            score: 3.2,
            isPublished: false
        },
        {
            id: "2",
            title: "Elas Keas",
            score: 9,
            isPublished: true
        }
    ]
}]

const books = [{
    id: "1",
    title: "Şeker Portakalı",
    author: authors[0],
    score: 7.5,
    isPublished: true
}];

module.exports = {
    authors,
    books,
}
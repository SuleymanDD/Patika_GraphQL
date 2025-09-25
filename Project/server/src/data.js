const users = [
    {
        id: "1",
        fullName: "Kenan Yıldız",
    },
    {
        id: "2",
        fullName: "Kerem Aktürkoğlu"
    },
];

const posts = [
    {
        id: "1",
        title: "Pasetur Lemas",
        description: "Lorem isajsf tdgdas",
        user_id: "1",
    },
    {
        id: "2",
        title: "Terma Ela",
        description: "Lorem isajsf tdgdas",
        user_id: "2",
    }

];

const comments = [
    {
        id: "1",
        text: "Kes lan",
        post_id: "2",
        user_id: "1",
    },
    {
        id: "2",
        text: "Mal la bu",
        post_id: "1",
        user_id: "2",
    },

];

export default {
    users,
    posts,
    comments,
}
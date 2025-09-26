const users = [
    {
        id: "1",
        fullName: "Kenan Yıldız",
        age: 21,
        profile_photo: "https://randomuser.me/api/portraits/men/90.jpg",
    },
    {
        id: "2",
        fullName: "Kerem Aktürkoğlu",
        age: 27,
        profile_photo: "https://randomuser.me/api/portraits/men/1.jpg",
    },
];

const posts = [
    {
        id: "1",
        title: "Pasetur Lemas",
        description: "Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        user_id: "1",
        cover: "https://images.unsplash.com/photo-1755918909925-f62b86d93c2a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        id: "2",
        title: "Terma Ela",
        description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ",
        user_id: "2",
        cover: "https://images.unsplash.com/photo-1756310362993-894a1868c34d?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
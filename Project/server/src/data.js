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
    {
        id: "3",
        fullName: "Kejman Türker",
        age: 81,
        profile_photo: "https://randomuser.me/api/portraits/men/5.jpg",
    },
    {
        id: "4",
        fullName: "Fatih Gülsoy",
        age: 14,
        profile_photo: "https://randomuser.me/api/portraits/men/12.jpg",
    },
    {
        id: "5",
        fullName: "Mustafa Author",
        age: 32,
        profile_photo: "https://randomuser.me/api/portraits/men/67.jpg",
    },
    {
        id: "6",
        fullName: "Kestane Bülbülü Author",
        age: 41,
        profile_photo: "https://randomuser.me/api/portraits/men/23.jpg",
    },

];

const posts = [
    {
        id: "1",
        title: "Pasetur Lemas",
        short_description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
        description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        user_id: "5",
        cover: "https://images.unsplash.com/photo-1755918909925-f62b86d93c2a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
        id: "2",
        title: "Terma Ela",
        short_description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.",
        description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
        user_id: "6",
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
    {
        id: "3",
        text: "Seni Gidi Seni",
        post_id: "1",
        user_id: "3",
    },
    {
        id: "4",
        text: "Ezi Ciya Ula",
        post_id: "2",
        user_id: "4",
    },

];

export default {
    users,
    posts,
    comments,
}
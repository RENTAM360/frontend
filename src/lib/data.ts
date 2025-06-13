// // Mock data fetching function - replace with actual API calls in production
// export async function getOwnerReviews(id: string) {
//   // This would be replaced with your actual data fetching logic
//   return {
//     owner: {
//       id,
//       name: "Thankgod ogbonna",
//       profileImage: "/images/profile.jpg",
//     },
//     reviews: [
//       {
//         id: "1",
//         user: {
//           id: "user1",
//           name: "David ugo",
//           profileImage: "/du.svg",
//         },
//         text: "Good rent and great customer service",
//         date: "28/05/25",
//         likes: 0,
//         replies: [],
//       },
//       {
//         id: "2",
//         user: {
//           id: "user2",
//           name: "victor john",
//           profileImage: "/vj.svg",
//         },
//         text: "Good rent and great customer service",
//         date: "28/05/25",
//         likes: 0,
//         replies: [
//           {
//             id: "reply1",
//             user: {
//               id: id,
//               name: "Thankgod ogbonna",
//               profileImage: "/tg2.svg",
//             },
//             text: "OOh cool that sound great",
//             date: "28/05/25",
//             isOwner: true,
//           },
//           {
//             id: "reply2",
//             user: {
//               id: "user3",
//               name: "Wow cool",
//               profileImage: "/tg.svg",
//             },
//             text: "Wow cool",
//             date: "28/05/25",
//             isOwner: false,
//           },
//         ],
//       },
//       {
//         id: "3",
//         user: {
//           id: "user4",
//           name: "Femi abu",
//           profileImage: "/fa.svg",
//         },
//         text: "Got a Monitor Mount from him, it came really quickly and was as seen. Fits my monitor",
//         date: "28/05/25",
//         likes: 0,
//         image: "/monitor-mount.svg",
//         replies: [],
//       },
//     ],
//   }
// }


// export async function getUserProfile() {
//   // This would be replaced with your actual data fetching logic
//   return {
//     id: "user123",
//     name: "Thankgod ogbonna",
//     verified: true,
//     rating: 4.5,
//     totalReviews: 17,
//     bio: "Thankgod is a passionate entrepreneur and the founder of rental360, a premier car rental service that provides reliable, affordable, and high-quality vehicles for all kinds of travelers.",
//     location: "7 Woji Port harcout",
//     phone: "09124639133",
//     profileImage: "/tg.svg",
//     listedItems: [
//       {
//         id: "1",
//         title: "Excavator",
//         category: "Construction tools",
//         price: 50000,
//         rating: 4.5,
//         imageUrl: "/excavator.svg",
//       },
//       {
//         id: "2",
//         title: "Excavator",
//         category: "Construction tools",
//         price: 50000,
//         rating: 4.5,
//         imageUrl: "/excavator.svg",
//       },
//       {
//         id: "3",
//         title: "Excavator",
//         category: "Construction tools",
//         price: 50000,
//         rating: 4.5,
//         imageUrl: "/excavator.svg",
//       },
//       {
//         id: "4",
//         title: "Excavator",
//         category: "Construction tools",
//         price: 50000,
//         rating: 4.5,
//         imageUrl: "/excavator.svg",
//       },
//       {
//         id: "5",
//         title: "Excavator",
//         category: "Construction tools",
//         price: 50000,
//         rating: 4.5,
//         imageUrl: "/excavator.svg",
//       },
//       {
//         id: "6",
//         title: "Excavator",
//         category: "Construction tools",
//         price: 50000,
//         rating: 4.5,
//         imageUrl: "/excavator.svg",
//       },
//     ],
//   }
// }

// Mock data fetching function - replace with actual API calls in production
export function getUserProfile() {
  // This would be replaced with your actual data fetching logic
  return {
    id: "user123",
    name: "Thankgod ogbonna",
    verified: true,
    rating: 4.5,
    totalReviews: 17,
    bio: "Thankgod is a passionate entrepreneur and the founder of rental360, a premier car rental service that provides reliable, affordable, and high-quality vehicles for all kinds of travelers.",
    location: "7 Woji Port harcout",
    phone: "09124639133",
    email: "thankgod@example.com",
    profileImage: "/tg.svg",
    country: "Nigeria",
    listedItems: [
      {
        id: "1",
        title: "Excavator",
        category: "Construction tools",
        price: 50000,
        rating: 4.5,
        imageUrl: "/excavator.svg",
      },
      {
        id: "2",
        title: "Excavator",
        category: "Construction tools",
        price: 50000,
        rating: 4.5,
        imageUrl: "/excavator.svg",
      },
      {
        id: "3",
        title: "Excavator",
        category: "Construction tools",
        price: 50000,
        rating: 4.5,
        imageUrl: "/excavator.svg",
      },
      {
        id: "4",
        title: "Excavator",
        category: "Construction tools",
        price: 50000,
        rating: 4.5,
        imageUrl: "/excavator.svg",
      },
      {
        id: "5",
        title: "Excavator",
        category: "Construction tools",
        price: 50000,
        rating: 4.5,
        imageUrl: "/excavator.svg",
      },
      {
        id: "6",
        title: "Excavator",
        category: "Construction tools",
        price: 50000,
        rating: 4.5,
        imageUrl: "/excavator.svg",
      },
    ],
  }
}

export async function getOwnerReviews(id: string) {
  // Mock data - replace with actual data fetching logic
  const owner = {
    id,
    name: "Thankgod Ogbonna",
    profileImage: "/diverse-group-profile.png",
  }

    const reviews = [
      {
        id: "1",
        user: {
          id: "user1",
          name: "David ugo",
          profileImage: "/du.svg",
        },
        text: "Good rent and great customer service",
        date: "28/05/25",
        likes: 0,
        replies: [],
      },
      {
        id: "2",
        user: {
          id: "user2",
          name: "victor john",
          profileImage: "/vj.svg",
        },
        text: "Good rent and great customer service",
        date: "28/05/25",
        likes: 0,
        replies: [
          {
            id: "reply1",
            user: {
              id: id,
              name: "Thankgod ogbonna",
              profileImage: "/tg2.svg",
            },
            text: "OOh cool that sound great",
            date: "28/05/25",
            isOwner: true,
          },
          {
            id: "reply2",
            user: {
              id: "user3",
              name: "Wow cool",
              profileImage: "/tg.svg",
            },
            text: "Wow cool",
            date: "28/05/25",
            isOwner: false,
          },
        ],
      },
      {
        id: "3",
        user: {
          id: "user4",
          name: "Femi abu",
          profileImage: "/fa.svg",
        },
        text: "Got a Monitor Mount from him, it came really quickly and was as seen. Fits my monitor",
        date: "28/05/25",
        likes: 0,
        image: "/monitor-mount.svg",
        replies: [],
      },
    ]

  return { owner, reviews }
}

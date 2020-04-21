let db = {
  users: [
    {
      userID: "123123123",
      email: "userm@mail.com",
      handle: "user",
      createdAt: "2019-03-15T10:59:52.798Z",
      imageUrl: "image/photo",
      bio: "Hello, I am user",
      website: "https://user.com",
      location: "London,UK"
    }
  ],
  screams: [
    {
      userHandle: "user",
      body: "this is the scream body",
      createdAt: "2020-02-23T13:08:55.231Z",
      likeCount: 5,
      commentCount: 2
    }
  ],
  comments: [
    {
      userHandle: "user",
      screamId: "asdfadsf",
      body: "a body",
      createdAt: "2020-02-23T13:08:55.231Z"
    }
  ],
  notifications: [
    {
      recipient: "user",
      sender: "john",
      read: "true | false",
      screamId: "fdsafdsafsda",
      type: "like | comment",
      createdAt: "2020-02-23T13:08:55.231Z"
    }
  ]
};

const userDetails = {
  // Redux
  credentials: {
    userId: "asdfadsf",
    email: "user@email.com",
    handle: "user",
    createdAt: "2019-03-15T10:59:52.798Z",
    imageUrl: "image/photo",
    bio: "Hello, I am user",
    website: "https://user.com",
    location: "London,UK"
  },
  likes: [
    {
      userHandle: "user",
      screamId: "hhfdsafa"
    },
    {
      userHandle: "user",
      screamId: "dsafdsafas"
    }
  ]
};

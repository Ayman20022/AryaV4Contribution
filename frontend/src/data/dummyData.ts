export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  following: number;
  followers: number;
  isFollowing?: boolean;
}

export interface Post {
  id: string;
  userId: string;
  text: string;
  images?: string[];
  video?: string;
  link?: string;
  createdAt: Date;
  agrees: number;
  disagrees: number;
  amplifiedBy: string[];
  comments: Comment[];
  isProject?: boolean;
  isAggregator?: boolean;
  aggregatorSource?: string;
  collaborators?: string[];
  contributions?: Contribution[];
  contributorsNeeded?: string[];
}

export interface Comment {
  id: string;
  userId: string;
  text: string;
  createdAt: Date;
  agrees: number;
  user?: User;
  replies?: Comment[];
  parentId?: string;
}

export interface Contribution {
  id: string;
  userId: string;
  type: 'pdf' | 'code' | 'video' | 'image' | 'text';
  content: string;
  createdAt: Date;
}

export const currentUser: User = {
  id: "u1",
  name: "Jamie Smith",
  username: "jamie_designs",
  avatar: "https://i.pravatar.cc/150?img=12",
  bio: "UI/UX Designer | Creating minimal interfaces that solve complex problems",
  following: 245,
  followers: 1289
};

export const users: User[] = [
  {
    id: "u2",
    name: "Alex Johnson",
    username: "alex_tech",
    avatar: "https://i.pravatar.cc/150?img=32",
    bio: "Tech enthusiast & developer | Building the future",
    following: 421,
    followers: 5872,
    isFollowing: true
  },
  {
    id: "u3",
    name: "Sophia Chen",
    username: "sophia_codes",
    avatar: "https://i.pravatar.cc/150?img=5",
    bio: "Full-stack developer | Open source contributor",
    following: 183,
    followers: 4231,
    isFollowing: true
  },
  {
    id: "u4",
    name: "Marcus Green",
    username: "marcus_creates",
    avatar: "https://i.pravatar.cc/150?img=53",
    bio: "Visual designer & 3D artist",
    following: 302,
    followers: 8721,
    isFollowing: false
  },
  {
    id: "u5",
    name: "Luna Park",
    username: "luna_product",
    avatar: "https://i.pravatar.cc/150?img=9",
    bio: "Product Manager | Creating user-centric products",
    following: 178,
    followers: 2431,
    isFollowing: true
  }
];

export const findUserById = (userId: string): User => {
  if (userId === currentUser.id) return currentUser;
  const user = users.find(u => u.id === userId);
  if (!user) throw new Error(`User not found: ${userId}`);
  return user;
};

const newsAggregatorId = "news-bot";

export const newsAggregator: User = {
  id: newsAggregatorId,
  name: "Sphere News",
  username: "sphere_news",
  avatar: "https://i.pravatar.cc/150?img=11",
  bio: "Your AI-powered industry news aggregator. Bringing you the latest in tech, design, and development.",
  following: 0,
  followers: 14782,
};

users.push(newsAggregator);

export const posts: Post[] = [
  {
    id: "p1",
    userId: "u2",
    text: "Just launched a new design system for our app. Check it out and let me know what you think!",
    images: ["https://picsum.photos/seed/design1/600/400"],
    link: "https://designsystem.example.com",
    createdAt: new Date(Date.now() - 3600000),
    agrees: 128,
    disagrees: 3,
    amplifiedBy: ["u3", "u5"],
    comments: [
      {
        id: "c1",
        userId: "u3",
        text: "Love the color palette you've chosen. Very accessible!",
        createdAt: new Date(Date.now() - 1800000),
        agrees: 12
      },
      {
        id: "c2",
        userId: "u5",
        text: "The typography is perfect. What font are you using?",
        createdAt: new Date(Date.now() - 900000),
        agrees: 8
      }
    ]
  },
  {
    id: "p2",
    userId: "u3",
    text: "Working on a new algorithm to optimize image loading. Initial tests show 40% faster load times! 🚀",
    createdAt: new Date(Date.now() - 7200000),
    agrees: 245,
    disagrees: 2,
    amplifiedBy: ["u2", "u4"],
    comments: [
      {
        id: "c3",
        userId: "u2",
        text: "This is going to be game-changing for our mobile users!",
        createdAt: new Date(Date.now() - 5400000),
        agrees: 18
      }
    ],
    isProject: true,
    collaborators: ["u2", "u5"],
    contributions: [
      {
        id: "con1",
        userId: "u5",
        type: "code",
        content: "https://github.com/example/image-optimization",
        createdAt: new Date(Date.now() - 3600000)
      }
    ]
  },
  {
    id: "p3",
    userId: "u5",
    text: "User research revealed some interesting insights about our onboarding flow. Planning to implement changes next week.",
    createdAt: new Date(Date.now() - 10800000),
    agrees: 67,
    disagrees: 5,
    amplifiedBy: [],
    comments: [
      {
        id: "c4",
        userId: "u1",
        text: "Would love to hear more about your findings! Any key pain points?",
        createdAt: new Date(Date.now() - 9000000),
        agrees: 11
      }
    ]
  },
  {
    id: "p4",
    userId: "u4",
    text: "Created a 3D visualization for sustainable architecture. Fully interactive and ready for VR exploration.",
    images: ["https://picsum.photos/seed/arch1/600/400", "https://picsum.photos/seed/arch2/600/400"],
    video: "https://example.com/video.mp4",
    createdAt: new Date(Date.now() - 86400000),
    agrees: 532,
    disagrees: 7,
    amplifiedBy: ["u1", "u2", "u3", "u5"],
    comments: [
      {
        id: "c5",
        userId: "u1",
        text: "The attention to detail is incredible! Would love to try this in VR.",
        createdAt: new Date(Date.now() - 82800000),
        agrees: 22
      }
    ],
    isProject: true,
    collaborators: ["u1", "u3"],
    contributions: [
      {
        id: "con2",
        userId: "u3",
        type: "text",
        content: "Added energy efficiency calculations for the north wing.",
        createdAt: new Date(Date.now() - 43200000)
      },
      {
        id: "con3",
        userId: "u1",
        type: "image",
        content: "https://picsum.photos/seed/arch3/600/400",
        createdAt: new Date(Date.now() - 21600000)
      }
    ]
  },
  {
    id: "p5",
    userId: "u1",
    text: "Just finished redesigning my portfolio. Aiming for simplicity and clarity. Feedback welcome!",
    images: ["https://picsum.photos/seed/portfolio/600/400"],
    link: "https://portfolio.example.com",
    createdAt: new Date(Date.now() - 7200000),
    agrees: 48,
    disagrees: 0,
    amplifiedBy: ["u2"],
    comments: [
      {
        id: "c6",
        userId: "u2",
        text: "Clean and elegant! Love the transitions between sections.",
        createdAt: new Date(Date.now() - 5400000),
        agrees: 8
      }
    ]
  },
  {
    id: "agg1",
    userId: newsAggregatorId,
    text: "🔥 BREAKING: A new web standard for browser APIs was announced today, promising to revolutionize how developers interact with hardware peripherals. The W3C's new proposal aims to simplify access to device features.",
    link: "https://example.com/web-standard-announcement",
    createdAt: new Date(Date.now() - 2700000),
    agrees: 327,
    disagrees: 12,
    amplifiedBy: ["u2", "u3"],
    comments: [],
    isAggregator: true,
    aggregatorSource: "Web Standards Weekly"
  },
  {
    id: "agg2",
    userId: newsAggregatorId,
    text: "📊 TREND ALERT: Zero-knowledge proofs are gaining traction in mainstream applications. Companies are increasingly adopting this cryptographic method to enhance privacy while maintaining data verification capabilities.",
    images: ["https://picsum.photos/seed/zk-proofs/600/400"],
    createdAt: new Date(Date.now() - 10800000),
    agrees: 476,
    disagrees: 8,
    amplifiedBy: ["u3", "u4", "u5"],
    comments: [],
    isAggregator: true,
    aggregatorSource: "Crypto Insider"
  },
  {
    id: "agg3",
    userId: newsAggregatorId,
    text: "💡 NEW RESEARCH: MIT researchers have developed a neural network architecture that reduces training time by 60% while maintaining accuracy parity with conventional models. The technique uses sparse matrix operations to optimize computations.",
    link: "https://example.com/mit-neural-network-breakthrough",
    createdAt: new Date(Date.now() - 86400000),
    agrees: 892,
    disagrees: 14,
    amplifiedBy: ["u2", "u4"],
    comments: [],
    isAggregator: true,
    aggregatorSource: "AI Research Today"
  },
  {
    id: "agg4",
    userId: newsAggregatorId,
    text: "🚀 PRODUCT LAUNCH: GraphQL Galaxy, a new developer platform, has launched with features specifically tailored for complex data fetching scenarios. The platform includes visual query building and automated documentation.",
    images: ["https://picsum.photos/seed/graphql-galaxy/600/400"],
    createdAt: new Date(Date.now() - 172800000),
    agrees: 543,
    disagrees: 27,
    amplifiedBy: ["u2", "u3", "u5"],
    comments: [],
    isAggregator: true,
    aggregatorSource: "DevTools Digest"
  },
  {
    id: "agg5",
    userId: newsAggregatorId,
    text: "📱 INDUSTRY SHIFT: Progressive Web Apps (PWAs) are seeing wider adoption among enterprise customers, with a 47% increase in deployment over the last quarter. Performance metrics show 3x improvement in load times compared to traditional web apps.",
    link: "https://example.com/pwa-enterprise-adoption",
    createdAt: new Date(Date.now() - 259200000),
    agrees: 631,
    disagrees: 42,
    amplifiedBy: ["u3"],
    comments: [],
    isAggregator: true,
    aggregatorSource: "Enterprise Tech Weekly"
  }
];

export const projects = posts.filter(post => post.isProject);

export const generateFeed = () => {
  return [...posts].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds}s`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d`;
  
  return date.toLocaleDateString();
};

export const generateFakeUsers = (): User[] => {
  const fakeUsers: User[] = [];

  const firstNames = [
    "John", "Jane", "David", "Sarah", "Michael", "Emily", "Robert", "Emma", "James", "Olivia",
    "William", "Sophia", "Joseph", "Isabella", "Charles", "Mia", "Thomas", "Charlotte", "Daniel", "Amelia",
    "Matthew", "Harper", "Anthony", "Evelyn", "Donald", "Abigail", "Steven", "Elizabeth", "Paul", "Sofia",
    "Andrew", "Avery", "Joshua", "Ella", "Kenneth", "Scarlett", "Kevin", "Grace", "Brian", "Chloe",
    "George", "Victoria", "Edward", "Riley", "Ronald", "Aria", "Timothy", "Lily", "Jason", "Aubrey"
  ];

  const lastNames = [
    "Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor",
    "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson",
    "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall", "Allen", "Young", "Hernandez", "King",
    "Wright", "Lopez", "Hill", "Scott", "Green", "Adams", "Baker", "Gonzalez", "Nelson", "Carter",
    "Mitchell", "Perez", "Roberts", "Turner", "Phillips", "Campbell", "Parker", "Evans", "Edwards", "Collins"
  ];

  const bioFragments = [
    "Designer", "Developer", "Product Manager", "UX Researcher", "AI Specialist", "Data Scientist",
    "Frontend Engineer", "Backend Engineer", "Full-Stack Developer", "DevOps Engineer", "UI Designer",
    "Entrepreneur", "Startup Founder", "Project Manager", "Consultant", "Marketer", "Content Creator",
    "Blockchain Developer", "Cloud Engineer", "Systems Architect", "Mobile Developer", "Game Developer"
  ];

  const bioAttributes = [
    "passionate about", "focused on", "specialized in", "excited about", "exploring", "innovating in",
    "researching", "building in", "transforming", "revolutionizing", "streamlining", "optimizing"
  ];

  const bioTopics = [
    "user experience", "web development", "machine learning", "data visualization", "blockchain",
    "cloud computing", "mobile applications", "AI", "open source", "product design", "user interfaces",
    "microservices", "serverless architecture", "augmented reality", "virtual reality", "IoT",
    "cybersecurity", "digital transformation", "automation", "digital marketing", "content strategy"
  ];

  for (let i = 0; i < 10000; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const username = `${firstName.toLowerCase()}${lastName.toLowerCase()}${Math.floor(Math.random() * 1000)}`;
    
    const role = bioFragments[Math.floor(Math.random() * bioFragments.length)];
    const action = bioAttributes[Math.floor(Math.random() * bioAttributes.length)];
    const topic = bioTopics[Math.floor(Math.random() * bioTopics.length)];
    
    const bio = `${role} ${action} ${topic} | Building the future of technology`;
    
    const avatarSeed = Math.floor(Math.random() * 1000);
    const avatar = `https://i.pravatar.cc/150?img=${avatarSeed % 70}`;
    
    const followers = Math.floor(Math.random() * 5000);
    const following = Math.floor(Math.random() * 1000);
    
    fakeUsers.push({
      id: `fake${i}`,
      name,
      username,
      avatar,
      bio,
      followers,
      following,
      isFollowing: Math.random() > 0.7
    });
  }
  
  return fakeUsers;
};

export const fakeUsers = generateFakeUsers();

export const getAllUsers = (): User[] => {
  return [...users, ...fakeUsers];
};

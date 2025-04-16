
const findUserById = (userId) => {
  // if (userId === currentUser.id) return currentUser;
  const user = usersData.find(u => u.id === userId);
  if (!user) throw new Error(`User not found: ${userId}`);
  return user;
};

const usersData = [
    {
      id: "u1",
      name: "Jamie Smith",
      username: "jamie_designs",
      avatar: "https://i.pravatar.cc/150?img=12",
      bio: "UI/UX Designer | Creating minimal interfaces that solve complex problems",
      following: 245,
      followers: 1289
    },
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
        id: "news-bot",
        name: "Sphere News",
        username: "sphere_news",
        avatar: "https://i.pravatar.cc/150?img=11",
        bio: "Your AI-powered industry news aggregator. Bringing you the latest in tech, design, and development.",
        following: 0,
        followers: 14782,
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
    ]
  
  
  const newsAggregatorId = "news-bot"
  
  const postsData = [
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


const dummyPrompts = [
    {
      id: 'p1',
      title: 'Professional Email Writer',
      description: 'Generate professional emails for any business situation.',
      content: `As a professional email writer, your task is to compose clear, concise, and professional emails for various business situations.
  
  1. Ask for the email purpose (follow-up, introduction, request, etc.)
  2. Inquire about the relationship with the recipient
  3. Request any key points to include
  4. Generate a professional email with:
     - Appropriate greeting
     - Clear and concise body
     - Professional closing
     - Optional follow-up suggestion
  5. Offer alternative tones (formal, friendly, urgent) if requested`,
      price: 2.99,
      category: 'business',
      creator: findUserById('u2'),
      isPremium: false,
      purchases: 172,
      reviews: [
        {
          userId: 'u3',
          username: 'Alex Johnson',
          rating: 9,
          comment: 'Saved me so much time writing emails to clients. Highly recommended!',
          date: '2023-06-12'
        }
      ],
      averageRating: 9
    },
    {
      id: 'p2',
      title: 'Code Reviewer',
      description: 'Expert code review with best practices and security insights.',
      content: `As a Code Reviewer, your task is to review code snippets and provide expert feedback.
  
  1. Analyze the code for:
     - Readability and maintainability
     - Potential bugs or errors
     - Security vulnerabilities
     - Performance issues
     - Adherence to best practices
  2. Provide specific line-by-line comments
  3. Suggest improvements and refactoring options
  4. Rate the code quality on a scale of 1-10
  5. Summarize the main findings and recommendations`,
      price: 5.99,
      category: 'programming',
      creator: findUserById('u3'),
      isPremium: true,
      purchases: 89,
      reviews: [
        {
          userId: 'u4',
          username: 'Emily Chen',
          rating: 8,
          comment: 'Really thorough code analysis. Found issues I completely missed.',
          date: '2023-07-22'
        },
        {
          userId: 'u5',
          username: 'Michael Smith',
          rating: 7,
          comment: 'Good suggestions but could be more detailed for complex codebases.',
          date: '2023-08-05'
        }
      ],
      averageRating: 7.5
    },
    {
      id: 'p3',
      title: 'Social Media Content Planner',
      description: 'Generate a full month of engaging social media content.',
      content: `As a Social Media Content Planner, help create a comprehensive content plan.
  
  1. Request the following information:
     - Target audience demographics
     - Platform(s) (Instagram, Twitter, LinkedIn, etc.)
     - Industry/niche
     - Brand voice (casual, professional, humorous, etc.)
     - Key goals (engagement, traffic, sales, etc.)
  2. Generate a 30-day content calendar with:
     - Post ideas with suggested copy
     - Content themes for each week
     - Optimal posting times
     - Hashtag suggestions
     - Engagement prompts
  3. Include a mix of content types (educational, promotional, user-generated, etc.)`,
      price: 9.99,
      category: 'marketing',
      creator: findUserById('u4'),
      isPremium: true,
      purchases: 205,
      reviews: [
        {
          userId: 'u1',
          username: 'Jamie Smith',
          rating: 9,
          comment: 'Transformed our social media strategy completely. Great value!',
          date: '2023-09-15'
        }
      ],
      averageRating: 9
    },
    {
      id: 'p4',
      title: 'Resume Optimizer',
      description: 'Transform your resume to highlight key skills and achievements.',
      content: `As a Resume Optimizer, help transform resumes to be ATS-friendly and impactful.
  
  1. Review the current resume and job description
  2. Identify keywords from the job description
  3. Restructure the resume to:
     - Include relevant keywords naturally
     - Highlight quantifiable achievements
     - Remove irrelevant information
     - Use action verbs and concise language
  4. Suggest improvements for formatting and layout
  5. Provide a final version optimized for both ATS systems and human readers`,
      price: 3.99,
      category: 'career',
      creator: findUserById('u5'),
      isPremium: false,
      purchases: 328,
      reviews: [
        {
          userId: 'u2',
          username: 'Alex Johnson', 
          rating: 8,
          comment: 'Helped me land three interviews in a week after months of searching!',
          date: '2023-08-22'
        }
      ],
      averageRating: 8
    },
    {
      id: 'p5',
      title: 'Creative Story Prompt',
      description: 'Generate compelling short story ideas and character outlines.',
      content: `As a Creative Story Prompter, help writers develop engaging fiction.
  
  1. Ask for preferences:
     - Genre (fantasy, sci-fi, romance, mystery, etc.)
     - Length (flash fiction, short story, novel)
     - Target audience
     - Themes or elements to include/avoid
  2. Generate a comprehensive story prompt with:
     - Intriguing premise
     - Main character outline with motivations
     - Supporting character ideas
     - Setting description
     - Potential plot points and conflicts
     - Suggested ending types (twist, resolution, cliffhanger)
  3. Provide additional variations or expansions if requested`,
      price: 1.99,
      category: 'creativity',
      creator: findUserById('u2'),
      isPremium: false,
      purchases: 143,
      reviews: [
        {
          userId: 'u3',
          username: 'Sophia Chen',
          rating: 10,
          comment: 'My creative writing students love these prompts. Highly recommended!',
          date: '2023-07-18'
        }
      ],
      averageRating: 10
    },
    {
      id: 'p6',
      title: 'Data Analysis Plan',
      description: 'Develop a structured approach to analyze any dataset.',
      content: `As a Data Analysis Planner, create a comprehensive plan for data analysis.
  
  1. Request information about:
     - Dataset characteristics (size, variables, format)
     - Research questions or business goals
     - Available tools and user expertise
  2. Develop a structured analysis plan:
     - Data cleaning and preprocessing steps
     - Exploratory data analysis techniques
     - Statistical methods appropriate for the data
     - Visualization recommendations
     - Interpretation guidance
  3. Include code snippets if appropriate (Python/R)
  4. Suggest validation methods and potential pitfalls
  5. Provide reporting template recommendations`,
      price: 12.99,
      category: 'data science',
      creator: findUserById('u3'),
      isPremium: true,
      purchases: 67,
      reviews: [
        {
          userId: 'u4',
          username: 'Emily Chen',
          rating: 9,
          comment: 'Extremely thorough and well-structured. Helped our team standardize our approach.',
          date: '2023-10-05'
        }
      ],
      averageRating: 9
    }
  ];

module.exports = {usersData,postsData,dummyPrompts}
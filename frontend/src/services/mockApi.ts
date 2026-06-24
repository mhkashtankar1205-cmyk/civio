import { User, Post, Comment, Notification } from '../types';
import safeStorage from './storage';

// Mock Avatars
const AVATAR_STERLING = "https://lh3.googleusercontent.com/aida-public/AB6AXuBb-mdQOf1Usp9N1Qoi-om-xXsVXzlRiWxsyno8yerSs_YdiCZer9ULQseoJlpOSYRG9pc6Sb6OjKfklFtrgQHS-PcIelMPn0gRXFAcnA5c6p__sLuANny8A8dqC5bwfPFWA6gpbPI64a3qeBsQQthZk4Y3eQ0CgRJ5CM1xK3yS52iZQ9y1CUVfQuuSLuheVHs_iv2oqUHlU0rj1VXCqmxofV3KE85sHyNAuoPRPdDzLW6Eq6SBA14nYGjc96nin805ZEb7fwyMwOs";
const AVATAR_RIVERA = "https://lh3.googleusercontent.com/aida-public/AB6AXuDIe2xNYxlTWN-JgcK4rl94b1WvaHkSdjN2xnuDXN1duwCxTl5L3rgCcccrwEIQgvfAmtTusJeTFPaagZlySBBCPge_C-su4VgzYTEpaY9LcMXlT3ryOnLoUA1_rdP8hJgAKA24LXTcI-_FCzLraV06-EZBAVAScFzOSu-DiRd0g_tF7S7eFKXx-YrtYYNcqjuDwtguUAyuJRklSNU50yNpBVVBujem68DzWWMXtGf1m6Oq-0ieHEoAn0U1UPp6LptqXkyw32WgJbI";
const AVATAR_COMMUNITY_WATCH = "https://lh3.googleusercontent.com/aida-public/AB6AXuCcrChiw7NmSoZr7LI6scCsB-2W1C7WgPujRp56H-lmNMOcVMGNHHLFjgLJmHrFZIyLkMLw1WSMBR4XhbTiq3ufB6hyBYfmUymbz0Su4-SIrVJHExN_ZwaAt_Bp-qgEkQpxEfvNduNhOw3r9wBJTHp18wkrytuwpIurKz_0Jjw9gY8mT6S3vuY3jFBBv8DroTAPSVtTX1jmHWKWLIIEPFMma3NvHLXBECpDYXOXlIoO069b8pA3NFZAkhFEZJk-WKnrTrrOSJfd5i4";
const AVATAR_SHARMA = "https://lh3.googleusercontent.com/aida-public/AB6AXuDno3CwGoDf12Zm0srTvasCo-2saJqkhU4J7Zalnm6ecLn7a6Q-gwjjsFEDgE6KiDuy-yqhBtLPnpz0ipUkcNB8CMye56-5tyzbo6fTL-srK7-1p1epJHjp-rroQsSCpMMbJD6atH0uk2qe2j-8XpM4ncxwAuExybKh0RiMwbclmmGyijuo6qXDgKZlKLOqOU8dbUFGUirw3utXKWl9OVwnsVSz3YcHUdGltQOW7wIRzgDOVRcVK67bl2vDF3ab7GbLRg5g9GM9LQE";
const AVATAR_VARMA = "https://lh3.googleusercontent.com/aida-public/AB6AXuDccWVmwuUF9y36JiRCyQr7LGAoktBnu_svNbtbbgFx8Wcw9F1wfdpsvtwiO82t5A8CtdvCGRJaAoPLYLn2f31bJhtlDSvuSHCeGv_r9rGqmo-EViH1y0_I2rruw58k5ePWRGp97_3rPKB0HQfskLXM75gZOAYHepwPzr6TqofuXqDLEPQ0NrJRpKi9u_2Fx_FAd4ed9IZSu0ISMsA2szsWlNgpEiX0OJBz89JPBfT058jMTZiLy_GICaCN8E2z9_Nr1VcE2co3zKw";

// Seed data keys
const STORAGE_KEYS = {
  CURRENT_USER: 'civio_current_user',
  POSTS: 'civio_posts',
  COMMENTS: 'civio_comments',
  NOTIFICATIONS: 'civio_notifications'
};

// Initial User (Alex Sterling)
const initialUser: User = {
  id: "user_sterling",
  name: "Alex Sterling",
  username: "alex_sterling",
  email: "alex.sterling@example.com",
  area: "Brooklyn, NY",
  avatar: AVATAR_STERLING,
  verified: true,
  issuesReported: 9, // starts with the 9 posts in profile
  issuesSupported: 142,
  impactScore: 892
};

// Initial posts representing screenshots
const initialPosts: Post[] = [
  {
    id: "post_nearby_1",
    userId: "user_rivera",
    authorName: "Alex Rivera",
    authorAvatar: AVATAR_RIVERA,
    title: "Huge pothole on 5th Ave",
    description: "Huge pothole on 5th Ave is getting dangerous for cyclists. Multiple people nearly wiped out today. ⚠️",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC2YdktxByi_vaTeWJhPS5kGqy954HPSiG4T4_xoARW3pnlD7P6nfty3xlpOcf2STg-DjDW2niZOG6KmYRZ83KJQLuGZilpZtgEiQ9lBTh8w-J5x2iGEq1q_jb_yaVQcwahIRWlYAs0v7k-eOqxjr-AIT0aJTeU8Nj4Owc4CIRs1Fd9acq1auhtQqQq0wpMDLNHqu3BKkYmbM6SJIfSuDwP5yJo2C_-htomG3NdHK5j0X_BfZ1TQfDW0R8ltoDG7LnRnBt_IRfGDk4",
    location: { latitude: 37.7749, longitude: -122.4194 },
    geoLocation: { type: "Point", coordinates: [-122.4194, 37.7749] },
    area: "San Francisco, CA",
    distance: "0.4 km away",
    category: "Pothole",
    status: "In Progress",
    upvotes: 1200,
    commentsCount: 42,
    supportGoalPercent: 75,
    supportedBy: [],
    upvotedBy: [],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2h ago
  },
  {
    id: "post_nearby_2",
    userId: "user_community_watch",
    authorName: "Community Watch",
    authorAvatar: AVATAR_COMMUNITY_WATCH,
    title: "Streetlights out along park walkway",
    description: "Multiple streetlights are out along the park walkway. Visibility is near zero after 7 PM. Reported to city council.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCA0vfy_zz-dcRfsAF88ySpEGHzpOJeWCwPi9pAOEyKVcIMaIY3Bzl_4Ew9Qun-HH8dW5m962SoecNKwS-Zz0ZiJKrSsDw5zXjnsfk23-Rzw_hhnbEpQdnd9jeXBKd1bz9htPUxy07ZnlZUWJOI9UYyCdIOTa7cfrdQNQXup4Zh-WsX0KvadIFqZHdL6FfJAFSXbkBKT4nJ_rlgmVzRusU0z0UsdGxvc99V5vxkcSCfIhSaEAzdPMI6koUUsTITOXsU75w8XMlccKU",
    location: { latitude: 37.8077, longitude: -122.4750 },
    geoLocation: { type: "Point", coordinates: [-122.4750, 37.8077] },
    area: "San Francisco, CA",
    distance: "1.2 km away",
    category: "Lighting",
    status: "Under Review",
    upvotes: 840,
    commentsCount: 15,
    supportGoalPercent: 85,
    supportedBy: [],
    upvotedBy: [],
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() // 5h ago
  },
  {
    id: "post_feed_1",
    userId: "user_sharma",
    authorName: "Aditi Sharma",
    authorAvatar: AVATAR_SHARMA,
    title: "Massive pothole opened up after last night's rain",
    description: "Massive pothole opened up after last night's rain. Multiple bikes almost lost control. Needs urgent filling.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC2YdktxByi_vaTeWJhPS5kGqy954HPSiG4T4_xoARW3pnlD7P6nfty3xlpOcf2STg-DjDW2niZOG6KmYRZ83KJQLuGZilpZtgEiQ9lBTh8w-J5x2iGEq1q_jb_yaVQcwahIRWlYAs0v7k-eOqxjr-AIT0aJTeU8Nj4Owc4CIRs1Fd9acq1auhtQqQq0wpMDLNHqu3BKkYmbM6SJIfSuDwP5yJo2C_-htomG3NdHK5j0X_BfZ1TQfDW0R8ltoDG7LnRnBt_IRfGDk4",
    location: { latitude: 18.5362, longitude: 73.8930 },
    geoLocation: { type: "Point", coordinates: [73.8930, 18.5362] },
    area: "Koregaon Park, Lane 7",
    distance: "2.4 km away",
    category: "Pothole",
    status: "Reported",
    upvotes: 842,
    commentsCount: 124,
    supportGoalPercent: 50,
    supportedBy: [],
    upvotedBy: [],
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() // 3h ago
  },
  {
    id: "post_feed_2",
    userId: "user_varma",
    authorName: "Rahul Varma",
    authorAvatar: AVATAR_VARMA,
    title: "Overflowing garbage bins",
    description: "The bins haven't been cleared for three days. It's starting to smell and attract stray animals. #CleanCivio",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-3-gl2Wtb348WERwSlPvP6e5uOT7UQy2bbDxxAihbnC1YEZW-_jmVvkZjUHJuTUSWZBpxpJGvs51aWKjNbhlon6yVjaZ0scAXDcRx2d6dD62byLsL5JwB1u1BHRLsxY7y1eeIZDDUQIoiYB_FK76puHh-V23BNpt--OYeEv7bw0i6dy4SU6HxRzZ8zKS-tjrQOfqlfDZA04Dw9auFBC-hDK1kj9MTXytm9LtkE9MJy9BjZQ7eI-2Z4jqMIpP7TQqxomeqQuF1cmQ",
    location: { latitude: 18.5463, longitude: 73.9032 },
    geoLocation: { type: "Point", coordinates: [73.9032, 18.5463] },
    area: "Kalyani Nagar, Central Park",
    distance: "500m away",
    category: "Garbage",
    status: "Reported",
    upvotes: 321,
    commentsCount: 45,
    supportGoalPercent: 20,
    supportedBy: [],
    upvotedBy: [],
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() // 5h ago
  },
  // User's reported posts (shown in Profile posts tab)
  {
    id: "user_post_1",
    userId: "user_sterling",
    authorName: "Alex Sterling",
    authorAvatar: AVATAR_STERLING,
    title: "Cracked sidewalk walkway",
    description: "Gritty cracked sidewalk with green weeds growing through. Needs repair.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAEFA2Ij0Msi5r3qwV-WRM3HFrPIlbj2N4CPc-YgKSucngCac4lNQx1IPImPv0aJaGYoXLMtag6p2hk37mpfRSrmvbFXF6xoMeOrNBB0-xZzKWOQkRB36W7nMz-pMPE43_4hivgPq04mo_8nYWF8N1O37uAhJgR0CrF6Zgc6pJEDLVUe9M_iataY_8S53ggoG-y0aUr6ry_tCM5W3HKmQevVc_vGulVxKTGzkHxHPJbS6Co21b3kfJNVsJqOfS7XdmRUBnT3I78zi4",
    location: { latitude: 40.6782, longitude: -73.9442 },
    geoLocation: { type: "Point", coordinates: [-73.9442, 40.6782] },
    area: "Brooklyn, NY",
    distance: "0.2 km away",
    category: "Pothole",
    status: "Reported",
    upvotes: 42,
    commentsCount: 3,
    supportedBy: [],
    upvotedBy: [],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "user_post_2",
    userId: "user_sterling",
    authorName: "Alex Sterling",
    authorAvatar: AVATAR_STERLING,
    title: "Flickering neon streetlight",
    description: "Streetlight flickering continuously in the rain. High failure risk.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuALwabPED8qjIkACC6lsjPg2Yn4xE1u9IMCOTYNWIiYIrvAHvfRNs3_LGA0tvFdBF5kixG0iGCjegme0SFUFTbqoZyqgGcR2BogWffDOlRaMB2WWSPEWcMDMVHVVIY9cFc5VJH6HcnUGiZlxyFdnUHpQNPK84GGNUfr5MVJXDcy1OUg2P720Xtzj0msok5V3og1TuHam0HwT2bgV5iol-ehqYLfV5EfXv6xEvLQZS1lslp6tGIzkWqb-pErVr-u6l0_4JvdCicbLiA",
    location: { latitude: 40.6802, longitude: -73.9542 },
    geoLocation: { type: "Point", coordinates: [-73.9542, 40.6802] },
    area: "Brooklyn, NY",
    distance: "0.5 km away",
    category: "Lighting",
    status: "In Progress",
    upvotes: 112,
    commentsCount: 14,
    supportedBy: [],
    upvotedBy: [],
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "user_post_3",
    userId: "user_sterling",
    authorName: "Alex Sterling",
    authorAvatar: AVATAR_STERLING,
    title: "Overflowing designer park bin",
    description: "Trash bins in the community park overflowing with plastic waste.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAMN5vlqJ93NOq6zt3BTk5t4Iuq90qOgXJerr1StewXX5Ut7pxwTjJWGq4SGSNT7q11ap-7k9NgylY0dMOU9y8-ESiT4UvMzac3zr2lh2v81lt4TWfbjawrqXrt7R0_gV5o9YiJOe7u4fmJND1gSzimHvZid6o14CUT5tikgEZKSDLlQy3xCaGpnHXSFDbXY3cMUSmqGDZSHEwf199riXF0c7BhsN2cOuFfX9vng_ShoyFb96poV1DDL0_eka214-9MO_FZ687P_bY",
    location: { latitude: 40.6752, longitude: -73.9342 },
    geoLocation: { type: "Point", coordinates: [-73.9342, 40.6752] },
    area: "Brooklyn, NY",
    distance: "0.8 km away",
    category: "Garbage",
    status: "Resolved",
    upvotes: 215,
    commentsCount: 38,
    supportedBy: [],
    upvotedBy: [],
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "user_post_4",
    userId: "user_sterling",
    authorName: "Alex Sterling",
    authorAvatar: AVATAR_STERLING,
    title: "Neglected community garden",
    description: "Public community garden under dramatic clouds needs soil restoration.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB6SZ-PoN4ABqRieFwT-m9kQ7AsATdEPgnacRS8moXTKhCGDZ3SwuhJa9w2KDgL5Vjh-RM1zGOT6jXqrsIRgFf7oTlNWvOsk_9Ke4fVF69b-0qtSAQQ8GO6KvZANR3rcR21frDDXYkk_2pHb6yIA6e2tbm7y1fvtrdov1qhDQMDJFc8Sc8JUXpHzDsfAtIr41BgE5BcjvcU9z22Xsbgw0YqzH6aGhGOMZOue2T8uk7srAugIa7zkRWp9e1msKoW8VJ411oJ42ArgOM",
    location: { latitude: 40.6882, longitude: -73.9642 },
    geoLocation: { type: "Point", coordinates: [-73.9642, 40.6882] },
    area: "Brooklyn, NY",
    distance: "1.1 km away",
    category: "Water",
    status: "Under Review",
    upvotes: 75,
    commentsCount: 9,
    supportedBy: [],
    upvotedBy: [],
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "user_post_5",
    userId: "user_sterling",
    authorName: "Alex Sterling",
    authorAvatar: AVATAR_STERLING,
    title: "Broken cast iron park bench",
    description: "Cast iron park bench broken, surrounded by autumn leaves. Dangerous.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD37L1STqUbGfueDU0HwlO3XAh3kNUnoYh2i9Oi6kFBuiPHvtyVrIgLkjG3ar5rzTKRJzfskeCmY18LkmX-V_ZYRs_uheS7dIoAJv0HAMpfzdRnP0KUot9br_GEQY5j3DSV6_bdxypvSDme4IQaEEHrxxBgtIq4BHAslq933OkTqM0JGmg__TIMKb9VXu5rFD37Or6jaSHDFxssQdpuGMXUDoIqBP7aUF6GrmMMLirC-LipAxOt02h1Wn4B33sYTkvuy-rU_bSqouE",
    location: { latitude: 40.6722, longitude: -73.9242 },
    geoLocation: { type: "Point", coordinates: [-73.9242, 40.6722] },
    area: "Brooklyn, NY",
    distance: "1.3 km away",
    category: "Pothole",
    status: "Reported",
    upvotes: 95,
    commentsCount: 12,
    supportedBy: [],
    upvotedBy: [],
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "user_post_6",
    userId: "user_sterling",
    authorName: "Alex Sterling",
    authorAvatar: AVATAR_STERLING,
    title: "Dangerous pothole in bike lane",
    description: "Huge hole in the center of the bike lane. Visibility is poor.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBUPWkY6fsufI-SCqCDzNi8PfUcr2mbDEq_wX5XeD4EhzhhuDoHXU4iBYYKuJPAMpgCeHcCcvH9-MHbO86s0BRMvgyqUnQHXYHh-zJ5qiZ0cIdOu8mYMqC7Mqa_FO43tfuJ55ire1lL3koRGkQuFl4-rRWG3xxypAoCEJnZKvsd4dc53udDRqRe9xixJKbJyL-9xaXTHbnS6S78wQUTiqOl2qImdgAc3EpwVM5WQokQjtXhalXa6sqAtu1-1uI7YU3D4AUrPo40fC4",
    location: { latitude: 40.6692, longitude: -73.9142 },
    geoLocation: { type: "Point", coordinates: [-73.9142, 40.6692] },
    area: "Brooklyn, NY",
    distance: "1.7 km away",
    category: "Pothole",
    status: "Resolved",
    upvotes: 180,
    commentsCount: 22,
    supportedBy: [],
    upvotedBy: [],
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "user_post_7",
    userId: "user_sterling",
    authorName: "Alex Sterling",
    authorAvatar: AVATAR_STERLING,
    title: "Peeling facade paint on historical library",
    description: "Peeling paint and plaster chunks falling from the public facade.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDn0XYTlv-fW7O1c3YViN6opfHE6Z17j0tZnAo948ob_nSxJO84R764C6MhIAkEdx5dMrxMP10iJf5Sn2IRjK4p2Tay0UzBlLbsJCWhVwmdy6kIIrMsbfnOD1Q3yuu-6anxjQbG6eoRxc56Ga_YRxjCAT34V0oyHeqlSbFqFiaBp3wd2tTblvN8BE-2uBubjpWuCdoGGS_R9Jr2H3tHREW0tt8DgN-7m-BgZjT-K_0bS5ylqERzWxdsFrlD7_ZIxpn4fKc-6MOCxWc",
    location: { latitude: 40.6732, longitude: -73.9302 },
    geoLocation: { type: "Point", coordinates: [-73.9302, 40.6732] },
    area: "Brooklyn, NY",
    distance: "0.6 km away",
    category: "Pothole",
    status: "Under Review",
    upvotes: 56,
    commentsCount: 6,
    supportedBy: [],
    upvotedBy: [],
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "user_post_8",
    userId: "user_sterling",
    authorName: "Alex Sterling",
    authorAvatar: AVATAR_STERLING,
    title: "Vandalized bus shelter glass",
    description: "Shattered glass panel at the bus shelter on the main avenue corner.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBS6_agehK35Gg4KMEj-ndidYFiSD2pR2vBDgFWJgErTWmvBJhfbwkv_EnE3_MwzQqpPn73JLmcEw_KF-NE9RjP4h6E8t2nx0HMsCIGV8FGhbwHC884qGIvNKQXl6nhqfgWoZy_PUWSvRNwQEI6ujFDsbHWZeAJL6_V2_jqxSJUVB6u85FFUAbg8YEX2mM8oAWLmtUkRJOmq-dMoPT6CRlAExpgMJdKdShK5zAwTicBVAir6yTMMZIKma6niX-SxhtWQANLtLfJ8zI",
    location: { latitude: 40.6842, longitude: -73.9482 },
    geoLocation: { type: "Point", coordinates: [-73.9482, 40.6842] },
    area: "Brooklyn, NY",
    distance: "0.3 km away",
    category: "Lighting",
    status: "In Progress",
    upvotes: 140,
    commentsCount: 18,
    supportedBy: [],
    upvotedBy: [],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "user_post_9",
    userId: "user_sterling",
    authorName: "Alex Sterling",
    authorAvatar: AVATAR_STERLING,
    title: "Severely rusted fire hydrant",
    description: "Rusted fire hydrant. Iron flakes peeling off. Needs painting/check.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuBtVWlEGoUw-M4JLWeFiY6GarNfZ9ozGRQ1L2b26O--q6i1uwLtZfiHk03xd2f_DkOnbKkdhoDDFs5L4cbUEUZo39tYfq_J88HnpPUhT72KNyZ3tnPzvoo92tetPYpdclhM6LHvhvlCQNzRzgA8uZ2BwAdAjPYtSlBxFnhTQkTFqauIKwT-1bLIBx1be5S5Gy-MVazI_DMuD9QbclmWi0qVnoLmKUgpDaUr9Pj7TZKS62cUQpCjFy1l6Qh7ifJYRl9B3-h9dbRFEKQ",
    location: { latitude: 40.6762, longitude: -73.9382 },
    geoLocation: { type: "Point", coordinates: [-73.9382, 40.6762] },
    area: "Brooklyn, NY",
    distance: "0.9 km away",
    category: "Water",
    status: "Reported",
    upvotes: 49,
    commentsCount: 5,
    supportedBy: [],
    upvotedBy: [],
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Initial comments
const initialComments: Comment[] = [
  {
    id: "comm_1",
    postId: "post_nearby_1",
    userId: "user_sterling",
    username: "alex_sterling",
    avatar: AVATAR_STERLING,
    content: "Almost tripped here yesterday on my bike! Thanks for posting.",
    createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "comm_2",
    postId: "post_feed_1",
    userId: "user_sterling",
    username: "alex_sterling",
    avatar: AVATAR_STERLING,
    content: "Rained again today and now the hole is twice as deep! Please report to ward office.",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  }
];

// Initial notifications
const initialNotifications: Notification[] = [
  {
    id: "notif_1",
    userId: "user_sterling",
    type: "support",
    title: "New Support Received",
    message: "Your report 'Cracked sidewalk walkway' was supported by Rahul and 12 others.",
    read: false,
    createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString() // 20m ago
  },
  {
    id: "notif_2",
    userId: "user_sterling",
    type: "comment",
    title: "New Comment",
    message: "Rahul Varma commented on your post 'Cracked sidewalk walkway'.",
    read: false,
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString() // 45m ago
  },
  {
    id: "notif_3",
    userId: "user_sterling",
    type: "trending",
    title: "Trending Nearby Issue",
    message: "A major water leakage on 8th Ave has gathered 200 supports in 1 hour.",
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2h ago
  },
  {
    id: "notif_4",
    userId: "user_sterling",
    type: "resolve",
    title: "Issue Resolved",
    message: "Good news! The municipality marked your report 'Overflowing designer park bin' as Resolved.",
    read: true,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "notif_5",
    userId: "user_sterling",
    type: "milestone",
    title: "Community Milestone Reached",
    message: "Congratulations! You helped resolve 10 civic issues in Brooklyn this month.",
    read: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Initialize storage helper
function initStorage() {
  if (!safeStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
    safeStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(initialUser));
  }
  if (!safeStorage.getItem(STORAGE_KEYS.POSTS)) {
    safeStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(initialPosts));
  }
  if (!safeStorage.getItem(STORAGE_KEYS.COMMENTS)) {
    safeStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(initialComments));
  }
  if (!safeStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
    safeStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(initialNotifications));
  }
}

// Latency simulator
const delay = <T>(value: T): Promise<T> => {
  return new Promise(resolve => setTimeout(() => resolve(value), 300));
};

export const mockApi = {
  // Current user operations
  getCurrentUser: async (): Promise<User> => {
    initStorage();
    const user = safeStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return delay(user ? JSON.parse(user) : initialUser);
  },

  updateCurrentUser: async (fields: Partial<User>): Promise<User> => {
    initStorage();
    const user = await mockApi.getCurrentUser();
    const updated = { ...user, ...fields };
    safeStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updated));
    return delay(updated);
  },

  // Post operations
  getPosts: async (): Promise<Post[]> => {
    initStorage();
    const posts = safeStorage.getItem(STORAGE_KEYS.POSTS);
    return delay(posts ? JSON.parse(posts) : initialPosts);
  },

  createPost: async (postData: Omit<Post, 'id' | 'createdAt' | 'upvotes' | 'commentsCount' | 'supportedBy' | 'upvotedBy'>): Promise<Post> => {
    initStorage();
    const posts = await mockApi.getPosts();
    const user = await mockApi.getCurrentUser();

    const newPost: Post = {
      ...postData,
      id: `post_${Date.now()}`,
      upvotes: 0,
      commentsCount: 0,
      supportedBy: [],
      upvotedBy: [],
      createdAt: new Date().toISOString()
    };

    posts.unshift(newPost);
    safeStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));

    // Community scoring: +10 for reporting
    await mockApi.updateCurrentUser({
      issuesReported: user.issuesReported + 1,
      impactScore: user.impactScore + 10
    });

    return delay(newPost);
  },

  updatePost: async (postId: string, fields: Partial<Post>): Promise<Post> => {
    initStorage();
    const posts = await mockApi.getPosts();
    const index = posts.findIndex(p => p.id === postId);
    if (index === -1) throw new Error("Post not found");

    const oldPost = posts[index];
    const updatedPost = { ...oldPost, ...fields };

    // Community scoring: +25 if status transitions to Resolved
    if (fields.status === 'Resolved' && oldPost.status !== 'Resolved') {
      const user = await mockApi.getCurrentUser();
      await mockApi.updateCurrentUser({
        impactScore: user.impactScore + 25
      });
    }

    posts[index] = updatedPost;
    safeStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    return delay(updatedPost);
  },

  supportIssue: async (postId: string, userId: string): Promise<Post> => {
    initStorage();
    const posts = await mockApi.getPosts();
    const index = posts.findIndex(p => p.id === postId);
    if (index === -1) throw new Error("Post not found");

    const post = posts[index];
    const hasSupported = post.supportedBy.includes(userId);

    const user = await mockApi.getCurrentUser();

    if (hasSupported) {
      // Remove support
      post.supportedBy = post.supportedBy.filter(id => id !== userId);
      post.upvotes = Math.max(0, post.upvotes - 1);
      if (post.supportGoalPercent !== undefined) {
        post.supportGoalPercent = Math.max(0, post.supportGoalPercent - 1);
      }
      
      if (userId === user.id) {
        await mockApi.updateCurrentUser({
          issuesSupported: Math.max(0, user.issuesSupported - 1),
          impactScore: Math.max(0, user.impactScore - 2)
        });
      }
    } else {
      // Add support
      post.supportedBy.push(userId);
      post.upvotes += 1;
      if (post.supportGoalPercent !== undefined) {
        post.supportGoalPercent = Math.min(100, post.supportGoalPercent + 1);
      }

      if (userId === user.id) {
        // Community scoring: +2 for supporting
        await mockApi.updateCurrentUser({
          issuesSupported: user.issuesSupported + 1,
          impactScore: user.impactScore + 2
        });

        // Trigger Notification
        const notif: Notification = {
          id: `notif_${Date.now()}`,
          userId: post.userId, // goes to post author
          type: "support",
          title: "New Support Received",
          message: `${user.name} supported your issue: "${post.title}"`,
          read: false,
          createdAt: new Date().toISOString()
        };
        await mockApi.createNotification(notif);
      }
    }

    posts[index] = post;
    safeStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    return delay(post);
  },

  upvoteIssue: async (postId: string, userId: string): Promise<Post> => {
    initStorage();
    const posts = await mockApi.getPosts();
    const index = posts.findIndex(p => p.id === postId);
    if (index === -1) throw new Error("Post not found");

    const post = posts[index];
    const hasUpvoted = post.upvotedBy?.includes(userId) ?? false;

    if (!post.upvotedBy) {
      post.upvotedBy = [];
    }

    if (hasUpvoted) {
      post.upvotedBy = post.upvotedBy.filter(id => id !== userId);
      post.upvotes = Math.max(0, post.upvotes - 1);
    } else {
      post.upvotedBy.push(userId);
      post.upvotes += 1;
    }

    posts[index] = post;
    safeStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    return delay(post);
  },

  // Comment operations
  getComments: async (postId: string): Promise<Comment[]> => {
    initStorage();
    const comments = safeStorage.getItem(STORAGE_KEYS.COMMENTS);
    const list: Comment[] = comments ? JSON.parse(comments) : initialComments;
    return delay(list.filter(c => c.postId === postId));
  },

  addComment: async (postId: string, commentData: Omit<Comment, 'id' | 'createdAt'>): Promise<Comment> => {
    initStorage();
    const commentsRaw = safeStorage.getItem(STORAGE_KEYS.COMMENTS);
    const comments: Comment[] = commentsRaw ? JSON.parse(commentsRaw) : initialComments;

    const newComment: Comment = {
      ...commentData,
      id: `comm_${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    comments.push(newComment);
    safeStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));

    // Update comment count on post
    const posts = await mockApi.getPosts();
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex !== -1) {
      posts[postIndex].commentsCount += 1;
      safeStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));

      // Trigger notification for comment
      const user = await mockApi.getCurrentUser();
      const notif: Notification = {
        id: `notif_${Date.now()}`,
        userId: posts[postIndex].userId,
        type: "comment",
        title: "New Comment",
        message: `${user.username} commented on your post: "${posts[postIndex].title}"`,
        read: false,
        createdAt: new Date().toISOString()
      };
      await mockApi.createNotification(notif);
    }

    return delay(newComment);
  },

  // Notification operations
  getNotifications: async (): Promise<Notification[]> => {
    initStorage();
    const notifs = safeStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return delay(notifs ? JSON.parse(notifs) : initialNotifications);
  },

  createNotification: async (notif: Notification): Promise<Notification> => {
    initStorage();
    const notifs = await mockApi.getNotifications();
    notifs.unshift(notif);
    safeStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    return notif;
  },

  markNotificationsAsRead: async (): Promise<void> => {
    initStorage();
    const notifs = await mockApi.getNotifications();
    const updated = notifs.map(n => ({ ...n, read: true }));
    safeStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(updated));
    return delay(undefined);
  }
};

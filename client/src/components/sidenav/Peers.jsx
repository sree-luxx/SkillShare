import UserCard from "../UserCard";

const mockPeers = [
  {
    id: 1,
    name: "Ava Patel",
    title: "Product Manager at NovaWorks",
    primarySkill: "Product Management",
    rating: 4.7,
    mutual: 8,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ava",
    bio: "Bridging product, design, and engineering to ship great experiences.",
  },
  {
    id: 2,
    name: "Diego Morales",
    title: "Frontend Engineer at PixelCraft",
    primarySkill: "Frontend Engineering",
    rating: 4.8,
    mutual: 14,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Diego",
    bio: "Building delightful, performant UIs with React and TypeScript.",
  },
  {
    id: 3,
    name: "Hana Suzuki",
    title: "UX Researcher at Sensei Labs",
    primarySkill: "UX Research",
    rating: 4.6,
    mutual: 5,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hana",
    bio: "Turning user insights into clear product direction.",
  },
  {
    id: 4,
    name: "Omar Rahman",
    title: "Data Scientist at InsightHub",
    primarySkill: "Data Science",
    rating: 4.9,
    mutual: 11,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Omar",
    bio: "ML practitioner focused on practical analytics and experimentation.",
  },
  {
    id: 5,
    name: "Lena Fischer",
    title: "Marketing Strategist at BrightPath",
    primarySkill: "Marketing Strategy",
    rating: 4.5,
    mutual: 7,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lena",
    bio: "Helping brands grow through narrative and experimentation.",
  },
  {
    id: 6,
    name: "Kwame Mensah",
    title: "Cloud Architect at Skyline",
    primarySkill: "Cloud Architecture",
    rating: 4.8,
    mutual: 9,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kwame",
    bio: "Designing resilient, scalable cloud systems.",
  },
];

const Peers = () => {
  return (
    <div className="min-h-screen">
      <main className=" p-8 animate-fade-in">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold">Your Network</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockPeers.map((peer) => (
              <UserCard
                key={peer.id}
                user={peer}
                onViewProfile={() => {}}
                footerContent={
                  <div className="flex justify-between items-center text-sm text-gray-600 px-2">
                    <span className="font-medium text-[#c0264a]">{peer.mutual} mutual</span>
                    <span className="text-gray-500 truncate">{peer.title}</span>
                  </div>
                }
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Peers;
import { Outlet, useNavigate } from "react-router-dom";

const Communities = () => {
  const navigate = useNavigate();

  const allCommunities = [
  {
    name: "IT",
    image: "/images/it.jpg",
    description: "A community for tech enthusiasts.",
    members: 1200,
  },
  {
    name: "Machine Learning",
    image: "/images/ml.jpg",
    description: "Learn ML, AI and build models.",
    members: 980,
  },
  {
    name: "Design",
    image: "/images/design.jpg",
    description: "UI/UX and product design.",
    members: 760,
  },
  {
    name: "Business",
    image: "/images/business.jpg",
    description: "Startup, business knowledge, leadership.",
    members: 540,
  },
];


  return (
    <div className="min-h-screen p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Communities</h1>
        <button className="px-4 py-2 rounded-full bg-[#fda4b8] text-white font-semibold shadow hover:shadow-lg transition">
          Create Community
        </button>
      </div>

      <div className="grid grid-cols-2 gap-5">
        {allCommunities.map((community) => (
          <div
            key={community.name}
            onClick={() => navigate(`/links/community/${community.name}`)}
            className="cursor-pointer bg-white rounded-xl shadow-lg overflow-hidden border border-[#ffd2dd] hover:shadow-xl transition"
          >
            {/* Community Image */}
            <img
              src={community.image}
              alt={community.name}
              className="h-32 w-full object-cover"
            />

            <div className="p-4">
              <h2 className="text-xl font-semibold">{community.name}</h2>
              <p className="text-gray-600 mt-1 line-clamp-2">{community.description}</p>

              <p className="text-xs text-gray-500 mt-3">
                {community.members} members
              </p>
            </div>
          </div>
        ))}
      </div>
      <Outlet />
    </div>
  );
};

export default Communities;

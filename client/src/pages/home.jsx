const Home = () => {
 
return (
  <div className="min-h-screen bg-gradient-to-br from-[#1A120B] via-[#3C2A21] to-[#0F3D3E] flex items-center justify-center p-10">

    <div className="max-w-5xl w-full bg-white/10 backdrop-blur-lg border border-white/10 rounded-3xl shadow-2xl p-10">

      <h1 className="text-6xl font-extrabold text-orange-400 mb-6 tracking-wide">
        OpenLibrary Hub
      </h1>

      <p className="text-gray-200 text-xl leading-9 mb-10">
        Welcome to OpenLibrary Hub, a modern ebook platform where users
        can explore, read, and manage digital books with a smooth and
        simple reading experience. Discover books from programming,
        technology, self-growth, business, spirituality, and many more.
      </p>

      <div className="grid md:grid-cols-2 gap-8">

        {/* Card 1 */}
        <div className="bg-[#1E5128] rounded-2xl p-7 shadow-xl hover:scale-105 transition duration-300 border border-green-400/20">

          <h2 className="text-3xl font-bold text-orange-300 mb-4">
            Read Anytime
          </h2>

          <p className="text-green-100 leading-8 text-lg">
            Access ebooks anytime and continue learning with a clean,
            distraction-free reading environment designed for students
            and passionate readers.
          </p>

        </div>

        {/* Card 2 */}
        <div className="bg-[#4E944F] rounded-2xl p-7 shadow-xl hover:scale-105 transition duration-300 border border-orange-300/20">

          <h2 className="text-3xl font-bold text-orange-100 mb-4">
            Explore Categories
          </h2>

          <p className="text-white leading-8 text-lg">
            Browse books from multiple domains and discover content that
            matches your interests, learning goals, and career growth.
          </p>

        </div>

      </div>

    </div>

  </div>
);
};

export default Home;
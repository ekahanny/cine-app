import bgImage from "../../assets/images/bg-img.jpg";

export function Hero() {
  return (
    <>
      <div
        className="hero min-h-screen"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content text-neutral-content text-center">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold italic">CineApp</h1>
            <p className="my-5">
              Welcome to CineApp! Discover and explore the latest, most popular,
              or curated movie selections. Enhance your movie-watching
              experience by finding your favorite films right here!
            </p>
            <button className="btn btn-primary">Get Started</button>
          </div>
        </div>
      </div>
    </>
  );
}

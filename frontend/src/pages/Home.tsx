import Archive from "../components/Archive";
import Hero from "../components/Hero";
import OurStory from "../components/OurStory";

const Home = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <Hero />
            <Archive />
            <OurStory />
        </div>
    );
};

export default Home;
import { useFact } from "../../context/factContext";
import FeedDiscover from "./FeedDiscover";
import FeedFollowing from "./FeedFollowing";
import FeedFollows from "./FeedFollows";
import FeedLogin from "./FeedLogin";
import FeedProfile from "./FeedProfile";
import FeedSaved from "./FeedSaved";

const MainFeed = () => {
    var { sideMenuCurrentSelection } = useFact();
    switch (sideMenuCurrentSelection) {
        case "discover":
            return <FeedDiscover />;
        case "profile":
            return <FeedProfile />;
        case "login":
            return <FeedLogin />;
        case "saved":
            return <FeedSaved />;
        case "following":
            return <FeedFollowing />;
        case "follows":
            return <FeedFollows />;
    }
};

export default MainFeed;

import { Button } from "@/components/ui/button";
import { Link } from "react-router";

function HomePage() {
  return (
    <div>
      <Link to="/search">
        <Button>Go to search page</Button>
      </Link>
    </div>
  );
}

export default HomePage;

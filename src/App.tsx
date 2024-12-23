import { Input } from "@/components/ui/input";
import "./App.css";

function App() {
  return (
    <div className="w-screen h-screen p-4">
      <div className="flex flex-col w-full">
        <div>
          <Input placeholder="search"></Input>
        </div>
      </div>
    </div>
  );
}

export default App;

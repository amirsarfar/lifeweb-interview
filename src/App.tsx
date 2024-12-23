import { Input } from "@/components/ui/input";
import "./App.css";
import { RangePicker } from "@/components/range-picker";

function App() {
  return (
    <div className="w-screen h-screen p-4">
      <div className="flex flex-col w-full">
        <div className="flex flex-col gap-4">
          <Input placeholder="search"></Input>
          <RangePicker></RangePicker>
        </div>
      </div>
    </div>
  );
}

export default App;

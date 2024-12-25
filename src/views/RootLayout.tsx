import { Outlet } from "react-router";

function RootLayout() {
  return (
    <div className="w-screen h-screen p-4 flex justify-center">
      <div className="w-full h-full max-w-screen-xl">
        <Outlet></Outlet>
      </div>
    </div>
  );
}

export default RootLayout;

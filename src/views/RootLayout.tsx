import { Outlet } from "react-router";

function RootLayout() {
  return (
    <div className="w-screen h-screen p-4 flex justify-center">
      <div className="flex flex-col gap-4 w-full h-full xl:flex-row max-w-screen-xl">
        <Outlet></Outlet>
      </div>
    </div>
  );
}

export default RootLayout;

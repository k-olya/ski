import { IoSettingsSharp } from "react-icons/io5";
import { useDispatch } from "app/hooks";
import { setScreen } from "../slice";

export const Main = () => {
  const dispatch = useDispatch();
  return (
    <div className="w-full h-full">
      <div
        className="cursor-pointer fixed top-2 right-2 rounded-lg bg-opacity-50 bg-black text-white p-4 text-4xl active:bg-opacity-25"
        onClick={() => dispatch(setScreen("settings"))}
      >
        <IoSettingsSharp />
      </div>
    </div>
  );
};

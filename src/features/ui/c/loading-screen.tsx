import { useProgress } from "@react-three/drei"

export const LoadingScreen = () => {
  const { progress } = useProgress();
  const p = Math.round(progress);
  return (
    <div className="fixed top-0 left-0 w-full h-screen z-[10000] bg-gray-900 flex flex-col items-center justify-center text-white">
    <div>Загрузка: {p}%</div>
    <div className="mt-2 w-48 h-0.5 relative bg-white" style={{width: p}}></div></div>
  );
};

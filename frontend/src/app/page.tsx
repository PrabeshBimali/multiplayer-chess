import CreateNewGameModal from "./ui/components/CreateNewGameModal";

export default function Home() {
  return (
    <> 
      <CreateNewGameModal/>
      <div className="flex justify-center items-center">
        <div className="bg-gray-800 p-10">
          <button className="cursor-pointer bg-lime-600 text-white font-bold text-xl p-3 rounded-sm">Create new game</button>
        </div>
      </div>
    </>
  );
}

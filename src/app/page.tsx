import Game from "@/components/Game";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="bg-[#ECEFF3] dark:bg-black min-h-screen text-center pt-10 text-xl">
      <div>
        <ThemeToggle />
      </div>
      <Game />
    </div>
  );
}

import { Input } from "@/components/ui/input";

export default function Layout() {
  return (
    <>
      <main className="flex grow p-4">
        <div className="w-1/3 grow">
          <Input />
        </div>
        <div className="w-full grow">
          <ul className="flex flex-col gap-4 px-4">
            <li className="bg-stone-400 p-4">Item 1</li>
            <li className="bg-stone-400 p-4">Item 2</li>
            <li className="bg-stone-400 p-4">Item 3</li>
            <li className="bg-stone-400 p-4">Item 4</li>
            <li className="bg-stone-400 p-4">Item 5</li>
          </ul>
        </div>
      </main>
      <footer></footer>
    </>
  );
}

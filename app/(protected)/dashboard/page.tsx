import ReviewCard from "@/components/ReviewCard";
import { Input } from "@/components/ui/input";

export default function Layout() {
  const Review = {
    company: {
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMjDUu5Cugm9VpGLWK5FN-c6zwi9Y1x8DZGA&s",
      name: "1337",
      location: "Khouribga",
    },
    review: {
      rating: 5,
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque. Duis vulputate commodo lectus, ac blandit elit tincidunt id.",
      createdAt: "2021-09-01",
    },
  };
  return (
    <>
      <main className="flex grow p-4">
        <div className="w-1/3 grow">
          <Input />
        </div>
        <div className="w-full grow">
          <ul className="flex flex-col gap-4 px-4">
            <ReviewCard Review={Review} />
          </ul>
        </div>
      </main>
      <footer></footer>
    </>
  );
}

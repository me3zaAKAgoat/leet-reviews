import ReviewCard from "@/components/ReviewCard";
import Reviews from "@/components/reviews";
import { Input } from "@/components/ui/input";

export default function Layout() {
  // get the reviews from db since we are on the server and pass them to the Reviews component
  return (
    <>
      <Reviews />
    </>
  );
}

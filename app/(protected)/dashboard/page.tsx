import Reviews from "@/components/reviews";

export default function Layout() {
  // get the reviews from db since we are on the server and pass them to the Reviews component
  return (
    <>
      <Reviews />
    </>
  );
}

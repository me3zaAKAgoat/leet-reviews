import { signIn } from "@/lib/auth";

const quotes = [
  {
    main: "Rate Your Experience",
    sub: "Share your insights and help fellow students make informed decisions about their internships and work placements.",
  },
];

export default function NotSignIn() {
  const selectedQuote = quotes[Math.floor(Math.random() * quotes.length)];
  return (
    <section className="py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6 flex flex-col items-center text-center space-y-6">
        <div className="flex flex-col space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl">
            {selectedQuote.main}
          </h1>
          <p className="md:text-xl ">{selectedQuote.sub}</p>
        </div>

        <div className="flex flex-col  justify-center gap-2 sm:flex-row">
          <form
            action={async () => {
              "use server";
              await signIn("42-school");
            }}
          >
            <button className="w-full flex gap-2 h-12  animate-background-shine bg-yellow-600 items-center justify-center rounded-md border border-yellow-700-800 bg-[linear-gradient(110deg,#1a1406,45%,#312a1e,55%,#1a1406)] bg-[length:200%_100%] px-6 font-medium text-gray-400 transition-colors focus:outline-none focus:ring-1 focus:ring-yellow-600 focus:ring-offset-2 focus:ring-offset-yellow-50">
              <_42Icon className="h-5 w-5" />
              Sign In with your intra
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

function _42Icon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M0.799988 15.3149H9.05249V19.4499H13.17V11.9774H4.93249L13.17 3.72241H9.05249L0.799988 11.9774V15.3149Z"
        fill="white"
      />
      <path
        d="M14.9475 7.85491L19.0675 3.72241H14.9475V7.85491Z"
        fill="white"
      />
      <path
        d="M19.0675 7.85491L14.9475 11.9774V16.0974H19.0675V11.9774L23.2 7.85491V3.72241H19.0675V7.85491Z"
        fill="white"
      />
      <path d="M23.2 11.9775L19.0675 16.0975H23.2V11.9775Z" fill="white" />
    </svg>
  );
}

import subfooter from "../../assets/images/subfooter.png";

export default function SubFooter() {
  return (
    <div
      className="w-full h-80 bg-no-repeat bg-cover flex flex-col items-center justify-center"
      style={{ backgroundImage: `url(${subfooter})` }}
    >
      <div className="flex flex-col justify-center items-center gap-2">
        <h4 className="font-medium text-[40px] leading-7.5">
          Join Our Newsletter
        </h4>
        <p className="text-[18px] leading-7.5">
          Sign up for deals, new products and promotions
        </p>
      </div>
      <form className="w-122 bg-green-500" onSubmit={(e) => e.preventDefault()}>
        <img src="" alt="" />
        <input placeholder="Email address" type="text" />
        <button>SignUp</button>
      </form>
    </div>
  );
}

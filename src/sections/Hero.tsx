export default function Hero() {
  return (
    <section className="max-w-310 mx-auto px-5">
      <div className="w-full my-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:gap-10">
        <h1 className="w-full lg:w-[50%] text-[36px]/[40px] sm:text-[56px]/[60px] lg:text-[72px]/[76px] font-medium tracking-[-1px] lg:tracking-[-2px]">
          Simply Unique<span className="text-[#6C7275]">/</span> <br />
          Simply Better<span className="text-[#6C7275]">.</span>
        </h1>
        <p className="w-full lg:w-[50%] text-[14px]/[22px] sm:text-[16px]/[24px] lg:text-[18px]/[26px]">
          <span className="font-semibold">3legant</span> is a gift & decorations
          store based in HCMC, Vietnam. Est since 2019.
        </p>
      </div>
    </section>
  );
}

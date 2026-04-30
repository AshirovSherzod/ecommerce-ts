import Sidebar from "@/sections/Sidebar";
import { useState } from "react";
import { CiSearch, CiShoppingCart } from "react-icons/ci";
import { LuMenu } from "react-icons/lu";
import { PiUserCircleLight } from "react-icons/pi";
import { Link, NavLink } from "react-router-dom";

export default function Header() {
	const [sidebar, setSidebar] = useState<boolean>(false);

	return (
		<header className="border-b border-[#F3F5F7]">
			<div className="container px-5 mx-auto flex justify-between items-center py-5">
				<div className="flex gap-1 items-center">
					<button
						className="sm:hidden text-xl"
						onClick={() => setSidebar(true)}
					>
						<LuMenu />
					</button>
					<h1 className="font-medium text-2xl">
						<NavLink to={"/"}>
							3legant<span className="text-[#6C7275]">.</span>
						</NavLink>
					</h1>
				</div>
				<div className="">
					<ul className="hidden sm:flex  gap-10 text-[#6C7275] font-medium">
						<li className="hover:text-black">
							<NavLink to={"/"}>Home</NavLink>
						</li>
						<li className="hover:text-black cursor-pointer">
							<NavLink to={"/shop"}>Shop</NavLink>
						</li>
						<li className="hover:text-black cursor-pointer">
							<NavLink to={"/blog"}>Blog</NavLink>
						</li>
						<li className="hover:text-black">
							<Link to={"/contact"}>Contact Us</Link>
						</li>
					</ul>
				</div>
				<div className="flex gap-5 items-center">
					<button className="w-6 h-6 flex items-center">
						<CiSearch className="text-2xl" />
					</button>
					<button className="w-6 h-6">
						<PiUserCircleLight className="text-2xl" />
					</button>
					<button className="w-6 h-6">
						<CiShoppingCart className="text-2xl" />
					</button>
				</div>
			</div>
			{sidebar && (
				<Sidebar sidebar={sidebar} setSidaber={setSidebar}>
					<div className="">
						<form
							onChange={(e: React.ChangeEvent<HTMLFormElement>) =>
								e.preventDefault()
							}
						>
							<button>
								<CiSearch />
							</button>
							<input type="text" />
						</form>
						<ul className="">
							<li>Home</li>
							<li>Shop</li>
							<li>Blog</li>
							<li>Contact Us</li>
						</ul>
					</div>
				</Sidebar>
			)}
		</header>
	);
}

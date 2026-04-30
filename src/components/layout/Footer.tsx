import instagram from "../../assets/icons/instagram-icon.png";
import facebook from "../../assets/icons/facebook-icon.png";
import youtube from "../../assets/icons/youtube-icon.png";
import { Link } from "react-router-dom";
import SubFooter from "@/sections/SubFooter";

export default function Footer() {
	return (
		<footer className="">
			<SubFooter />
			<div className="bg-black py-15">
				<div className="container mx-auto px-5 text-white flex flex-col gap-15">
					<div className="flex items-center justify-between">
						<div className="flex flex-row items-center gap-5 ">
							<h4 className="text-2xl">
								3legant<span className="text-[#6C7275]">.</span>
							</h4>
							<div className="w-px h-6 bg-[#6C7275]"></div>
							<p>Gift & Decoration Store</p>
						</div>
						<div className="">
							<ul className="flex gap-10 text-[#FEFEFE] text-[14px]">
								<li className="">
									<Link to={"/"}>Home</Link>
								</li>
								<li className="">
									<Link to={"/shop"}>Shop</Link>
								</li>
								<li className="">
									<Link to={"/blog"}>Blog</Link>
								</li>
								<li className="">
									<Link to={"/contact"}>Contact Us</Link>
								</li>
							</ul>
						</div>
					</div>
					<div className="flex items-center justify-between border-t pt-4 border-[#6C7275]">
						<div className="flex items-center gap-7">
							<p>Copyright © 2023 3legant. All rights reserved</p>
							<p className="font-semibold">Privacy Policy</p>
							<p className="font-semibold">Terms of Use</p>
						</div>
						<div className="flex items-center gap-6">
							<img src={instagram} alt="instagram-icon" />
							<img src={facebook} alt="facebook-icon" />
							<img src={youtube} alt="youtube-icon" />
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}

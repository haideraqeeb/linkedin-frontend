import Image from "next/image";
import Link from "next/link";
import Modal from "./Settings/Modal";

const Footer = ({ setChatBoxSettings, chatBoxSettings }: any) => {
  return (
    <>
      <div className="container flex min-h-[72px] items-center justify-between border-t border-[#D2D2D2] px-4 pb-3 pt-5 lg:min-h-[72px] lg:px-0 lg:py-5">
        <Modal
          setChatBoxSettings={setChatBoxSettings}
          chatBoxSettings={chatBoxSettings}
        />
        <div className="flex items-center gap-3">
          <Link
            href={"https://github.com/assafelovic/gpt-researcher"}
            target="_blank"
          >
            <Image
              src={"/img/github.svg"}
              alt="github"
              width={30}
              height={30}
            />{" "}
          </Link>
          <Link href={"https://discord.gg/QgZXvJAccX"} target="_blank">
            <Image
              src={"/img/discord.svg"}
              alt="discord"
              width={30}
              height={30}
            />{" "}
          </Link>
          <Link
            href={"https://hub.docker.com/r/gptresearcher/gpt-researcher"}
            target="_blank"
          >
            <Image
              src={"/img/docker.svg"}
              alt="docker"
              width={30}
              height={30}
            />{" "}
          </Link>
        </div>
      </div>
    </>
  );
};

export default Footer;
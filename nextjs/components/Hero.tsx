import Image from "next/image";
import { FC } from "react";
import InputArea from "./InputArea";

type THeroProps = {
  promptValue: string;
  setPromptValue: React.Dispatch<React.SetStateAction<string>>;
  handleDisplayResult: () => void;
};

const Hero: FC<THeroProps> = ({
  promptValue,
  setPromptValue,
  handleDisplayResult,
}) => {
  const handleClickSuggestion = (value: string) => {
    setPromptValue(value);
  };

  return (
    <div className="">
      <div className="flex flex-col items-center justify-center">
        <div className="landing flex flex-col items-center">
          <h1 className="text-center text-4xl lg:text-7xl">
            Generate LinkedIn Post <br />
            <span
              style={{
                backgroundImage: "linear-gradient(to right, #9867F0, #ED4E50)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              For Any Topic
            </span>
          </h1>
        </div>

        {/* input section */}
        <div className="w-full max-w-[708px] pb-6">
          <InputArea
            promptValue={promptValue}
            setPromptValue={setPromptValue}
            handleDisplayResult={handleDisplayResult}
          />
        </div>

        {/* Suggestions section */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pb-[30px] lg:flex-nowrap lg:justify-normal">
          {suggestions.map((item) => (
            <div
              className="flex h-[35px] cursor-pointer items-center justify-center gap-[5px] rounded border border-solid border-white/30 bg-none px-2.5 py-2 text-white"
              onClick={() => handleClickSuggestion(item?.name)}
              key={item.id}
            >
              <Image
                src={item.icon}
                alt={item.name}
                width={18}
                height={16}
                className="w-[18px] invert"
              />
              <span className="text-sm font-light leading-[normal] text-white/70">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

type suggestionType = {
  id: number;
  name: string;
  icon: string;
};

const suggestions: suggestionType[] = [
  {
    id: 1,
    name: "Stock analysis on ",
    icon: "/img/stock2.svg",
  },
  {
    id: 2,
    name: "Generate a post about my new hobby ",
    icon: "/img/hiker.svg",
  },
  {
    id: 3,
    name: "Latest news about the  ",
    icon: "/img/news.svg",
  },
];

export default Hero;

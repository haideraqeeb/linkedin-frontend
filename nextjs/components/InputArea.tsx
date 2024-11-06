import Image from "next/image";
import { FC } from "react";
import TypeAnimation from "./TypeAnimation";

type TInputAreaProps = {
  promptValue: string;
  setPromptValue: React.Dispatch<React.SetStateAction<string>>;
  handleDisplayResult: () => void;
  disabled?: boolean;
  reset?: () => void;
};

const InputArea: FC<TInputAreaProps> = ({
  promptValue,
  setPromptValue,
  handleDisplayResult,
  disabled,
  reset,
}) => {
  return (
    <form
      className="mx-auto flex h-[120px] w-full flex-col items-center justify-between rounded-lg border-[1px] border-white/30 bg-[#202222] px-3 shadow-[2px_2px_38px_0px_rgba(0,0,0,0.25),0px_-2px_4px_0px_rgba(0,0,0,0.25)_inset,1px_2px_4px_0px_rgba(0,0,0,0.25)_inset]"
      onSubmit={(e) => {
        e.preventDefault();
        if (reset) reset();
        handleDisplayResult();
      }}
    >
      <input
        type="text"
        placeholder="What would you like me to research next?"
        className="focus-visible::outline-0 my-1 w-full bg-[#202222] py-2 pl-5 font-light not-italic leading-[normal] text-[#1B1B16]/30 text-white outline-none focus-visible:ring-0 focus-visible:ring-offset-0 sm:text-lg"
        disabled={disabled}
        value={promptValue}
        required
        onChange={(e) => setPromptValue(e.target.value)}
      />
      <div className="flex w-full items-end justify-end pb-2">
        <button
          disabled={disabled}
          type="submit"
          className="relative flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-[#2f302f] disabled:pointer-events-none disabled:opacity-75"
        >
          {disabled && (
            <div className="absolute inset-0 flex items-center justify-center">
              <TypeAnimation />
            </div>
          )}

          <Image
            unoptimized
            src={"/img/arrow-narrow-right.svg"}
            alt="search"
            width={24}
            height={24}
            className={disabled ? "invisible" : ""}
          />
        </button>
      </div>
    </form>
  );
};

export default InputArea;

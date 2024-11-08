import Image from "next/image";

interface SubQuestionsProps {
  metadata: string[];
  handleClickSuggestion: (value: string) => void;
}

const SubQuestions: React.FC<SubQuestionsProps> = ({
  metadata,
  handleClickSuggestion,
}) => {
  return (
    <div className="container flex w-full items-start gap-3 pt-2">
      <div className="flex w-fit items-center gap-4">
        <Image
          src={"/img/thinking.svg"}
          alt="thinking"
          width={30}
          height={30}
          className="size-[24px]"
        />
      </div>
      <div className="grow text-white">
        <p className="pb-[30px] pr-5 font-bold leading-[152%] text-white">
          Pondering your question from several angles
        </p>
        <div className="flex flex-row flex-wrap items-center gap-2.5 pb-[20px]">
          {metadata.map((item, subIndex) => (
            <div
              className="flex cursor-pointer items-center justify-center gap-[5px] rounded-md border border-solid border-white/20 bg-[#191A1A] px-2.5 py-2"
              onClick={() => handleClickSuggestion(item)}
              key={`${item}-${subIndex}`}
            >
              <span className="text-sm font-light leading-[normal] text-white/70">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubQuestions;

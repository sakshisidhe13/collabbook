import { useState } from "react";
import { toast } from "react-toastify";
import { useShareEntryMutation } from "../../redux/api/entriesApiSlice";

import ReadMore from "./ReadMore";
import EditEntry from "./EditEntry";
import DeleteEntry from "./DeleteEntry";

const EntryCard = ({
  id,
  date,
  title,
  mood,
  content,
  updatedAt,
  highlightText,
}) => {
  const [shareUserId, setShareUserId] = useState("");
  const [shareEntry] = useShareEntryMutation();

  const formattedDate = new Date(date).toLocaleDateString("default", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedUpdateAt = new Date(updatedAt).toLocaleDateString("default", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const contentLimit =
    content.length > 300 ? `${content.slice(0, 300)}...` : content;

  const highlightMatch = (text) => {
    if (!highlightText) return text;
    const parts = text.split(new RegExp(`(${highlightText})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === highlightText.toLowerCase() ? (
        <span key={index} className="text-secondary">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const handleShare = async (e) => {
    e.preventDefault();
    if (!shareUserId) return toast.error("Please enter an email address");

    try {
      await shareEntry({ entryId: id, email: shareUserId }).unwrap();
      toast.success("Entry shared successfully!");
      setShareUserId("");
    } catch (err) {
      console.error(err);
      toast.error(err?.data?.message || "Failed to share entry");
    }
  };

  return (
    <div className="card bg-base-200 w-100 h-70 shadow-xl hover:shadow-2xl rounded-3xl">
      <div className="flex justify-between items-center pt-4 px-3">
        <p className="text-sm">{formattedDate}</p>
        <div className="flex gap-2">
          <EditEntry id={id} />
          <DeleteEntry id={id} />
        </div>
      </div>

      <div className="card-body p-4">
        <h2 className="card-title block">
          {mood} {highlightMatch(title)}
        </h2>
        <p className="break-words">{highlightMatch(contentLimit)}</p>
      </div>

      <div className="flex justify-between items-center pb-4 px-3">
        <div className="text-left text-sm">Edited: {formattedUpdateAt}</div>
        <div className="text-left text-sm">
          <ReadMore
            formattedDate={formattedDate}
            title={title}
            mood={mood}
            content={content}
            formattedUpdateAt={formattedUpdateAt}
          />
        </div>
      </div>

      <div className="px-3 pb-4">
        <form onSubmit={handleShare} className="flex items-center gap-2 mt-2">
          <input
            type="text"
            className="input input-sm w-full"
            placeholder="Enter user email"
            value={shareUserId}
            onChange={(e) => setShareUserId(e.target.value)}
          />
          <button type="submit" className="btn btn-sm btn-secondary">
            Share
          </button>
        </form>
      </div>
    </div>
  );
};

export default EntryCard;
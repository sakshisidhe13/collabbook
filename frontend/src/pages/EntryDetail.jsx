
import { useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import CollaborativeEditor from "../components/entry/CollaborativeEditor";

const EntryDetail = () => {
  const { id } = useParams(); // entryId
  const [entry, setEntry] = useState(null);

  useEffect(() => {
    axios.get(`/api/entries/${id}`, { withCredentials: true }).then((res) => {
      setEntry(res.data);
    });
  }, [id]);

  if (!entry) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">{entry.title}</h2>
      <CollaborativeEditor entryId={id} initialContent={entry.content} />
    </div>
  );
};

export default EntryDetail;
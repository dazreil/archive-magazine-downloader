import axios from "axios";

export default async function handler(req, res) {
  const searchTerm = req.query.q || "*";
  const query = `collection:"magazinerack" ${searchTerm}`;
  const url = `https://archive.org/advancedsearch.php?q=${encodeURIComponent(query)}&fl[]=identifier&fl[]=title&rows=20&output=json`;

  const { data } = await axios.get(url);
  const docs = data.response.docs;

  res.status(200).json({
    results: docs.map(doc => ({
      identifier: doc.identifier,
      title: doc.title
    }))
  });
}
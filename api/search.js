import axios from "axios";

export default async function handler(req, res) {
  const searchTerm = req.query.q || "";
  const url = `https://archive.org/advancedsearch.php?q=collection%3A%22magazinerack%22+AND+title%3A${encodeURIComponent(searchTerm)}&fl[]=identifier&fl[]=title&rows=10&output=json`;

  const { data } = await axios.get(url);
  const docs = data.response.docs;

  res.status(200).json({
    results: docs.map(doc => ({
      identifier: doc.identifier,
      title: doc.title
    }))
  });
}

import axios from "axios";

export default async function handler(req, res) {
  const { identifier } = req.query;

  const metaUrl = `https://archive.org/metadata/${identifier}`;
  const { data } = await axios.get(metaUrl);

  const pdfFile = data.files.find(f => f.name.endsWith(".pdf"));

  if (!pdfFile) {
    return res.status(404).send("PDF not found");
  }

  const downloadUrl = `https://archive.org/download/${identifier}/${encodeURIComponent(pdfFile.name)}`;
  res.redirect(downloadUrl);
}

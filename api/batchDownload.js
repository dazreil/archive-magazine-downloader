import axios from "axios";
import archiver from "archiver";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { ids } = req.body;

  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Disposition", "attachment; filename=magazines.zip");

  const archive = archiver("zip");
  archive.pipe(res);

  for (const id of ids) {
    const metaUrl = `https://archive.org/metadata/${id}`;
    const { data } = await axios.get(metaUrl);
    const pdfFile = data.files.find(f => f.name.endsWith(".pdf"));

    if (pdfFile) {
      const pdfUrl = `https://archive.org/download/${id}/${encodeURIComponent(pdfFile.name)}`;
      const pdfStream = await axios.get(pdfUrl, { responseType: "stream" });
      archive.append(pdfStream.data, { name: `${id}.pdf` });
    }
  }

  await archive.finalize();
}

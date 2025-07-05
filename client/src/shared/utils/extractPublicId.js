function extractPublicId(url) {
  const regex = /\/upload\/v\d+\/([^\.]+)\.\w+$/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export default extractPublicId;
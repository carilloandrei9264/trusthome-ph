function canReadSecureDocument(userId, userProfile, path) {
  if (!userId || userProfile?.status !== "active" || typeof path !== "string") return false;

  const [collection, pathUserId, listingId, fileName, ...extraSegments] = path.split("/");
  if (collection !== "verification" || !pathUserId || !listingId || !fileName || extraSegments.length) {
    return false;
  }

  return pathUserId === userId || userProfile.role === "admin";
}

module.exports = { canReadSecureDocument };

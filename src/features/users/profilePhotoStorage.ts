import { getSupabaseClient, profilePhotoBucket } from "@/lib/supabase/client";

const maxProfilePhotoSize = 4 * 1024 * 1024;

function extensionFromFile(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "");

  if (extension) {
    return extension;
  }

  if (file.type === "image/png") {
    return "png";
  }

  if (file.type === "image/webp") {
    return "webp";
  }

  return "jpg";
}

function profilePhotoFolder(firebaseUid: string) {
  return `profiles/${firebaseUid}`;
}

function profilePhotoName(firebaseUid: string, extension: string) {
  return `avatar-${firebaseUid}.${extension}`;
}

export async function uploadProfilePhoto({
  file,
  firebaseUid,
}: {
  file: File;
  firebaseUid: string;
}) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file.");
  }

  if (file.size > maxProfilePhotoSize) {
    throw new Error("Profile photo must be smaller than 4MB.");
  }

  const supabase = getSupabaseClient();

  if (!supabase) {
    throw new Error("Supabase profile storage is not configured.");
  }

  const folder = profilePhotoFolder(firebaseUid);
  const extension = extensionFromFile(file);
  const fileName = profilePhotoName(firebaseUid, extension);
  const filePath = `${folder}/${fileName}`;

  const { data: previousFiles, error: listError } = await supabase.storage.from(profilePhotoBucket).list(folder);

  if (listError) {
    throw new Error(listError.message);
  }

  const previousPhotoPaths =
    previousFiles
      ?.filter((item) => item.name.startsWith(`avatar-${firebaseUid}.`))
      .map((item) => `${folder}/${item.name}`) ?? [];

  if (previousPhotoPaths.length) {
    const { error: removeError } = await supabase.storage.from(profilePhotoBucket).remove(previousPhotoPaths);

    if (removeError) {
      throw new Error(removeError.message);
    }
  }

  const { error: uploadError } = await supabase.storage.from(profilePhotoBucket).upload(filePath, file, {
    cacheControl: "3600",
    upsert: true,
  });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data } = supabase.storage.from(profilePhotoBucket).getPublicUrl(filePath);

  return {
    path: filePath,
    publicUrl: `${data.publicUrl}?v=${Date.now()}`,
  };
}

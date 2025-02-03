import fetchApi from "@/features/shared/lib/fetchApi";

type PresignedPost = {
  key: string;
  url: string;
  presignedPost: any;
} | null;

type Param = {
  name: string;
  type: string;
  size: number;
};

type GetPresignedPost = (param: Param) => Promise<PresignedPost>;

const getPresignedPost: GetPresignedPost = async (param) => {
  const { name, type, size } = param;

  const params = new URLSearchParams({
    name,
    type,
    size: size.toString(),
    where: "chat",
  });

  const response = await fetchApi.get<{ result: PresignedPost }>(
    `/upload?${params}`
  );

  const res = response.data.result;
  if (res === null) return null;

  return {
    key: res.key,
    url: res.url,
    presignedPost: res.presignedPost,
  };
};

const uploadFile = async (file: File, name: string) => {
  const resPre = await getPresignedPost({
    name: name,
    type: file.type,
    size: file.size,
  });

  if (!resPre) return Promise.reject("Error in upload file");

  const { url, presignedPost } = resPre;

  const formData = new FormData();

  for (const key in presignedPost.fields) {
    formData.append(key, presignedPost.fields[key]);
  }

  formData.append("file", file);

  await fetch(presignedPost.url, {
    body: formData,
    method: "POST",
  });

  return url.replace(/\.s3\.amazonaws\.com/, "");
};

export default uploadFile;

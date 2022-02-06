import jwt_decode from "jwt-decode";

export const serverGet = async (url: string) => {
  return await fetch(url, {
    method: "GET",
    headers: {
      "Authorization": window.sessionStorage.getItem("auth"),
    },
  }).then((response) => response.json());
};

export const serverPost = async (url: string, body?: string) => {
  return await fetch(url, {
    method: "POST",
    body: body,
    headers: {
      "Content-Type": "application/json",
      "Authorization": window.sessionStorage.getItem("auth"),
    },
  }).then((response) => response.json());
};

export const authValid = (): boolean => {
  let auth;
  try {
    auth = jwt_decode(window.sessionStorage.getItem("auth"));
  } catch (e: any) {
    return false;
  }

  if (!auth["user"] || !auth["exp"]) {
    return false;
  }
  return true;
};

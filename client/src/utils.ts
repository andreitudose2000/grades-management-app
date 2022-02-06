import jwt_decode, { InvalidTokenError } from "jwt-decode";

export const parseCookie = (str) =>
  str
    .split(";")
    .map((v) => v.split("="))
    .reduce((acc, v) => {
      if (v[0]) {
        acc[decodeURIComponent(v[0] && v[0].trim())] = decodeURIComponent(v[1] && v[1].trim());
      }
      return acc;
    }, {});

export const serverPost = async (url: string, body?: string) => {
  return await fetch(url, {
    method: "POST",
    body: body,
    headers: {
      "Content-Type": "application/json",
      Authentication: window.sessionStorage.getItem("auth"),
    },
  });
};

export const authValid = (): boolean => {
  let auth;
  try {
    auth = jwt_decode(window.sessionStorage.getItem("auth"));
  } catch (e: any) {
    return false;
  }
  console.log(auth);
  if (!auth["user"] || !auth["exp"]) {
    return false;
  }
  return true;
};

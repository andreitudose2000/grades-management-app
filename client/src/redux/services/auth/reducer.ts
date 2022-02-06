import { baseUrl } from "../../../appConfig";

export const loginUser = (name: string, password: string) => async (dispatch, getState) => {
  const user = { name, password };
  const response = await fetch(`${baseUrl}/login`, {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => response.json());

  window.sessionStorage.setItem("auth", response["token"]);
};

export const registerUser = (name: string, password: string) => async (dispatch, getState) => {
  const user = { name, password };
  await fetch(`${baseUrl}/register`, {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

import Axios from "axios";
import { sassNull } from "sass";

var axios = Axios.create({
  withCredentials: true,
});

const BASE_URL = `//localhost:3030/api/user/`;
const USER_KEY = "userDB";

export const userService = {
  query,
  getById,
  save,
  remove,
  getDefaultFilter,
  getFilterFromSearchParams,
};

async function query(filterBy = {}) {
  let { data: users } = await axios.get(BASE_URL, {
    params: filterBy,
  });
  return users;
}

async function getById(userId) {
  const { data: user } = await axios.get(BASE_URL + userId);
  return user;
}

async function remove(userId) {
  return await axios.delete(BASE_URL + userId);
}

async function save(user) {
  const method = user._id ? "put" : "post";
  const { data: savedUser } = await axios[method](
    BASE_URL + (user._id || ""),
    user
  );
  return savedUser;
}

function getDefaultFilter() {
  return {
    fullname: "",
    username: "",
    score: null,
  };
}

function getFilterFromSearchParams(searchParams) {
  const defaultFilter = getDefaultFilter();
  const filterBy = {};
  for (const field in defaultFilter) {
    filterBy[field] = searchParams.get(field) || "";
  }
  console.log("filterby in server", filterBy);
  return filterBy;
}

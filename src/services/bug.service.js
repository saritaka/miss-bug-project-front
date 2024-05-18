import Axios from "axios";
import { sassNull } from "sass";

var axios = Axios.create({
  withCredentials: true,
});

const BASE_URL = `//localhost:3030/api/bug/`;
const BUG_KEY = "bugDB";

export const bugService = {
  query,
  getById,
  save,
  remove,
  getDefaultFilter,
  getFilterFromSearchParams,
};

async function query(filterBy = {}) {
  let { data: bugs } = await axios.get(BASE_URL, {
    params: filterBy,
  });

  // if (filterBy.txt) {
  //   console.log("filterby,txt", filterBy.txt);
  //   bugs = bugs.filter((bug) =>
  //     bug.title.toLowerCase().includes(filterBy.txt.toLowerCase())
  //   );
  // }

  // if (filterBy.severity) {
  //   bugs = bugs.filter((bug) => bug.severity >= filterBy.severity);
  // }
  // console.log("bugs", bugs);
  return bugs;
}

async function getById(bugId) {
  const { data: bug } = await axios.get(BASE_URL + bugId);
  return bug;
}

async function remove(bugId) {
  return await axios.delete(BASE_URL + bugId);
}

async function save(bug) {
  // const queryParams = `?_id=${bug._id || ""}&title=${bug.title}&severity=${
  //   bug.severity
  // }&description=${bug.description}`;
  // const { data: savedCar } = await axios.get(BASE_URL + "save/" + queryParams);
  const method = bug._id ? "put" : "post";
  const { data: savedBug } = await axios[method](
    BASE_URL + (bug._id || ""),
    bug
  );
  return savedBug;
}

function getDefaultFilter() {
  return {
    txt: "",
    severity: 0,
    pageIdx: 0,
    sortBy: null,
    sortDir: 0,
    label: null,
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
